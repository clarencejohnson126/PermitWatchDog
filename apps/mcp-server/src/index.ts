/**
 * PermitWatchDog WebMCP provider (skeleton).
 * Spec:  see AGENT.md §3 (locked stack), SPEC.md §9 (WebMCP)
 * Evals: see EVALS.md E11 (WebMCP endpoint conformance)
 * License: proprietary, Rebelz AI 2026.
 */
import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { registerPublicTools } from "./tools/public";

const app = express();
app.use(cors());

// Initialize the MCP Server
const server = new McpServer({
  name: "PermitWatchDog",
  version: "0.1.0"
});

// Register tools
registerPublicTools(server);

// Keep track of active SSE transports
let transport: SSEServerTransport | null = null;

// SSE Endpoint for clients to connect
app.get("/sse", async (req, res) => {
  console.log("New SSE connection established");
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

// HTTP POST endpoint for clients to send messages
app.post("/messages", express.json(), async (req, res) => {
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`PermitWatchDog MCP Server running on port ${PORT}`);
  console.log(`SSE endpoint available at http://localhost:${PORT}/sse`);
});
