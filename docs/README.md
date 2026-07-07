# Tesseract UI — documentation

The `tesseract-ui` design system: 50 token-driven React components (atoms, molecules,
charts) for GenX and TatvaPractice — plus an AI layer (the `/tesseract` skill + a
hosted MCP) that builds screens with the real components.

## Start here
- **[../STARTER.md](../STARTER.md)** — set up the three pieces: the MCP, the skill, the package.
- **[TRIAL.md](./TRIAL.md)** — ⚡ zero-to-running in a fresh project: get a token, install, render a component.
- **[CONNECT-MCP.md](./CONNECT-MCP.md)** — connect the **hosted** MCP to Claude Code / Cursor / Claude Desktop.
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
- **[DEPLOY-AZURE.md](./DEPLOY-AZURE.md)** — building & deploying the Storybook container (which also co-hosts the MCP).
- **[DEPLOY-AUTH.md](./DEPLOY-AUTH.md)** — access-protecting the deployed Storybook.

## Quick install

```jsonc
// .npmrc gated by org membership; then:
{ "dependencies": { "@dhspl-tatvacare/tesseract-ui": "^1.0.0" } }
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
