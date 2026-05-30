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
const MAX_PARALLEL_JUDGES = 6;            // within one project: parallel Gemini calls
const MAX_PARALLEL_PROJECTS = 10;         // across projects: process in chunks of N
                                          // total live Gemini concurrency = 10 × 6 = 60
                                          // stays well under Flash-Lite 1000 RPM cap
// Source types that almost never describe regulatory changes — skip outright.
const IGNORED_SOURCE_TYPES = new Set(['vergabe']);

export async function runOrchestrator(opts: { lookbackDays?: number } = {}): Promise<OrchestratorSummary> {
  const started_at = new Date();
  const lookback = opts.lookbackDays ?? DEFAULT_LOOKBACK_DAYS;
  const cutoff = new Date(Date.now() - lookback * 24 * 60 * 60 * 1000);

  const projects = await prisma.project.findMany({
    where: { lifecycle_stage: { in: ['approved', 'under_construction'] } },
  });

  // Note: filings are pre-loaded per-project below, scoped to that project's
  // city. Iterating filings city-agnostically would waste Gemini calls
  // matching e.g. a Mannheim project against San Francisco permits.
  let totalFilingsScanned = 0;

  // Aggregated counters — populated from per-project results.
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

  interface ProjectResult {
    project_id: string;
    new_alerts: number;
    candidates: number;
    pierced: number;
    filings_seen: number;
    candidate_matches: number;
    geo_rejected: number;
    judged_total: number;
    judged_pierced: number;
    judged_noise: number;
    alerts_created: number;
    alerts_skipped: number;
    judge_errors: number;
    errors: number;
  }

  // Per-project worker. Each project's work is self-contained; running them
  // in parallel is safe because the alerts table has a unique (project_id,
  // filing_id) constraint that prevents accidental duplicates from race.
  async function processProject(project: typeof projects[number]): Promise<ProjectResult> {
    let projectAlerts = 0;
    let projectCandidates = 0;
    let projectPierced = 0;
    let pjGeoRejected = 0;
    let pjJudgedTotal = 0;
    let pjJudgedPierced = 0;
    let pjJudgedNoise = 0;
    let pjAlertsCreated = 0;
    let pjAlertsSkipped = 0;
    let pjJudgeErrors = 0;
    let pjErrors = 0;

    const bescheidIssuedAt = project.bescheid_date ?? project.created_at;

    const projectCity = (project.city ?? project.gemarkung ?? '').trim();
    if (!projectCity) {
      console.warn(`[orchestrator] project ${project.id} has no city; skipping`);
      return {
        project_id: project.id, new_alerts: 0, candidates: 0, pierced: 0,
        filings_seen: 0, candidate_matches: 0, geo_rejected: 0,
        judged_total: 0, judged_pierced: 0, judged_noise: 0,
        alerts_created: 0, alerts_skipped: 0, judge_errors: 0, errors: 0,
      };
    }

    const filings = await prisma.filing.findMany({
      where: {
        publish_date: { gte: cutoff },
        parse_confidence: { in: ['high', 'low'] },
        gemeinde: { equals: projectCity, mode: 'insensitive' },
      },
      orderBy: { publish_date: 'desc' },
      take: MAX_FILINGS_PER_RUN,
    });

    // Build the candidate list first so we can parallel-judge in batches.
    type Candidate = { filing: typeof filings[number]; match: PierceMatch };
    const candidates: Candidate[] = [];

    for (const filing of filings) {
      if (IGNORED_SOURCE_TYPES.has(filing.source_type)) continue;
      const filingBeforeBescheid =
        filing.publish_date.getTime() < bescheidIssuedAt.getTime() - 90 * 24 * 60 * 60 * 1000;
      if (filingBeforeBescheid) continue;

      let matches: PierceMatch[];
      try {
        matches = matchFilingAgainstProject(
          filing.content_text,
          filing.title,
          project.bescheid_auflagen,
          project.country ?? 'DE',
        );
      } catch (e) {
        pjErrors += 1;
        console.error(`[orchestrator] match failed (project=${project.id}, filing=${filing.id})`, e);
        continue;
      }
      if (matches.length === 0) continue;

      const geo = geoCheck(
        { address: project.address, gemarkung: project.gemarkung },
        { title: filing.title, content_text: filing.content_text, gemeinde: filing.gemeinde },
      );
      if (geo.decision === 'reject') {
        pjGeoRejected += 1;
        continue;
      }

      const strongest = matches.reduce((a, b) => (severityRank(b.severity) > severityRank(a.severity) ? b : a));
      candidates.push({ filing, match: strongest });
    }

    projectCandidates = candidates.length;

    // Parallel judge in chunks of MAX_PARALLEL_JUDGES.
    for (let i = 0; i < candidates.length; i += MAX_PARALLEL_JUDGES) {
      const chunk = candidates.slice(i, i + MAX_PARALLEL_JUDGES);
      const results = await Promise.allSettled(
        chunk.map((c) =>
          judgeMatch({
            auflage_text: c.match.auflage_text,
            bescheid_issued_at: bescheidIssuedAt,
            lifecycle_stage: project.lifecycle_stage,
            country: project.country ?? 'DE',
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
        pjJudgedTotal += 1;

        if (res.status === 'rejected') {
          pjJudgeErrors += 1;
          console.error(`[orchestrator] judge failed`, res.reason);
          continue;
        }

        const verdict = res.value;
        if (!verdict.pierces) {
          pjJudgedNoise += 1;
          continue;
        }
        pjJudgedPierced += 1;
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
          pjAlertsCreated += 1;
          projectAlerts += 1;
        } catch (e) {
          if (isUniqueViolation(e)) {
            pjAlertsSkipped += 1;
          } else {
            pjErrors += 1;
            console.error(`[orchestrator] alert insert failed`, e);
          }
        }
      }
    }

    return {
      project_id: project.id,
      new_alerts: projectAlerts,
      candidates: projectCandidates,
      pierced: projectPierced,
      filings_seen: filings.length,
      candidate_matches: projectCandidates,
      geo_rejected: pjGeoRejected,
      judged_total: pjJudgedTotal,
      judged_pierced: pjJudgedPierced,
      judged_noise: pjJudgedNoise,
      alerts_created: pjAlertsCreated,
      alerts_skipped: pjAlertsSkipped,
      judge_errors: pjJudgeErrors,
      errors: pjErrors,
    };
  }

  // PARALLELIZE across projects in chunks of MAX_PARALLEL_PROJECTS.
  // 100 customers × 3 projects → 30 chunks of 10 → ~30 × per-project-latency
  // instead of 300 × per-project-latency. With 6 parallel judges inside each
  // project, peak concurrent Gemini calls = 10 × 6 = 60 (safe under most rate limits).
  for (let i = 0; i < projects.length; i += MAX_PARALLEL_PROJECTS) {
    const chunk = projects.slice(i, i + MAX_PARALLEL_PROJECTS);
    const chunkResults = await Promise.all(chunk.map(processProject));
    for (const r of chunkResults) {
      totalFilingsScanned += r.filings_seen;
      candidateMatches += r.candidate_matches;
      geoRejected += r.geo_rejected;
      judgedTotal += r.judged_total;
      judgedPierced += r.judged_pierced;
      judgedNoise += r.judged_noise;
      alertsCreated += r.alerts_created;
      alertsSkipped += r.alerts_skipped;
      judgeErrors += r.judge_errors;
      errors += r.errors;
      perProject.push({
        project_id: r.project_id,
        new_alerts: r.new_alerts,
        candidates: r.candidates,
        pierced: r.pierced,
      });
    }
  }

  const completed_at = new Date();
  return {
    started_at: started_at.toISOString(),
    completed_at: completed_at.toISOString(),
    duration_ms: completed_at.getTime() - started_at.getTime(),
    projects_scanned: projects.length,
    filings_scanned: totalFilingsScanned,
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
