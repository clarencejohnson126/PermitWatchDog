"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    client;
    userAgents = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0'
    ];
    constructor() {
        const randomUA = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
        this.client = axios_1.default.create({
            timeout: 15000,
            headers: {
                'User-Agent': randomUA,
                'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        });
    }
    async getHtml(url) {
        try {
            const response = await this.client.get(url);
            return response.data;
        }
        catch (error) {
            console.error(`Failed to fetch HTML from ${url}: ${error.message}`);
            throw error;
        }
    }
    async head(url) {
        try {
            const response = await this.client.head(url);
            return response.headers;
        }
        catch (error) {
            console.error(`Failed to HEAD ${url}: ${error.message}`);
            throw error;
        }
    }
    async getBuffer(url, retries = 1) {
        try {
            const response = await this.client.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(response.data, 'binary');
        }
        catch (error) {
            if (retries > 0 && error.response && error.response.status >= 400) {
                console.log(`[HTTP] Retrying GET ${url} due to ${error.response.status}...`);
                await new Promise(r => setTimeout(r, 2000));
                return this.getBuffer(url, retries - 1);
            }
            console.error(`Failed to fetch Buffer from ${url}: ${error.message}`);
            throw error;
        }
    }
    async getHtmlWithPlaywright(url) {
        // FALLBACK pathway for JS-hydrated municipal sites
        try {
            const { chromium } = require('playwright');
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle' });
            const content = await page.content();
            await browser.close();
            return content;
        }
        catch (error) {
            console.error(`Playwright fallback failed for ${url}: ${error.message}`);
            throw error;
        }
    }
}
exports.HttpClient = HttpClient;
