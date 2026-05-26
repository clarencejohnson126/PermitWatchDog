export declare class HttpClient {
    private client;
    private userAgents;
    constructor();
    getHtml(url: string): Promise<string>;
    getBuffer(url: string): Promise<Buffer>;
    getHtmlWithPlaywright(url: string): Promise<string>;
}
