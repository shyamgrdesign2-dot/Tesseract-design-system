#!/usr/bin/env node
/**
 * Tesseract MCP — HTTP entry (hosted / remote).
 *
 * Serves the same tools as the stdio entry over the MCP Streamable-HTTP transport,
 * so clients (Cursor / Claude) connect by URL instead of cloning the repo. Stateless
 * (a fresh server + transport per request), with optional bearer-token auth.
 *
 * Env:
 *   PORT                  listen port (default 8787; nginx proxies /mcp → here)
 *   MCP_PATH              request path (default "/mcp")
 *   TESSERACT_MCP_TOKEN   if set → every request must send `Authorization: Bearer <token>`.
 *                         If unset → open (matches the already-public Storybook).
 */

import http from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer, SUMMARY } from "./build-server.mjs";

// MCP_PORT, not PORT — Azure Container Apps treats PORT specially (ingress/probe).
const PORT = Number(process.env.MCP_PORT || 8787);
const MCP_PATH = process.env.MCP_PATH || "/mcp";
const TOKEN = process.env.TESSERACT_MCP_TOKEN || "";

const json = (res, code, obj) => {
  res.writeHead(code, { "content-type": "application/json" });
  res.end(JSON.stringify(obj));
};

const readBody = (req) =>
  new Promise((resolve) => {
    if (req.method !== "POST") return resolve(undefined);
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => { try { resolve(d ? JSON.parse(d) : undefined); } catch { resolve(undefined); } });
    req.on("error", () => resolve(undefined));
  });

const httpServer = http.createServer(async (req, res) => {
  const path = (req.url || "/").split("?")[0];

  // Liveness probe — unauthenticated (Azure Container Apps / load balancers).
  if (path === "/health" || path === `${MCP_PATH}/health`) {
    return json(res, 200, { status: "ok", server: "tesseract-mcp", ...SUMMARY, auth: TOKEN ? "on" : "off" });
  }
  if (path !== MCP_PATH) return json(res, 404, { error: "not found" });

  // Bearer-token gate — enforced only when a token is configured.
  if (TOKEN && req.headers.authorization !== `Bearer ${TOKEN}`) {
    return json(res, 401, { jsonrpc: "2.0", id: null, error: { code: -32001, message: "Unauthorized" } });
  }

  try {
    const body = await readBody(req);
    // Stateless: a fresh server + transport per request (safe under concurrency).
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => {
      try { transport.close(); } catch { /* no-op */ }
      try { server.close?.(); } catch { /* no-op */ }
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch {
    if (!res.headersSent) json(res, 500, { jsonrpc: "2.0", id: null, error: { code: -32603, message: "Internal error" } });
  }
});

httpServer.listen(PORT, () => {
  console.error(`tesseract-mcp (http) on :${PORT}${MCP_PATH} — ${SUMMARY.components} components; auth ${TOKEN ? "ON" : "OFF (no token set)"}`);
});
