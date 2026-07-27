# Tesseract UI — documentation

The `tesseract-ui` design system: 50 token-driven React components (atoms, molecules,
charts) for GenX and TatvaPractice — plus an AI layer (the `/tesseract` skill + a
hosted MCP) that builds screens with the real components.

## Start here — one guide
- **[../STARTER.md](../STARTER.md)** — **the** guide: set up (MCP + `/tesseract` skill +
  the package) and use it, for **designers and developers**. Everything's in here.

## Reference
- **[CATALOG.md](./CATALOG.md)** — every component, grouped, each linking its usage doc.
- **Per-component docs** — one concise usage doc per component in **[`components/`](./components)** (import, when-to-use, key props, a realistic example, notable variants).
- **[../design.md](../design.md)** — the design language: foundations (colour, type, spacing, elevation, motion, shape, icons), hard rules, and voice.
- **[ICONS.md](./ICONS.md)** — the icon system (`TPIcon` / `TPLibraryIcon`, families, self-hosting).

## Versioning
- **[PREREQUISITE.md](./PREREQUISITE.md)** — the v1.0 stability contract (SemVer, what's public API).
- **[UPGRADING.md](./UPGRADING.md)** — moving between versions. Full history: [CHANGELOG](../CHANGELOG.md).

## Operate (maintainers)
- **[MAINTAINING.md](./MAINTAINING.md)** — how skill/MCP/package updates propagate, and the **preflight gate** (local hook + CI + deploy) that blocks any push that would break consumers.
- **[DEPLOY-AZURE.md](./DEPLOY-AZURE.md)** — building & deploying the Storybook container (which also co-hosts the MCP).
- **[DEPLOY-AUTH.md](./DEPLOY-AUTH.md)** — access-protecting the deployed Storybook.

## Quick install

```bash
# private (GitHub Packages) — one-time .npmrc + read:packages token (see ../STARTER.md), then:
npm install @dhspl-tatvacare/tesseract-ui
```
```jsx
// app root, once:
import "@dhspl-tatvacare/tesseract-ui/styles.css";
import { TesseractThemeProvider } from "@dhspl-tatvacare/tesseract-ui";
// then import any component from "@dhspl-tatvacare/tesseract-ui".
```

## Explore interactively

```bash
npm run storybook   # every component, every variant, with live controls
```
