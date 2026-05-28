// Scraper runner — wraps a scraper, persists records to Supabase via Prisma,
// and emits a ScraperRun summary. Used by both the Vercel cron route and the
// local backfill CLI.

import { MannheimScraper } from './mannheim';
import type { ScrapedRecord } from './types';
import { prisma } from '../db/prisma';

export interface RunnerOptions {
  /** Skip records older than this. If omitted, derived from the most recent
   *  successful scraper_run.completed_at. */
  since?: Date;
  /** Hard cap on records per run (protects against unexpected list explosions). */
  maxRecords?: number;
  /** If true, no DB writes — useful for smoke tests. */
  dryRun?: boolean;
}

export interface RunSummary {
  started_at: string;
  completed_at: string;
  duration_ms: number;
  total_scraped: number;
  new_filings: number;
  updated_filings: number;
  errors_count: number;
  source_breakdown: Record<string, number>;
  since_used: string | null;
  dryRun: boolean;
}

async function inferSince(): Promise<Date | undefined> {
  // Take the last successful run's completed_at, minus a 12h overlap so we
  // catch anything that was published right after the previous run ended.
  const last = await prisma.scraperRun.findFirst({
    where: { errors_count: 0 },
    orderBy: { completed_at: 'desc' },
  });
  if (!last) return undefined;
  return new Date(last.completed_at.getTime() - 12 * 60 * 60 * 1000);
}

async function persistRecord(rec: ScrapedRecord): Promise<'created' | 'updated'> {
  const existing = await prisma.filing.findUnique({ where: { source_url: rec.source_url } });
  if (existing) {
    await prisma.filing.update({
      where: { source_url: rec.source_url },
      data: {
        publish_date: rec.publish_date,
        title: rec.title,
        content_text: rec.content_text,
        auslegung_end_date: rec.auslegung_end_date ?? undefined,
        parse_confidence: rec.parse_confidence ?? undefined,
      },
    });
    return 'updated';
  }
  await prisma.filing.create({
    data: {
      source_url: rec.source_url,
      publish_date: rec.publish_date,
      gemeinde: rec.gemeinde,
      title: rec.title,
      content_text: rec.content_text,
      auslegung_end_date: rec.auslegung_end_date ?? undefined,
      parse_confidence: rec.parse_confidence ?? undefined,
      source_type: rec.source_type,
    },
  });
  return 'created';
}

export async function runScraper(opts: RunnerOptions = {}): Promise<RunSummary> {
  const started_at = new Date();
  const since = opts.since ?? (await inferSince());
  const scraper = new MannheimScraper();

  let records: ScrapedRecord[] = [];
  let errors = 0;
  try {
    records = await scraper.run({ since, maxRecords: opts.maxRecords ?? 200 });
  } catch (e) {
    errors += 1;
    console.error('[runner] scraper threw:', e);
  }

  let newCount = 0;
  let updatedCount = 0;
  const breakdown: Record<string, number> = {};

  if (!opts.dryRun) {
    for (const rec of records) {
      try {
        const result = await persistRecord(rec);
        if (result === 'created') newCount += 1;
        else updatedCount += 1;
        breakdown[rec.source_type] = (breakdown[rec.source_type] ?? 0) + 1;
      } catch (e) {
        errors += 1;
        console.error(`[runner] persist failed for ${rec.source_url}:`, e);
      }
    }
  } else {
    for (const rec of records) breakdown[rec.source_type] = (breakdown[rec.source_type] ?? 0) + 1;
  }

  const completed_at = new Date();
  if (!opts.dryRun) {
    await prisma.scraperRun.create({
      data: {
        started_at,
        completed_at,
        total_filings_ingested: newCount + updatedCount,
        errors_count: errors,
        source_breakdown: { ...breakdown, new: newCount, updated: updatedCount, since: since?.toISOString() ?? null },
      },
    });
  }

  return {
    started_at: started_at.toISOString(),
    completed_at: completed_at.toISOString(),
    duration_ms: completed_at.getTime() - started_at.getTime(),
    total_scraped: records.length,
    new_filings: newCount,
    updated_filings: updatedCount,
    errors_count: errors,
    source_breakdown: breakdown,
    since_used: since?.toISOString() ?? null,
    dryRun: !!opts.dryRun,
  };
}
