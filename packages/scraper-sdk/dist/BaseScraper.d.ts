import { HttpClient } from './utils/http';
import * as cheerio from 'cheerio';
export interface ScrapedRecord {
    source_url: string;
    publish_date: Date;
    gemeinde: string;
    title: string;
    content_text: string;
}
export declare abstract class BaseScraper {
    protected http: HttpClient;
    gemeindeName: string;
    constructor(gemeindeName: string);
    abstract run(): Promise<ScrapedRecord[]>;
    protected parseHtml(html: string): cheerio.CheerioAPI;
    protected extractPdfText(pdfBuffer: Buffer): Promise<string>;
}
