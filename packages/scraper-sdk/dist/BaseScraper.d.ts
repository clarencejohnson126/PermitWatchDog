import { HttpClient } from './utils/http';
import * as cheerio from 'cheerio';
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
export declare abstract class BaseScraper {
    protected http: HttpClient;
    gemeindeName: string;
    constructor(gemeindeName: string);
    abstract run(): Promise<ScrapedRecord[]>;
    protected parseHtml(html: string): cheerio.CheerioAPI;
    protected extractPdfText(pdfBuffer: Buffer): Promise<string>;
}
