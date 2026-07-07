# Tesseract MCP

An MCP server that serves the **exact** Tesseract (`tesseract-ui`) components, props, allowed values, and design tokens — extracted from source — so any AI client configures **real** components instead of inventing them.

It is the machine-readable counterpart to the `/tesseract` skill: the skill teaches *how to compose a page*; this MCP supplies *ground-truth component data and validation*.

## How it works

```
source of truth                     served by
src/components/**  ──┐
src/tesseract-tokens.css ──┤  build-manifest.mjs  ──▶  manifest/component-manifest.json  ──▶  build-server.mjs ──▶ http-server.mjs (HOSTED, deployed) + server.mjs (stdio, dev)
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
| `get_design` | The full **design language** (`design.md`): colour meanings, typography, spacing, elevation, motion, shape, icons, voice, do/don't. Read to design "in our world" beyond raw prop data. |

## How consumers connect — the HOSTED server (only)

Consumers **never run this locally.** The MCP is deployed as a hosted HTTP server at
`https://tesseract.tatvapractice.in/mcp` (co-hosted in the Storybook container, bundle
`src/http-server.mjs`). Connect by URL with a bearer token — see
[`../docs/CONNECT-MCP.md`](../docs/CONNECT-MCP.md). This is deliberate: a hosted server
**auto-updates** when a new Tesseract version ships, so every client sees the new
components/props/tokens with nothing to re-clone or re-bundle. A local copy would
freeze at install time and go stale.

## Run locally (for developing the MCP itself only)

```bash
# 1. install (once)
cd mcp && npm install

# 2. (re)generate the manifest from source
npm run build:manifest

# 3. run / smoke test over stdio (dev only — not a consumer path)
npm start                 # regenerates manifest, then serves over stdio
node test/smoke.mjs       # end-to-end check of all tools
node src/server.mjs       # plain stdio server off the committed manifest
```

The stdio entry (`src/server.mjs`) and the HTTP entry (`src/http-server.mjs`) share one
tool factory (`src/build-server.mjs`), so the two transports can never drift. Only the
HTTP entry is deployed; stdio is a local dev/test convenience.

> Do not commit secrets in a client MCP config. The hosted token is distributed by the DS team.

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
