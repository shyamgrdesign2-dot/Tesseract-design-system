# Tesseract UI — documentation

The `tesseract-ui` design system: 50 token-driven React components (atoms, molecules,
charts) for GenX and TatvaPractice — plus an AI layer (the `/tesseract` skill + a
hosted MCP) that builds screens with the real components.

## Start here
- **[SETUP-TESSERACT.md](./SETUP-TESSERACT.md)** — the **one self-contained file** to hand a colleague: paste it into a Claude chat and it sets up all of Tesseract (MCP + skill + package).
- **[../STARTER.md](../STARTER.md)** — set up the three pieces: the MCP, the skill, the package.
- **[TRIAL.md](./TRIAL.md)** — ⚡ zero-to-running in a fresh project: get a token, install, render a component.
- **[CONNECT-MCP.md](./CONNECT-MCP.md)** — connect the **hosted** MCP to Claude Code / Cursor / Claude Desktop.
- **[CURSOR-SETUP.md](./CURSOR-SETUP.md)** — Cursor-specific: `mcp.json` config, enabling it, and using it in the Agent chat.
- **[SESSION-BRIEF.md](./SESSION-BRIEF.md)** — paste-in context brief that tells any Claude/Cursor session the current Tesseract reality + how to connect (read-only, no changes).
- **[MIGRATE-TO-HOSTED-MCP.md](./MIGRATE-TO-HOSTED-MCP.md)** — paste-in task to sync any project to the latest Tesseract: hosted MCP, current plugin, and auto-upgrade the component package.
- **[CATALOG.md](./CATALOG.md)** — every component, grouped, each linking its usage doc.

## Build with it
- **[../design.md](../design.md)** — the design language: foundations (colour, type, spacing, elevation, motion, shape, icons), hard rules, and voice — for agents and humans.
- **[ADOPTION.md](./ADOPTION.md)** — adopting into an existing / mixed-stack app (AntD/Material): `rootTheme={false}` containment, the stable `data-*` styling contract, env icon base.
- **[ICONS.md](./ICONS.md)** — the icon system (`TPIcon` / `TPLibraryIcon`, families, self-hosting).
- **Per-component docs** — one concise usage doc per component in **[`components/`](./components)** (import, when-to-use, key props, a realistic example, notable variants).

## Stay upgrade-safe
- **[PREREQUISITE.md](./PREREQUISITE.md)** — the v1.0 stability contract (SemVer, what's public API).
- **[UPGRADING.md](./UPGRADING.md)** — moving between versions. Full history: [CHANGELOG](../CHANGELOG.md).

## Operate (maintainers)
- **[MAINTAINING.md](./MAINTAINING.md)** — how skill/MCP/package updates propagate, and the **preflight gate** (local hook + CI + deploy) that blocks any push that would break consumers.
- **[DEPLOY-AZURE.md](./DEPLOY-AZURE.md)** — building & deploying the Storybook container (which also co-hosts the MCP).
- **[DEPLOY-AUTH.md](./DEPLOY-AUTH.md)** — access-protecting the deployed Storybook.

## Quick install

```bash
# public on npm — no token or .npmrc needed:
npm install @dhspl-tatvacare/tesseract-ui
```
```jsx
// app root, once:
import "@dhspl-tatvacare/tesseract-ui/styles.css";
import { TesseractThemeProvider } from "@dhspl-tatvacare/tesseract-ui";
// then import any component from "@dhspl-tatvacare/tesseract-ui".
```

Adopting alongside an existing UI? Tesseract's styles are scoped CSS-module classes
under `--tesseract-*` tokens — no global bleed. See [ADOPTION.md](./ADOPTION.md).

## Explore interactively

```bash
npm run storybook   # every component, every variant, with live controls
```
