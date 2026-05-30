// City of Palo Alto scraper.
//
// Target product positioning:
//   Bescheid → Building Permit
//   Auflage → Condition of Approval
//   Bauleitplanung / B-Plan → Zoning code amendments / Comprehensive Plan
//   Bauaufsichtliche Anordnung → Code-enforcement order / Ordinance
//
// SOURCE STATUS (verified 2026-05-30):
//   - cityofpaloalto.org → 403/WAF-blocked for headless scraping (Akamai).
//     Needs server-side Playwright OR an approved-IP allow-list.
//   - webapi.legistar.com/v1/cityofpaloalto → NOT wired by the city
//     (returns "LegistarConnectionString setting is not set up").
//   - cityofpaloalto.legistar.com → JS-rendered Legistar UI, scrapeable
//     only via Playwright (not Vercel-serverless-friendly).
//
// FOLLOW-UPS to identify a reliable feed:
//   - Granicus (some Palo Alto boards) — agenda RSS at viewthe.city
//   - OpenGov permit portal (public-portal.opengov.com/...?city=paloalto)
//   - Direct city RSS at /Home/Components/News/News-1-Archive
//   - Ask city's IT dept for an approved scraper IP whitelist
//
// Architecture is in place — runner iterates both scrapers, geo-filter
// recognizes Palo Alto neighborhoods, doctrine judge is locale-agnostic.
// When a reliable feed is identified, only this file changes.

import * as cheerio from 'cheerio';
import { HttpClient } from './http';
import type { ScrapedRecord, SourceType, ParseConfidence } from './types';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse/lib/pdf-parse.js') as (buf: Buffer) => Promise<{ text: string }>;

const MONTH_EN: Record<string, number> = {
  january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2, april: 3, apr: 3,
  may: 4, june: 5, jun: 5, july: 6, jul: 6, august: 7, aug: 7,
  september: 8, sep: 8, sept: 8, october: 9, oct: 9, november: 10, nov: 10,
  december: 11, dec: 11,
};

const PERMIT_KEYWORDS_RE =
  /\b(permit|zoning|planning|building|architectural|review board|comprehensive plan|title\s*18|ordinance|variance|conditional use|ceqa|environmental|public hearing|notice of preparation|notice of intent)\b/i;

export class PaloAltoScraper {
  public readonly gemeindeName = 'Palo Alto';
  private readonly http = new HttpClient();
  private readonly maxPdfBytes = 25 * 1024 * 1024;

  private parseEnglishDate(s: string): Date | null {
    // Matches "May 13, 2026", "May 13 2026", "2026-05-13"
    const iso = s.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
      return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
    }
    const named = s.match(/([A-Za-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})/);
    if (named) {
      const month = MONTH_EN[named[1].toLowerCase()];
      if (month === undefined) return null;
      return new Date(Date.UTC(+named[3], month, +named[2]));
    }
    return null;
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
   * Scrape the public-notices + planning-news surfaces.
   * `since` skips records older than the cutoff date.
   */
  async run(opts: { since?: Date; maxRecords?: number } = {}): Promise<ScrapedRecord[]> {
    const { since, maxRecords = 100 } = opts;
    const records: ScrapedRecord[] = [];

    const sources: { url: string; type: SourceType; label: string }[] = [
      // Public notices + planning news index. The city renders a server-side
      // HTML list with date + headline + link; cheerio handles it.
      {
        url: 'https://www.cityofpaloalto.org/News/Latest-News',
        type: 'bekanntmachung',
        label: 'Latest News',
      },
      {
        url: 'https://www.cityofpaloalto.org/Departments/Planning-Development-Services/Building',
        type: 'bekanntmachung',
        label: 'Planning & Development',
      },
      {
        url: 'https://www.cityofpaloalto.org/Departments/Clerk/Public-Notices',
        type: 'bekanntmachung',
        label: 'Public Notices',
      },
    ];

    for (const page of sources) {
      if (records.length >= maxRecords) break;
      let html: string;
      try {
        html = await this.http.getHtml(page.url);
      } catch {
        continue;
      }
      const $ = cheerio.load(html);

      // Palo Alto's CMS (CivicEngage / CivicPlus) renders news/notice items
      // as either article cards (`.modListItem`, `.newsListItem`, `article`)
      // or generic content blocks. We search broadly for headline + link
      // + nearby date.
      const items = $('.modListItem, .newsListItem, article, .news-item, .promo-item, .listingPromo').toArray();
      for (let i = 0; i < items.length; i++) {
        if (records.length >= maxRecords) break;
        const el = items[i];
        const title = $(el).find('h2, h3, h4, .listingTitle, .modListItem-title, .item-title')
          .first().text().replace(/\s+/g, ' ').trim();
        if (!title || title.length < 8) continue;

        // Pre-filter at the title level — skip clearly non-permit news to
        // keep filing volume low. The Gemini judge will still filter further.
        if (!PERMIT_KEYWORDS_RE.test(title)) continue;

        const dateStr = $(el).find('.date, time, .modListItem-date, .item-date').first().text().trim()
          || $(el).find('[datetime]').first().attr('datetime') || '';
        const publishDate = this.parseEnglishDate(dateStr);
        if (!publishDate) continue;
        if (since && publishDate < since) continue;

        let href = '';
        $(el).find('a').each((_, a) => {
          const h = $(a).attr('href');
          if (h && !href) href = h;
        });
        if (!href) continue;
        const fullUrl = href.startsWith('http') ? href : `https://www.cityofpaloalto.org${href}`;

        // If linked target is a PDF, grab its text. Otherwise use the on-page
        // teaser text (often a short paragraph below the headline).
        const isPdf = fullUrl.toLowerCase().endsWith('.pdf');
        const base: Partial<ScrapedRecord> = {
          source_url: fullUrl,
          publish_date: publishDate,
          gemeinde: this.gemeindeName,
          title,
          source_type: page.type,
        };

        if (isPdf) {
          records.push(await this.processPdf(fullUrl, base));
        } else {
          // Use the teaser/summary text from the listing as content_text.
          // It's short but reliable; Gemini judge can decide on the snippet.
          const teaser = $(el).find('p, .summary, .modListItem-summary, .item-summary')
            .first().text().replace(/\s+/g, ' ').trim();
          records.push({
            ...base,
            content_text: teaser || `[See ${fullUrl}]`,
            parse_confidence: teaser ? 'high' : 'low',
          } as ScrapedRecord);
        }
      }
    }

    return records;
  }
}
