export declare class HttpClient {
    private client;
    constructor();
    getHtml(url: string): Promise<string>;
    getBuffer(url: string): Promise<Buffer>;
}
