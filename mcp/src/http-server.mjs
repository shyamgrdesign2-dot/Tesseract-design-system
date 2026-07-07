#!/usr/bin/env node
/**
 * Tesseract MCP — HTTP entry (hosted / remote).
 *
 * Serves the MCP tools over Streamable-HTTP so clients connect by URL. Two auth modes,
 * both backed by the same shared secret, so nothing new to provision:
 *   1. Static bearer — `Authorization: Bearer <TESSERACT_MCP_TOKEN>` (Claude Code, plugin, curl).
 *   2. OAuth 2.1 + DCR + PKCE (./oauth.mjs) — for Claude's web/Desktop "Connectors" UI,
 *      which speaks OAuth, not static headers. The consent screen is gated by the same
 *      shared token, so access control is unchanged.
 *
 * Env:
 *   MCP_PORT              listen port (default 8787; nginx proxies to here)
 *   MCP_PATH              MCP request path (default "/mcp")
 *   MCP_PUBLIC_ORIGIN     external origin for OAuth issuer/metadata URLs
 *                         (default: derived from X-Forwarded-Proto + Host)
 *   TESSERACT_MCP_TOKEN   the shared secret. Set → auth enforced + used as the OAuth
 *                         signing key and consent gate. Unset → open.
 *   MCP_OAUTH_SECRET      optional explicit OAuth signing key (defaults to the token).
 */

import http from "node:http";
import crypto from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer, SUMMARY } from "./build-server.mjs";
import { handleOAuth, verifyAccessToken } from "./oauth.mjs";

// MCP_PORT, not PORT — Azure Container Apps treats PORT specially (ingress/probe).
const PORT = Number(process.env.MCP_PORT || 8787);
const MCP_PATH = process.env.MCP_PATH || "/mcp";
const TOKEN = process.env.TESSERACT_MCP_TOKEN || "";
const PUBLIC_ORIGIN = process.env.MCP_PUBLIC_ORIGIN || "";
// Stable HMAC key for OAuth tokens. Falls back to a random per-boot key only in open
// mode (no token) — fine there since there is no gate to persist across restarts.
const SECRET = TOKEN || process.env.MCP_OAUTH_SECRET || crypto.randomBytes(32).toString("hex");

const json = (res, code, obj) => {
  res.writeHead(code, { "content-type": "application/json" });
  res.end(JSON.stringify(obj));
};

const readRaw = (req) =>
  new Promise((resolve) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => resolve(d));
    req.on("error", () => resolve(""));
  });

const httpServer = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://internal");
  const pathname = url.pathname;
  const method = req.method || "GET";

  const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const issuer = PUBLIC_ORIGIN || `${proto}://${host}`;
  const resource = issuer + MCP_PATH;

  // Liveness probe — unauthenticated.
  if (pathname === "/health" || pathname === `${MCP_PATH}/health`) {
    return json(res, 200, { status: "ok", server: "tesseract-mcp", ...SUMMARY, auth: TOKEN ? "on" : "off", oauth: "on" });
  }

  // OAuth 2.1 authorization server (discovery, DCR, authorize, token).
  if (
    pathname.startsWith("/.well-known/oauth-") ||
    pathname === "/register" ||
    pathname === "/authorize" ||
    pathname === "/token"
  ) {
    const rawBody = method === "POST" ? await readRaw(req) : "";
    const handled = handleOAuth(req, res, {
      pathname, method, query: url.searchParams, rawBody, issuer, resource, gateToken: TOKEN, secret: SECRET,
    });
    return handled ? undefined : json(res, 404, { error: "not found" });
  }

  if (pathname !== MCP_PATH) return json(res, 404, { error: "not found" });

  // Gate: accept the static bearer token OR a valid OAuth access token.
  const authz = req.headers.authorization || "";
  const ok = (TOKEN && authz === `Bearer ${TOKEN}`) || verifyAccessToken(authz, SECRET);
  if (TOKEN && !ok) {
    // Point OAuth clients at the protected-resource metadata (MCP auth spec).
    res.setHeader("WWW-Authenticate", `Bearer resource_metadata="${issuer}/.well-known/oauth-protected-resource"`);
    return json(res, 401, { jsonrpc: "2.0", id: null, error: { code: -32001, message: "Unauthorized" } });
  }

  try {
    const raw = method === "POST" ? await readRaw(req) : "";
    let body;
    try { body = raw ? JSON.parse(raw) : undefined; } catch { body = undefined; }
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
  console.error(`tesseract-mcp (http) on :${PORT}${MCP_PATH} — ${SUMMARY.components} components; auth ${TOKEN ? "ON" : "OFF"}; oauth ON`);
});
