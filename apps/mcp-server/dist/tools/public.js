"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPublicTools = registerPublicTools;
const zod_1 = require("zod");
function registerPublicTools(server) {
    // 1. lookup_filing_by_address
    server.tool("lookup_filing_by_address", {
        address: zod_1.z.string().describe("The street address to look up (e.g., 'Q5, 18, Mannheim')")
    }, async ({ address }) => {
        // Placeholder response for the skeleton
        return {
            content: [{ type: "text", text: `[Skeleton] Searched for filings at address: ${address}. No recent filings found.` }]
        };
    });
    // 2. get_alerts_for_flurstueck
    server.tool("get_alerts_for_flurstueck", {
        flurstueck: zod_1.z.string().describe("The Flurstueck number (e.g., '4823/2')")
    }, async ({ flurstueck }) => {
        // Placeholder response for the skeleton
        return {
            content: [{ type: "text", text: `[Skeleton] Found 0 active alerts for Flurstueck: ${flurstueck}.` }]
        };
    });
    // 3. get_jurisdiction_coverage_status
    server.tool("get_jurisdiction_coverage_status", {
        gemeinde: zod_1.z.string().describe("The name of the Gemeinde (e.g., 'Mannheim')")
    }, async ({ gemeinde }) => {
        // Placeholder response for the skeleton
        return {
            content: [{ type: "text", text: `[Skeleton] Coverage status for ${gemeinde}: ACTIVE. Daily scraping is operational.` }]
        };
    });
}
