#!/usr/bin/env node
/**
 * Tesseract MCP server (stdio).
 *
 * Serves the EXACT Tesseract design-system components, props, allowed values,
 * and tokens — extracted from source into mcp/manifest/component-manifest.json.
 * The server NEVER invents anything: every answer comes from the manifest, so
 * an AI client can only configure components that actually exist.
 *
 * Tools:
 *   list_components   — exact inventory (optionally by layer)
 *   get_component     — full spec for one component (props, allowed values, import, stories)
 *   search_components — find components by name/description
 *   validate_usage    — GUARDRAIL: flag any prop/value that isn't in the real API
 *   get_tokens        — design tokens (optionally by family)
 *   get_rules         — the iron rules every generated page must follow
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = resolve(here, "..", "manifest", "component-manifest.json");
const ICONS_PATH = resolve(here, "..", "manifest", "icon-names.json");

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(
      `Manifest not found at ${MANIFEST_PATH}. Generate it first: node mcp/scripts/build-manifest.mjs`
    );
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}
const loadIcons = () => (existsSync(ICONS_PATH) ? JSON.parse(readFileSync(ICONS_PATH, "utf8")) : { variants: [], curatedVariants: [], count: 0, names: [] });

let manifest = loadManifest();
let icons = loadIcons();

const findComponent = (name) =>
  manifest.components.find((c) => c.name.toLowerCase() === String(name).toLowerCase()) ||
  manifest.components.find((c) => c.exports.some((e) => e.toLowerCase() === String(name).toLowerCase()));

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
const closest = (name, pool) =>
  pool.map((p) => [p, levenshtein(name.toLowerCase(), p.toLowerCase())]).sort((x, y) => x[1] - y[1]).slice(0, 3).map((x) => x[0]);

// React/DOM props that are always allowed as passthrough (not hallucinations).
const PASSTHROUGH = new Set(["className", "style", "children", "id", "key", "ref", "role", "title", "tabIndex"]);
const isPassthrough = (p) => PASSTHROUGH.has(p) || /^(aria-|data-)/.test(p) || /^on[A-Z]/.test(p);

const text = (obj) => ({ content: [{ type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) }] });

const server = new McpServer({ name: "tesseract", version: "0.1.0" });

/* ── list_components ───────────────────────────────────────────────── */
server.tool(
  "list_components",
  "List the exact Tesseract (tesseract-ui) components that exist, with a one-line purpose. Optionally filter by layer.",
  { layer: z.enum(["atoms", "molecules", "all"]).optional().describe("Filter by layer (default all)") },
  async ({ layer = "all" }) => {
    const items = manifest.components
      .filter((c) => layer === "all" || c.layer === layer)
      .map((c) => ({
        name: c.name,
        layer: c.layer,
        exports: c.exports,
        purpose: (c.description || "").split(/[.•\n]/)[0].trim().slice(0, 140) || null,
        propCount: c.props.length,
      }));
    return text({ count: items.length, components: items });
  }
);

/* ── get_component ─────────────────────────────────────────────────── */
server.tool(
  "get_component",
  "Get the full, authoritative spec for one Tesseract component: every real prop, allowed values, defaults, the import line, and story names. Use this before writing any usage so you never guess a prop.",
  { name: z.string().describe("Component name, e.g. 'Button', 'DataTable', 'SecondarySidebar'") },
  async ({ name }) => {
    const c = findComponent(name);
    if (!c) {
      return text({
        error: `No component named '${name}'.`,
        didYouMean: closest(name, manifest.components.map((x) => x.name)),
        hint: "Call list_components for the full inventory.",
      });
    }
    return text({
      name: c.name,
      layer: c.layer,
      exports: c.exports,
      description: c.description,
      import: c.importExample,
      props: c.props,
      stories: c.stories,
      sourcePath: c.sourcePath,
      storiesPath: c.storiesPath,
      note: "These props are extracted from source. Props with `allowedValues` accept ONLY those values. className/style/children and aria-*/data-*/on* are valid passthrough.",
    });
  }
);

/* ── search_components ─────────────────────────────────────────────── */
server.tool(
  "search_components",
  "Find Tesseract components by keyword across name and description (e.g. 'table', 'date', 'select', 'badge').",
  { query: z.string().describe("Keyword or phrase") },
  async ({ query }) => {
    const q = query.toLowerCase();
    const hits = manifest.components
      .filter((c) => c.name.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q))
      .map((c) => ({ name: c.name, layer: c.layer, purpose: (c.description || "").split(/[.•\n]/)[0].trim().slice(0, 140) }));
    return text({ query, count: hits.length, results: hits });
  }
);

/* ── validate_usage  (the guardrail) ───────────────────────────────── */
server.tool(
  "validate_usage",
  "GUARDRAIL: validate a proposed component usage against the real API. Pass a component name and the props you intend to set; it flags any prop that doesn't exist and any value outside the allowed set. Call this before committing generated JSX to guarantee zero hallucinated props/values.",
  {
    component: z.string().describe("Component name"),
    props: z.record(z.any()).describe("The props you intend to set, as an object, e.g. { variant: 'soft', color: 'success' }"),
  },
  async ({ component, props }) => {
    const c = findComponent(component);
    if (!c) {
      return text({ valid: false, errors: [`Unknown component '${component}'.`], didYouMean: closest(component, manifest.components.map((x) => x.name)) });
    }
    const byName = new Map(c.props.map((p) => [p.name, p]));
    const issues = [];
    for (const [key, value] of Object.entries(props || {})) {
      const spec = byName.get(key);
      if (!spec) {
        if (isPassthrough(key)) continue;
        issues.push({ prop: key, problem: "unknown prop — not in the component API", didYouMean: closest(key, c.props.map((p) => p.name)) });
        continue;
      }
      if (spec.allowedValues && value != null && !spec.allowedValues.includes(String(value))) {
        issues.push({ prop: key, problem: `value ${JSON.stringify(value)} is not allowed`, allowedValues: spec.allowedValues });
      }
    }
    return text({
      component: c.name,
      valid: issues.length === 0,
      issues,
      checkedAgainst: c.props.map((p) => p.name),
      import: c.importExample,
    });
  }
);

/* ── get_tokens ────────────────────────────────────────────────────── */
server.tool(
  "get_tokens",
  "Get Tesseract design tokens (CSS variables). Optionally filter by family (e.g. 'blue', 'space', 'radius', 'fg', 'bg'). Use these instead of raw colour/spacing values.",
  { family: z.string().optional().describe("Token family prefix, e.g. 'blue', 'space', 'radius'. Omit to list family names.") },
  async ({ family }) => {
    if (!family) return text({ families: Object.keys(manifest.tokens), hint: "Call get_tokens with a family to list its variables." });
    const fam = manifest.tokens[family];
    if (!fam) return text({ error: `No token family '${family}'.`, families: Object.keys(manifest.tokens) });
    return text({ family, tokens: fam });
  }
);

/* ── get_icons  (icon-name guardrail) ──────────────────────────────── */
server.tool(
  "get_icons",
  "Validate and search Tesseract icon names so you never invent one. With `query`, returns matching real icon names (TPLibraryIcon accepts any of them) and whether the query is an exact valid name. Without `query`, returns the valid icon `variant`s and counts. Use TPIcon/TPLibraryIcon/TPMedicalIcon with a name from here.",
  {
    query: z.string().optional().describe("Substring to search icon names, or an exact name to validate (e.g. 'calendar', 'heart')"),
    limit: z.number().optional().describe("Max names to return (default 40)"),
  },
  async ({ query, limit = 40 }) => {
    if (!query) {
      return text({
        variants: icons.variants,
        curatedDefaultVariants: icons.curatedVariants,
        libraryIconCount: icons.count,
        usage: 'TPLibraryIcon name="<name>" variant="linear" size={20}  ·  active/selected → variant="bulk"',
        note: "Call get_icons with a query to search/validate names. Names are the authoritative set from the icon library.",
      });
    }
    const q = query.toLowerCase();
    const exact = icons.names.includes(query);
    const matches = icons.names.filter((n) => n.toLowerCase().includes(q));
    return text({
      query,
      isExactValidIconName: exact,
      totalMatches: matches.length,
      names: matches.slice(0, limit),
      variants: icons.variants,
      truncated: matches.length > limit,
    });
  }
);

/* ── get_rules ─────────────────────────────────────────────────────── */
server.tool(
  "get_rules",
  "The non-negotiable rules every Tesseract page must follow (tokens-only, even dimensions, no external UI kits, etc.).",
  {},
  async () => text({ rules: manifest.rules, package: manifest.designSystem })
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("tesseract-mcp ready (stdio) —", manifest.counts.components, "components,", manifest.counts.tokens, "tokens,", icons.count, "icons");
