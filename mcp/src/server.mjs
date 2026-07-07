#!/usr/bin/env node
/**
 * Tesseract MCP — stdio entry (local use / Claude Code plugin).
 *
 * Serves the EXACT Tesseract design-system components, props, allowed values,
 * tokens, icons, rules, and design.md — extracted from source. The server never
 * invents anything. Tool set lives in build-server.mjs (shared with the HTTP entry).
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, SUMMARY } from "./build-server.mjs";

const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("tesseract-mcp ready (stdio) —", SUMMARY.components, "components,", SUMMARY.tokens, "tokens,", SUMMARY.icons, "icons");
