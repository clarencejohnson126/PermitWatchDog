import { HttpClient } from './utils/http';
import * as cheerio from 'cheerio';
import pdfParse from 'pdf-parse';

// We rely on the shared types for Filing, but for the SDK itself, we can use a basic interface.
// The actual mapping happens in the concrete implementation.
export interface ScrapedRecord {
  source_url: string;
  publish_date: Date;
  gemeinde: string;
  title: string;
  content_text: string;
  pdf_storage_path?: string;
  auslegung_end_date?: Date | null;
  parse_confidence?: 'high' | 'low' | 'failed' | null;
  source_type: 'bekanntmachung' | 'vergabe' | 'amtsblatt_pdf' | 'bauleitplanung';
}

export abstract class BaseScraper {
  protected http: HttpClient;
  public gemeindeName: string;

  constructor(gemeindeName: string) {
    this.gemeindeName = gemeindeName;
    this.http = new HttpClient();
  }

  // Abstract methods to be implemented by each Gemeinde's scraper
  abstract run(): Promise<ScrapedRecord[]>;

  // Helper method for HTML parsing
  protected parseHtml(html: string): cheerio.CheerioAPI {
    return cheerio.load(html);
  }

  // Helper method for PDF text extraction
  protected async extractPdfText(pdfBuffer: Buffer): Promise<string> {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  }
}
