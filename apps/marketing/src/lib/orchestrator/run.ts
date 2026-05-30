// T0+ orchestrator — keyword pre-filter + Gemini doctrine judge.
//
// Pipeline per (project, filing):
//   1. Keyword matcher (cheap, pure JS) — finds CANDIDATE matches.
//   2. Pre-filters drop low-value sources (Vergaben) + too-old filings.
//   3. Gemini judge — reads context, applies Bestandsschutz/etc, decides.
//   4. Only inserts an Alert if judge.pierces === true.
//
// Cost ≈ $0.005 / nightly run (assumes ~50 keyword candidates × 1 Gemini
// Flash Lite call). Cuts T0 false-positive volume by 80-95%.

import { prisma } from '@/lib/db/prisma';
import { matchFilingAgainstProject, type PierceMatch } from './matcher';
import { judgeMatch } from '@/lib/doctrine/judge';
import { geoCheck } from './geo-filter';

export interface OrchestratorSummary {
  started_at: string;
  completed_at: string;
  duration_ms: number;
  projects_scanned: number;
  filings_scanned: number;
  candidate_matches: number;
  geo_rejected: number;
  judged_total: number;
  judged_pierced: number;
  judged_noise: number;
  alerts_created: number;
  alerts_skipped_duplicate: number;
  judge_errors: number;
  errors_count: number;
  per_project: { project_id: string; new_alerts: number; candidates: number; pierced: number }[];
}

const DEFAULT_LOOKBACK_DAYS = 365;       // recent regulatory activity only
const MAX_FILINGS_PER_RUN = 200;
const MAX_PARALLEL_JUDGES = 6;            // mild Gemini rate-limit friendliness
// Source types that almost never describe regulatory changes — skip outright.
const IGNORED_SOURCE_TYPES = new Set(['vergabe']);

export async function runOrchestrator(opts: { lookbackDays?: number } = {}): Promise<OrchestratorSummary> {
  const started_at = new Date();
  const lookback = opts.lookbackDays ?? DEFAULT_LOOKBACK_DAYS;
  const cutoff = new Date(Date.now() - lookback * 24 * 60 * 60 * 1000);

  const projects = await prisma.project.findMany({
    where: { lifecycle_stage: { in: ['approved', 'under_construction'] } },
  });

  const filings = await prisma.filing.findMany({
    where: {
      publish_date: { gte: cutoff },           // ① recency pre-filter
      parse_confidence: { in: ['high', 'low'] },
    },
    orderBy: { publish_date: 'desc' },
    take: MAX_FILINGS_PER_RUN,
  });

  let candidateMatches = 0;
  let geoRejected = 0;
  let judgedTotal = 0;
  let judgedPierced = 0;
  let judgedNoise = 0;
  let alertsCreated = 0;
  let alertsSkipped = 0;
  let judgeErrors = 0;
  let errors = 0;
  const perProject: OrchestratorSummary['per_project'] = [];

  for (const project of projects) {
    let projectAlerts = 0;
    let projectCandidates = 0;
    let projectPierced = 0;

    // Bestandsschutz timing — use the actual Bescheid date from the PDF if
    // Gemini extracted it; otherwise fall back to upload date.
    const bescheidIssuedAt = project.bescheid_date ?? project.created_at;

    // Build the candidate list first so we can parallel-judge in batches.
    type Candidate = { filing: typeof filings[number]; match: PierceMatch };
    const candidates: Candidate[] = [];

    for (const filing of filings) {
      if (IGNORED_SOURCE_TYPES.has(filing.source_type)) continue;     // ② source pre-filter
      // ③ Bestandsschutz pre-filter: filings that predate the Bescheid
      // by more than 90 days were already "in effect" when the permit was
      // granted — they cannot pierce it.
      const filingBeforeBescheid =
        filing.publish_date.getTime() < bescheidIssuedAt.getTime() - 90 * 24 * 60 * 60 * 1000;
      if (filingBeforeBescheid) continue;

      let matches: PierceMatch[];
      try {
        matches = matchFilingAgainstProject(filing.content_text, filing.title, project.bescheid_auflagen);
      } catch (e) {
        errors += 1;
        console.error(`[orchestrator] match failed (project=${project.id}, filing=${filing.id})`, e);
        continue;
      }
      if (matches.length === 0) continue;

      // ④ Geographic pre-filter — kill Sandhofen-style false-positives BEFORE Gemini.
      // This was the key precision fix: a filing about Werner-Nagel-Ring in
      // Mannheim-Sandhofen has zero impact on a project in the Quadrate.
      const geo = geoCheck(
        { address: project.address, gemarkung: project.gemarkung },
        { title: filing.title, content_text: filing.content_text, gemeinde: filing.gemeinde },
      );
      if (geo.decision === 'reject') {
        geoRejected += 1;
        continue;
      }

      const strongest = matches.reduce((a, b) => (severityRank(b.severity) > severityRank(a.severity) ? b : a));
      candidates.push({ filing, match: strongest });
    }

    projectCandidates = candidates.length;
    candidateMatches += projectCandidates;

    // Parallel judge in chunks of MAX_PARALLEL_JUDGES.
    for (let i = 0; i < candidates.length; i += MAX_PARALLEL_JUDGES) {
      const chunk = candidates.slice(i, i + MAX_PARALLEL_JUDGES);
      const results = await Promise.allSettled(
        chunk.map((c) =>
          judgeMatch({
            auflage_text: c.match.auflage_text,
            bescheid_issued_at: bescheidIssuedAt,
            lifecycle_stage: project.lifecycle_stage,
            filing_title: c.filing.title,
            filing_content: c.filing.content_text,
            filing_publish_date: c.filing.publish_date,
            filing_source_type: c.filing.source_type,
            matched_keyword: c.match.matched_keyword,
          }),
        ),
      );

      for (let j = 0; j < chunk.length; j++) {
        const cand = chunk[j];
        const res = results[j];
        judgedTotal += 1;

        if (res.status === 'rejected') {
          judgeErrors += 1;
          console.error(`[orchestrator] judge failed`, res.reason);
          continue;
        }

        const verdict = res.value;
        if (!verdict.pierces) {
          judgedNoise += 1;
          continue;
        }
        judgedPierced += 1;
        projectPierced += 1;

        try {
          await prisma.alert.create({
            data: {
              project_id: project.id,
              filing_id: cand.filing.id,
              pierce_severity: verdict.severity ?? cand.match.severity,
              pierced_auflage: cand.match.auflage_text,
              doctrine_reasoning: {
                method: 't1_gemini_judge',
                model: 'gemini-3.1-flash-lite',
                matched_keyword: cand.match.matched_keyword,
                matched_excerpt: cand.match.matched_excerpt,
                auflage_index: cand.match.auflage_index,
                doctrine_layer: verdict.doctrine_layer_applied,
                reasoning: verdict.reasoning_de,
                confidence: verdict.confidence,
              },
            },
          });
          alertsCreated += 1;
          projectAlerts += 1;
        } catch (e) {
          if (isUniqueViolation(e)) {
            alertsSkipped += 1;
          } else {
            errors += 1;
            console.error(`[orchestrator] alert insert failed`, e);
          }
        }
      }
    }

    perProject.push({ project_id: project.id, new_alerts: projectAlerts, candidates: projectCandidates, pierced: projectPierced });
  }

  const completed_at = new Date();
  return {
    started_at: started_at.toISOString(),
    completed_at: completed_at.toISOString(),
    duration_ms: completed_at.getTime() - started_at.getTime(),
    projects_scanned: projects.length,
    filings_scanned: filings.length,
    candidate_matches: candidateMatches,
    geo_rejected: geoRejected,
    judged_total: judgedTotal,
    judged_pierced: judgedPierced,
    judged_noise: judgedNoise,
    alerts_created: alertsCreated,
    alerts_skipped_duplicate: alertsSkipped,
    judge_errors: judgeErrors,
    errors_count: errors,
    per_project: perProject,
  };
}

function severityRank(s: 'high' | 'medium' | 'low'): number {
  return s === 'high' ? 3 : s === 'medium' ? 2 : 1;
}

function isUniqueViolation(e: unknown): boolean {
  return typeof e === 'object' && e !== null && 'code' in e && (e as { code?: string }).code === 'P2002';
}
