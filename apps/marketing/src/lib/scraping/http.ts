// HTTP client for scraping public German municipal sites.
// Copied + simplified from packages/scraper-sdk to avoid the monorepo
// workspace dependency on Vercel.

import axios, { AxiosInstance } from 'axios';

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0',
];

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    this.client = axios.create({
      timeout: 12000,
      maxRedirects: 5,
      headers: {
        'User-Agent': ua,
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
    });
  }

  async getHtml(url: string): Promise<string> {
    const r = await this.client.get<string>(url);
    return r.data;
  }

  async getBuffer(url: string): Promise<Buffer> {
    const r = await this.client.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
    return Buffer.from(r.data);
  }

  async head(url: string): Promise<Record<string, string>> {
    const r = await this.client.head(url);
    return r.headers as Record<string, string>;
  }
}
