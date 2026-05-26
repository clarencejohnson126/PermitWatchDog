import { BaseScraper, ScrapedRecord } from 'scraper-sdk';
import { LocalStorageMock } from './storage';

export class MannheimBekanntmachungenScraper extends BaseScraper {
  private storage: LocalStorageMock;

  constructor() {
    super('Mannheim');
    this.storage = new LocalStorageMock();
  }

  async run(): Promise<ScrapedRecord[]> {
    const records: ScrapedRecord[] = [];
    console.log('[Mannheim] Starting scrape run');

    // TARGET 1: Bekanntmachungen (Static HTML)
    const bekanntUrl = 'https://www.mannheim.de/de/wirtschaft-entwickeln/oeffentliche-bekanntmachungen-aktuelle-planverfahren-vergaben';
    try {
      const html = await this.http.getHtml(bekanntUrl);
      const $ = this.parseHtml(html);
      
      const rows = $('.views-row');
      console.log(`[Mannheim] Found ${rows.length} views-row entries on Bekanntmachungen page`);

      rows.each((i, el) => {
        const title = $(el).find('.field-content').text().trim() || 'Untitled Bekanntmachung';
        // HTML scraping without fetching individual pages for now
        records.push({
          source_url: bekanntUrl + `#row-${i}`,
          publish_date: new Date(), // Mock date since parsing exact text depends on DOM shape
          gemeinde: this.gemeindeName,
          title: title,
          content_text: `Extracted from views-row ${i}`
        });
      });
    } catch (e) {
      console.error('[Mannheim] Error scraping Bekanntmachungen HTML', e);
    }

    // TARGET 2: Amtsblatt 2026 and 2025 Archives
    const archiveUrls = [
      'https://www.mannheim.de/de/amtsblatt-der-stadt-mannheim/amtsblatt-2026',
      'https://www.mannheim.de/de/amtsblatt-der-stadt-mannheim/amtsblatt-2025'
    ];

    for (const url of archiveUrls) {
      try {
        const html = await this.http.getHtml(url);
        const $ = this.parseHtml(html);
        
        // Find links matching the weekly pattern
        const pdfLinks = $('a').map((i, el) => $(el).attr('href')).get()
          .filter(href => href && href.toLowerCase().endsWith('.pdf') && href.includes('KW'));
        
        console.log(`[Mannheim] Found ${pdfLinks.length} Amtsblatt PDFs in archive: ${url}`);
        
        for (const href of pdfLinks) {
          const fullUrl = href.startsWith('http') ? href : `https://www.mannheim.de${href}`;
          records.push({
            source_url: fullUrl,
            publish_date: new Date(), // Mock date
            gemeinde: this.gemeindeName,
            title: href.split('/').pop() || 'Amtsblatt PDF',
            content_text: `Mock parsed PDF text from ${fullUrl}`
          });
        }
      } catch (e) {
        console.error(`[Mannheim] Error scraping Amtsblatt at ${url}`, e);
      }
    }

    return records;
  }
}
