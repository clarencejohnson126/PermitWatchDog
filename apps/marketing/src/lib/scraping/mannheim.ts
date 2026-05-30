// Mannheim Bauamt + Amtsblatt scraper.
// Ported from services/scraper/src/mannheim.ts so it can run as part of the
// Next.js app on Vercel (with the 10s Hobby / 60s Pro function timeout).
//
// Strategy for the timeout: this scraper is INCREMENTAL — it accepts a
// `since` Date and skips records older than that. Daily runs should only
// see 0-3 new filings and complete in <5s. The first backfill needs to be
// run locally via scripts/backfill.ts (no timeout).

import * as cheerio from 'cheerio';
import { HttpClient } from './http';
import type { ScrapedRecord, SourceType, ParseConfidence } from './types';

// pdf-parse v1 — pure JS, runs in Vercel/Lambda. v2 needs @napi-rs/canvas
// which isn't available in serverless. We require the inner lib path to
// bypass v1's known test-PDF-on-import bug.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse/lib/pdf-parse.js') as (buf: Buffer) => Promise<{ text: string; numpages: number }>;

const MONTH_DE: Record<string, number> = {
  Januar: 0, Februar: 1, März: 2, April: 3, Mai: 4, Juni: 5,
  Juli: 6, August: 7, September: 8, Oktober: 9, November: 10, Dezember: 11,
};

export class MannheimScraper {
  public readonly gemeindeName = 'Mannheim';
  private readonly http = new HttpClient();
  private readonly maxPdfBytes = 25 * 1024 * 1024;

  /**
   * Parse an Amtsblatt PDF filename like
   *   `KW%2020_260516.pdf`  → KW 20, 2026-05-16
   *   `KW 03_240118.pdf`    → KW 3, 2024-01-18
   *   `KW20_0516.pdf`       → KW 20, year inferred from URL `/2026-05/`
   */
  private parseAmtsblattFilename(href: string): { kw: string; publish_date: Date } {
    const filename = href.split('/').pop() ?? '';
    const m = filename.match(/KW(?:%20|\s*)(\d+)_(\d{4,6})(?:_[^.]+)?\.pdf/i);
    if (!m) throw new Error(`Filename pattern mismatch: ${filename}`);
    const kw = m[1];
    const dateStr = m[2];

    let year = 0, month = 0, day = 0;
    if (dateStr.length === 6) {
      year = 2000 + parseInt(dateStr.slice(0, 2), 10);
      month = parseInt(dateStr.slice(2, 4), 10);
      day = parseInt(dateStr.slice(4, 6), 10);
    } else if (dateStr.length === 4) {
      const yr = href.match(/\/(\d{4})-\d{2}\//);
      if (!yr) throw new Error(`No year hint for MMDD pattern in ${href}`);
      year = parseInt(yr[1], 10);
      month = parseInt(dateStr.slice(0, 2), 10);
      day = parseInt(dateStr.slice(2, 4), 10);
    } else {
      throw new Error(`Unexpected dateStr length: ${dateStr}`);
    }
    return { kw, publish_date: new Date(Date.UTC(year, month - 1, day)) };
  }

  /** Parse a DOM-rendered German date like "20. Mai 2026 - 10:12 bis 15. Juni 2026 - 23:59" */
  private parseDomDates(s: string): { publish_date: Date; auslegung_end_date: Date | null } {
    const parse = (str: string) => {
      const m = str.match(/(\d{1,2})\.\s+([A-Za-zä]+)\s+(\d{4})(?:\s*-\s*(\d{1,2}):(\d{2}))?/);
      if (!m) return null;
      const month = MONTH_DE[m[2]];
      if (month === undefined) return null;
      return new Date(Date.UTC(
        parseInt(m[3], 10),
        month,
        parseInt(m[1], 10),
        m[4] ? parseInt(m[4], 10) : 0,
        m[5] ? parseInt(m[5], 10) : 0,
      ));
    };

    const parts = s.split(/\s+bis\s+/);
    const publish_date = parse(parts[0]);
    if (!publish_date) throw new Error(`Could not parse date: ${s}`);
    const auslegung_end_date = parts[1] ? parse(parts[1]) : null;
    return { publish_date, auslegung_end_date };
  }

  private async processPdf(url: string, base: Partial<ScrapedRecord>): Promise<ScrapedRecord> {
    try {
      const headers = await this.http.head(url);
      const len = parseInt(headers['content-length'] ?? '0', 10);
      if (len > this.maxPdfBytes) {
        return { ...base, content_text: `[Skipped: PDF too large, ${len} bytes]`, parse_confidence: 'failed' } as ScrapedRecord;
      }
      const buf = await this.http.getBuffer(url);
      const out = await pdfParse(buf);
      const text = out.text ?? '';
      const confidence: ParseConfidence = text.length < 100 ? 'low' : 'high';
      return { ...base, content_text: text, parse_confidence: confidence } as ScrapedRecord;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ...base, content_text: `[PDF processing failed: ${msg}]`, parse_confidence: 'failed' } as ScrapedRecord;
    }
  }

  /**
   * Run the scraper. If `since` is given, records older than that date are
   * skipped — this lets nightly runs complete in seconds instead of minutes.
   *
   * Returns ALL records discovered (caller decides what's new via source_url
   * upsert).
   */
  async run(opts: { since?: Date; maxRecords?: number } = {}): Promise<ScrapedRecord[]> {
    const { since, maxRecords = 200 } = opts;
    const records: ScrapedRecord[] = [];

    const subpages: { url: string; type: SourceType }[] = [
      { url: 'https://www.mannheim.de/de/wirtschaft-entwickeln/oeffentliche-bekanntmachungen-aktuelle-planverfahren-vergaben/oeffentliche-bekanntmachungen', type: 'bekanntmachung' },
      { url: 'https://www.mannheim.de/de/wirtschaft-entwickeln/oeffentliche-bekanntmachungen-aktuelle-planverfahren-vergaben/vergaben', type: 'vergabe' },
      // High-signal: B-Plan changes are where Auflage-Piercing actually originates.
      { url: 'https://www.mannheim.de/de/wirtschaft-entwickeln/oeffentliche-bekanntmachungen-aktuelle-planverfahren-vergaben/aktuelle-planverfahren', type: 'bauleitplanung' },
      // Bauleitplanung index page itself (parent listing of all current B-Plan procedures).
      { url: 'https://www.mannheim.de/de/wirtschaft-entwickeln/leitlinien-und-strategien-fuer-die-stadtentwicklung/bauleitplanung', type: 'bauleitplanung' },
    ];

    // ── DOM subpages ──
    for (const page of subpages) {
      if (records.length >= maxRecords) break;
      let html: string;
      try {
        html = await this.http.getHtml(page.url);
      } catch {
        continue;
      }
      const $ = cheerio.load(html);
      const teasers = $('.teaser');

      for (let i = 0; i < teasers.length; i++) {
        if (records.length >= maxRecords) break;
        const el = teasers[i];
        const title = $(el).find('h2, h3, h4, .teaser__title').text().replace(/\s+/g, ' ').trim() || 'Untitled';
        const dateStr = $(el).find('.date, time, .teaser__date, .views-field-created').text().replace(/\s+/g, ' ').trim();
        if (!dateStr || dateStr.toLowerCase().includes('mail')) continue;

        let dates;
        try { dates = this.parseDomDates(dateStr); } catch { continue; }
        if (since && dates.publish_date < since) continue;

        let pdfLink = '';
        $(el).find('a').each((_, a) => {
          const href = $(a).attr('href');
          if (href && href.includes('download?token=')) pdfLink = href;
        });

        const base: Partial<ScrapedRecord> = {
          publish_date: dates.publish_date,
          auslegung_end_date: dates.auslegung_end_date,
          gemeinde: this.gemeindeName,
          title,
          source_type: page.type,
        };

        if (!pdfLink) {
          records.push({ ...base, source_url: `${page.url}#teaser-${i}`, content_text: '[No PDF Attached]' } as ScrapedRecord);
          continue;
        }
        const fullPdfUrl = pdfLink.startsWith('http') ? pdfLink : `https://www.mannheim.de${pdfLink}`;
        records.push(await this.processPdf(fullPdfUrl, { ...base, source_url: fullPdfUrl }));
      }
    }

    // ── Amtsblatt PDF archives ──
    const archives = [
      'https://www.mannheim.de/de/amtsblatt-der-stadt-mannheim/amtsblatt-2026',
      'https://www.mannheim.de/de/amtsblatt-der-stadt-mannheim/amtsblatt-2025',
    ];

    for (const url of archives) {
      if (records.length >= maxRecords) break;
      let html: string;
      try {
        html = await this.http.getHtml(url);
      } catch {
        continue;
      }
      const $ = cheerio.load(html);
      const hrefs = $('a').map((_, el) => $(el).attr('href')).get()
        .filter((h): h is string => typeof h === 'string' && h.toLowerCase().endsWith('.pdf') && h.includes('KW'));

      for (const href of hrefs) {
        if (records.length >= maxRecords) break;
        const fullUrl = href.startsWith('http') ? href : `https://www.mannheim.de${href}`;
        let meta;
        try { meta = this.parseAmtsblattFilename(fullUrl); } catch { continue; }
        if (since && meta.publish_date < since) continue;

        records.push(await this.processPdf(fullUrl, {
          source_url: fullUrl,
          publish_date: meta.publish_date,
          gemeinde: this.gemeindeName,
          title: `Amtsblatt KW ${meta.kw}`,
          source_type: 'amtsblatt_pdf',
        }));
      }
    }

    return records;
  }
}
