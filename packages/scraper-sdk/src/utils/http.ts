import axios, { AxiosInstance } from 'axios';

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 15000,
      headers: {
        'User-Agent': 'PermitWatchDog Bot / 0.1.0'
      }
    });
  }

  async getHtml(url: string): Promise<string> {
    try {
      const response = await this.client.get(url);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch HTML from ${url}: ${error.message}`);
      throw error;
    }
  }

  async getBuffer(url: string): Promise<Buffer> {
    try {
      const response = await this.client.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data, 'binary');
    } catch (error: any) {
      console.error(`Failed to fetch Buffer from ${url}: ${error.message}`);
      throw error;
    }
  }
}
