"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    client;
    constructor() {
        this.client = axios_1.default.create({
            timeout: 15000,
            headers: {
                'User-Agent': 'PermitWatchDog Bot / 0.1.0'
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
    async getBuffer(url) {
        try {
            const response = await this.client.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(response.data, 'binary');
        }
        catch (error) {
            console.error(`Failed to fetch Buffer from ${url}: ${error.message}`);
            throw error;
        }
    }
}
exports.HttpClient = HttpClient;
