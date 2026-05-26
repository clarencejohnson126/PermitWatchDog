"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const public_js_1 = require("./tools/public.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Initialize the MCP Server
const server = new mcp_js_1.McpServer({
    name: "PermitWatchDog",
    version: "0.1.0"
});
// Register tools
(0, public_js_1.registerPublicTools)(server);
// Keep track of active SSE transports
let transport = null;
// SSE Endpoint for clients to connect
app.get("/sse", async (req, res) => {
    console.log("New SSE connection established");
    transport = new sse_js_1.SSEServerTransport("/messages", res);
    await server.connect(transport);
});
// HTTP POST endpoint for clients to send messages
app.post("/messages", express_1.default.json(), async (req, res) => {
    if (!transport) {
        res.status(400).send("No active SSE connection");
        return;
    }
    await transport.handlePostMessage(req, res);
});
// Basic health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "PermitWatchDog MCP Skeleton" });
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`PermitWatchDog MCP Server running on port ${PORT}`);
    console.log(`SSE endpoint available at http://localhost:${PORT}/sse`);
});
