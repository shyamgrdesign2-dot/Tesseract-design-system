# Tesseract MCP

An MCP server that serves the **exact** Tesseract (`tesseract-ui`) components, props, allowed values, and design tokens — extracted from source — so any AI client configures **real** components instead of inventing them.

It is the machine-readable counterpart to the `/tesseract` skill: the skill teaches *how to compose a page*; this MCP supplies *ground-truth component data and validation*.

## How it works

```
source of truth                     served by
src/components/**  ──┐
src/tesseract-tokens.css ──┤  build-manifest.mjs  ──▶  manifest/component-manifest.json  ──▶  src/server.mjs (MCP, stdio)
                     ┘
```

The server answers **only** from the manifest. It cannot return a prop or value that isn't in your code. Regenerate the manifest whenever the design system changes — that's the "refinable gradually" loop.

## Tools

| Tool | Purpose |
|------|---------|
| `list_components` | Exact inventory (optionally by `layer`). |
| `get_component` | Full spec for one component: every real prop, allowed values, defaults, import line, story names. |
| `search_components` | Find components by keyword across name + description. |
| `validate_usage` | **Guardrail.** Give it a component + the props you intend to set; it flags any prop that doesn't exist and any value outside the allowed set. Returns "did you mean" suggestions. |
| `get_tokens` | Design tokens by family (`blue`, `space`, `radius`, `fg`, `bg`, …). Use instead of raw values. |
| `get_icons` | **Icon guardrail.** Search/validate real icon names (4,724 in the library) and list the valid `variant`s, so you never invent an icon name. |
| `get_rules` | The non-negotiable rules every page must follow. |

## Run

```bash
# 1. install (once)
cd mcp && npm install

# 2. (re)generate the manifest from source
npm run build:manifest

# 3a. run for development / smoke test
npm start                 # regenerates manifest, then serves over stdio
node test/smoke.mjs       # end-to-end check of all tools

# 3b. run as a plain stdio server off the committed manifest
node src/server.mjs
```

## Wire into an MCP client

Add to your client's MCP config (Claude Code / Claude Desktop `mcpServers`). Inside the design-system repo, prefer `npm start` so the manifest is always fresh:

```jsonc
{
  "mcpServers": {
    "tesseract": {
      "command": "npm",
      "args": ["--prefix", "/absolute/path/to/TP_UI_Storybook/mcp", "start"]
    }
  }
}
```

For a consuming project that only ships the committed manifest, point straight at the server:

```jsonc
{
  "mcpServers": {
    "tesseract": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/src/server.mjs"]
    }
  }
}
```

> Do not commit secrets in your MCP config. This server needs none.

## Anti-hallucination workflow (recommended)

When generating a page with Tesseract components:
1. `search_components` / `list_components` → find the right component.
2. `get_component` → read its real props + allowed values before writing JSX.
3. Write the usage.
4. `validate_usage` → confirm zero unknown props / out-of-range values before committing.

## Coverage

- **Components:** 50 (19 atoms, 24 molecules, 7 charts) — every public prop extracted. Charts (LineChart, BarChart, DonutChart/PieChart, Sparkline, StatCard, RadarChart, GaugeChart) added in v1.0.4–v1.0.5.
- **Allowed-value enums:** 46/50 components; the rest have only object/function props with nothing to enumerate. Enums are resolved from storybook `argTypes` (including `options: CONST` references), with a small verified `ENUM_OVERRIDES` map for source-derived cases (e.g. `MedicalIcon.variant`).
- **Tokens:** 216 CSS variables across all families.
- **Icons:** 4,724 library names + 6 variants, searchable/validatable via `get_icons`.

## Gradual refinement (roadmap)

- Add `get_page_recipe` to serve the `/tesseract` skill's archetypes/recipes.
- Use `icon-availability.json` to validate name×variant pairs (which variants actually exist per icon).
- Optionally emit per-prop TypeScript types and required/optional flags.

The server stays stable; refinement happens in `build-manifest.mjs` (and the curated `ENUM_OVERRIDES`).
