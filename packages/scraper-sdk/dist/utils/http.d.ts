export declare class HttpClient {
    private client;
    private userAgents;
    constructor();
    getHtml(url: string): Promise<string>;
    head(url: string): Promise<Record<string, string>>;
    getBuffer(url: string, retries?: number): Promise<Buffer>;
    getHtmlWithPlaywright(url: string): Promise<string>;
}
