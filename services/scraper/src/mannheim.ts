import { BaseScraper, ScrapedRecord } from 'scraper-sdk';
import { LocalStorageMock } from './storage';
const { PDFParse } = require('pdf-parse');

export class MannheimBekanntmachungenScraper extends BaseScraper {
  private storage: LocalStorageMock;

  constructor() {
    super('Mannheim');
    this.storage = new LocalStorageMock();
  }

  // --- C.1 Amtsblatt Date Parsing ---
  private parseAmtsblattFilename(href: string): { kw: string; publish_date: Date } {
    const filename = href.split('/').pop() || '';
    const match = filename.match(/KW(?:%20|\s*)(\d+)_(\d{4,6})(?:_[^.]+)?\.pdf/i);
    if (!match) throw new Error(`Filename pattern mismatch: ${filename}`);

    const kw = match[1];
    const dateStr = match[2];
    let year = 0, month = 0, day = 0;

    if (dateStr.length === 4) {
      // MMDD, derive year from URL (e.g. /2026-05/)
      const yrMatch = href.match(/\/(\d{4})-\d{2}\//);
      if (!yrMatch) throw new Error(`Could not infer year for MMDD pattern: ${href}`);
      year = parseInt(yrMatch[1], 10);
      month = parseInt(dateStr.substring(0, 2), 10);
      day = parseInt(dateStr.substring(2, 4), 10);
    } else if (dateStr.length === 6) {
      // YYMMDD
      year = 2000 + parseInt(dateStr.substring(0, 2), 10);
      month = parseInt(dateStr.substring(2, 4), 10);
      day = parseInt(dateStr.substring(4, 6), 10);
    } else {
      throw new Error(`Unexpected dateStr length: ${dateStr}`);
    }

    return { kw, publish_date: new Date(Date.UTC(year, month - 1, day)) };
  }

  // --- C.2 DOM Date Parsing ---
  private parseDomDates(dateStr: string): { publish_date: Date; auslegung_end_date: Date | null } {
    const monthMap: Record<string, number> = {
      'Januar': 0, 'Februar': 1, 'März': 2, 'April': 3, 'Mai': 4, 'Juni': 5,
      'Juli': 6, 'August': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Dezember': 11
    };

    const parseGermanDate = (str: string) => {
      // e.g. "20. Mai 2026 - 10:12"
      const match = str.match(/(\d{1,2})\.\s+([A-Za-zä]+)\s+(\d{4})(?:\s*-\s*(\d{1,2}):(\d{2}))?/);
      if (!match) return null;
      const day = parseInt(match[1], 10);
      const mName = match[2];
      const year = parseInt(match[3], 10);
      const hour = match[4] ? parseInt(match[4], 10) : 0;
      const min = match[5] ? parseInt(match[5], 10) : 0;
      const month = monthMap[mName];
      if (month === undefined) return null;
      return new Date(Date.UTC(year, month, day, hour, min));
    };

    const parts = dateStr.split(/\s+bis\s+/);
    const publish_date = parseGermanDate(parts[0]);
    if (!publish_date) throw new Error(`Could not parse start date from: ${dateStr}`);
    
    let auslegung_end_date = null;
    if (parts.length > 1) {
      auslegung_end_date = parseGermanDate(parts[1]);
    }

    return { publish_date, auslegung_end_date };
  }

  // --- B. PDF Download and Parse ---
  private async processPdf(url: string, baseRecord: Partial<ScrapedRecord>): Promise<ScrapedRecord> {
    try {
      const headers = await this.http.head(url);
      const contentLength = parseInt(headers['content-length'] || '0', 10);
      
      if (contentLength > 25 * 1024 * 1024) {
        console.warn(`[Mannheim] Skipping large PDF (>25MB): ${url} (${contentLength} bytes)`);
        return {
          ...baseRecord,
          content_text: `[Skipped: PDF too large, ${contentLength} bytes]`,
          parse_confidence: 'failed'
        } as ScrapedRecord;
      }

      const buffer = await this.http.getBuffer(url, 1);
      let text = '';
      let parser;
      try {
        parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        text = result.text;
        await parser.destroy();
      } catch (parseErr) {
        if (parser) await parser.destroy().catch(() => {});
        console.error(`[Mannheim] Failed to extract text via pdf-parse: ${url}`, parseErr);
        return {
          ...baseRecord,
          content_text: '[PDF Parse Failed]',
          parse_confidence: 'failed'
        } as ScrapedRecord;
      }

      let confidence: 'high' | 'low' | 'failed' = 'high';
      if (text.length < 100) {
        confidence = 'low';
        console.log(`[Mannheim] Low confidence parse (<100 chars) for ${url}`);
      }

      return {
        ...baseRecord,
        content_text: text,
        parse_confidence: confidence
      } as ScrapedRecord;

    } catch (e: any) {
      console.error(`[Mannheim] Error downloading/processing PDF ${url}: ${e.message}`);
      return {
        ...baseRecord,
        content_text: '[PDF Download Failed]',
        parse_confidence: 'failed'
      } as ScrapedRecord;
    }
  }

  async run(): Promise<ScrapedRecord[]> {
    const records: ScrapedRecord[] = [];
    console.log('[Mannheim] Starting scrape run with B+C logic');

    const subpages = [
      { url: 'https://www.mannheim.de/de/wirtschaft-entwickeln/oeffentliche-bekanntmachungen-aktuelle-planverfahren-vergaben/oeffentliche-bekanntmachungen', type: 'bekanntmachung' as const },
      { url: 'https://www.mannheim.de/de/wirtschaft-entwickeln/oeffentliche-bekanntmachungen-aktuelle-planverfahren-vergaben/vergaben', type: 'vergabe' as const }
    ];

    // 1. DOM Subpages
    for (const page of subpages) {
      try {
        const html = await this.http.getHtml(page.url);
        const $ = this.parseHtml(html);
        
        const teasers = $('.teaser');
        console.log(`[Mannheim] ${page.type}: Found ${teasers.length} teasers.`);

        for (let i = 0; i < teasers.length; i++) {
          const el = teasers[i];
          const title = $(el).find('h2, h3, h4, .teaser__title').text().replace(/\s+/g, ' ').trim() || 'Untitled';
          const dateStr = $(el).find('.date, time, .teaser__date, .views-field-created').text().replace(/\s+/g, ' ').trim();
          
          if (!dateStr || dateStr.toLowerCase().includes('mail')) continue; // skip contact cards

          let dates;
          try {
            dates = this.parseDomDates(dateStr);
          } catch (e) {
            console.error(`[Mannheim] Skipping row, date parse failed for: ${dateStr}`);
            continue;
          }

          let pdfLink = '';
          $(el).find('a').each((_, a) => {
            const href = $(a).attr('href');
            if (href && href.includes('download?token=')) pdfLink = href;
          });

          if (!pdfLink) {
            records.push({
              source_url: page.url + `#teaser-${i}`,
              publish_date: dates.publish_date,
              auslegung_end_date: dates.auslegung_end_date,
              gemeinde: this.gemeindeName,
              title: title,
              content_text: '[No PDF Attached]',
              source_type: page.type
            });
            continue;
          }

          const fullPdfUrl = pdfLink.startsWith('http') ? pdfLink : `https://www.mannheim.de${pdfLink}`;
          
          const record = await this.processPdf(fullPdfUrl, {
            source_url: fullPdfUrl,
            publish_date: dates.publish_date,
            auslegung_end_date: dates.auslegung_end_date,
            gemeinde: this.gemeindeName,
            title: title,
            source_type: page.type
          });
          
          records.push(record);
        }
      } catch (e: any) {
        console.error(`[Mannheim] Error processing ${page.type}: ${e.message}`);
      }
    }

    // 2. Amtsblatt Archives
    const archiveUrls = [
      'https://www.mannheim.de/de/amtsblatt-der-stadt-mannheim/amtsblatt-2026',
      'https://www.mannheim.de/de/amtsblatt-der-stadt-mannheim/amtsblatt-2025'
    ];

    for (const url of archiveUrls) {
      try {
        const html = await this.http.getHtml(url);
        const $ = this.parseHtml(html);
        
        const pdfLinks = $('a').map((i, el) => $(el).attr('href')).get()
          .filter(href => href && href.toLowerCase().endsWith('.pdf') && href.includes('KW'));
        
        console.log(`[Mannheim] Found ${pdfLinks.length} Amtsblatt PDFs in archive: ${url}`);
        
        for (const href of pdfLinks) {
          const fullUrl = href.startsWith('http') ? href : `https://www.mannheim.de${href}`;
          
          let parsedMeta;
          try {
            parsedMeta = this.parseAmtsblattFilename(fullUrl);
          } catch (e: any) {
            console.error(`[Mannheim] Skipping PDF: ${e.message}`);
            continue;
          }

          const record = await this.processPdf(fullUrl, {
            source_url: fullUrl,
            publish_date: parsedMeta.publish_date,
            gemeinde: this.gemeindeName,
            title: `Amtsblatt KW ${parsedMeta.kw}`,
            source_type: 'amtsblatt_pdf'
          });
          
          records.push(record);
        }
      } catch (e: any) {
        console.error(`[Mannheim] Error scraping Amtsblatt at ${url}: ${e.message}`);
      }
    }

    return records;
  }
}
