# Tesseract MCP

An MCP server that serves the **exact** Tesseract (`tp-ui`) components, props, allowed values, and design tokens — extracted from source — so any AI client configures **real** components instead of inventing them.

It is the machine-readable counterpart to the `/tesseract` skill: the skill teaches *how to compose a page*; this MCP supplies *ground-truth component data and validation*.

## How it works

```
source of truth                     served by
src/components/**  ──┐
src/tp-tokens.css ──┤  build-manifest.mjs  ──▶  manifest/component-manifest.json  ──▶  src/server.mjs (MCP, stdio)
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

## Gradual refinement (roadmap)

- Fill value-enums for the few props whose options live in shared constants (currently 27/31 components have extracted enums; the rest expose prop names only).
- Add `get_icons` (valid icon names) once the icon registry is wired in.
- Add `get_page_recipe` to serve the skill's archetypes/recipes.
- Optionally emit per-prop TypeScript types.

The server stays stable; refinement happens in `build-manifest.mjs`.
