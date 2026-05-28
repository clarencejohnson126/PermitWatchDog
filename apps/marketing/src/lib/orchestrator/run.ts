// T0 orchestrator — runs after the nightly scraper.
// For each active Project, scans NEW filings (those created since the last
// orchestrator run or last N days) for keyword piercing matches. Each unique
// pierce creates an Alert row that the dispatcher then turns into an email.

import { prisma } from '@/lib/db/prisma';
import { matchFilingAgainstProject, type PierceMatch } from './matcher';

export interface OrchestratorSummary {
  started_at: string;
  completed_at: string;
  duration_ms: number;
  projects_scanned: number;
  filings_scanned: number;
  alerts_created: number;
  alerts_skipped_duplicate: number;
  errors_count: number;
  per_project: { project_id: string; new_alerts: number }[];
}

const DEFAULT_LOOKBACK_DAYS = 14;
const MAX_FILINGS_PER_RUN = 500;

export async function runOrchestrator(opts: { lookbackDays?: number } = {}): Promise<OrchestratorSummary> {
  const started_at = new Date();
  const lookback = opts.lookbackDays ?? DEFAULT_LOOKBACK_DAYS;
  const cutoff = new Date(Date.now() - lookback * 24 * 60 * 60 * 1000);

  // Only consider projects that are actually under construction or approved.
  const projects = await prisma.project.findMany({
    where: {
      lifecycle_stage: { in: ['approved', 'under_construction'] },
    },
  });

  // Newly-scraped filings (by created_at). We use created_at NOT publish_date
  // so we don't re-process the same filing every night — Alert table's UNIQUE
  // (project_id, filing_id) is the final guard.
  const filings = await prisma.filing.findMany({
    where: {
      created_at: { gte: cutoff },
      parse_confidence: { in: ['high', 'low'] },
    },
    orderBy: { created_at: 'desc' },
    take: MAX_FILINGS_PER_RUN,
  });

  let alertsCreated = 0;
  let alertsSkipped = 0;
  let errors = 0;
  const perProject: OrchestratorSummary['per_project'] = [];

  for (const project of projects) {
    let projectAlerts = 0;

    for (const filing of filings) {
      let matches: PierceMatch[];
      try {
        matches = matchFilingAgainstProject(
          filing.content_text,
          filing.title,
          project.bescheid_auflagen,
        );
      } catch (e) {
        errors += 1;
        console.error(`[orchestrator] match failed (project=${project.id}, filing=${filing.id})`, e);
        continue;
      }
      if (matches.length === 0) continue;

      // Strongest match wins (only 1 alert per project+filing pair).
      const strongest = matches.reduce((a, b) =>
        severityRank(b.severity) > severityRank(a.severity) ? b : a,
      );

      try {
        await prisma.alert.create({
          data: {
            project_id: project.id,
            filing_id: filing.id,
            pierce_severity: strongest.severity,
            pierced_auflage: strongest.auflage_text,
            doctrine_reasoning: {
              method: 't0_keyword',
              matched_keyword: strongest.matched_keyword,
              matched_excerpt: strongest.matched_excerpt,
              auflage_index: strongest.auflage_index,
              all_matches: matches.map(({ auflage_index, matched_keyword, severity }) => ({
                auflage_index,
                matched_keyword,
                severity,
              })),
            },
          },
        });
        alertsCreated += 1;
        projectAlerts += 1;
      } catch (e) {
        // P2002 = unique constraint violation = already alerted on this pair.
        if (isUniqueViolation(e)) {
          alertsSkipped += 1;
        } else {
          errors += 1;
          console.error(`[orchestrator] alert insert failed`, e);
        }
      }
    }

    perProject.push({ project_id: project.id, new_alerts: projectAlerts });
  }

  const completed_at = new Date();
  return {
    started_at: started_at.toISOString(),
    completed_at: completed_at.toISOString(),
    duration_ms: completed_at.getTime() - started_at.getTime(),
    projects_scanned: projects.length,
    filings_scanned: filings.length,
    alerts_created: alertsCreated,
    alerts_skipped_duplicate: alertsSkipped,
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
