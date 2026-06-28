# Tesseract Design System (`tesseract-ui`)

The **Tesseract** design system — TatvaPractice's first-party React component
library (atoms + molecules), built with **zero runtime dependencies** (only
`react` / `react-dom` as peers).

> **Private & internal.** This is **not** published to public npm. It's
> distributed only from this private repo, so it's reusable **solely by people
> with access to it**. Tokens are namespaced `--tesseract-*` so Tesseract can be
> adopted gradually and run **side by side** with any existing UI library (e.g.
> the older `tp-ui`) without collisions.

---

## Install (private — GitHub Packages registry)

Published as a versioned npm package to the org's private **GitHub Packages**
registry — `@dhspl-tatvacare/tesseract-ui`. Versions are immutable and semver
ranges work, so consumers get safe patches and never a surprise breaking change.

**One-time:** add an `.npmrc` to your app's repo root (see [`.npmrc.example`](.npmrc.example)):
```ini
@dhspl-tatvacare:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```
Set a GitHub token with **`read:packages`** as `GITHUB_TOKEN` (shell profile locally;
CI secret in pipelines). Then:
```bash
npm install @dhspl-tatvacare/tesseract-ui react react-dom
```

- **Access gate:** org membership + the `read:packages` token. No access → install fails.
- **Updates:** `npm update @dhspl-tatvacare/tesseract-ui` — patches/minors only within `1.x`.
- **No-token fallback:** install the prebuilt bundle by git tag —
  `"@dhspl-tatvacare/tesseract-ui": "github:DHSPL-Tatvacare/tesseract-design-system#v1.0.2"`
  (gated by git access; no semver ranges). Full detail: [`docs/USING-TESSERACT.md`](docs/USING-TESSERACT.md).
- **Peers:** `react` / `react-dom` (React 18+).

---

## Quick start

```jsx
// app root — once
import "@dhspl-tatvacare/tesseract-ui/styles.css";
import { TesseractThemeProvider } from "@dhspl-tatvacare/tesseract-ui";

root.render(
  <TesseractThemeProvider colorScheme="light">
    <App />
  </TesseractThemeProvider>
);
```

```jsx
// anywhere
import { Button, Badge, DataTable, TPIcon } from "@dhspl-tatvacare/tesseract-ui";

<Button variant="solid" theme="primary" leftIcon={<TPIcon name="add" size={16} />}>
  Add Patient
</Button>
```

`import` resolves to `dist/tesseract-ui.js` (ESM), `require` to `dist/tesseract-ui.cjs`
(CJS); types ship at `dist/index.d.ts`.

---

## What's inside

**40 components — 17 atoms + 23 molecules.** Each ships one configurable component
per job rather than many near-duplicates (one Button, one Dropdown, one DataTable,
one date picker, one container shell).

- **Atoms (17):** Button, Badge, Chip, Checkbox, Radio, Toggle, Slider, InputBox,
  InputOTP, Avatar, Divider, Skeleton, LoadingIndicator, SegmentedControl,
  Progress, AnimatedGrid, Logo — plus the icon components `TPIcon` / `TPLibraryIcon`.
- **Molecules (23):** Header, Sidebar, SecondarySidebar, Breadcrumb, Tabs, Command,
  Accordion, Card, SectionCard, DataTable, ClinicalTable, Pagination, Filter,
  Dropdown, DateRangePicker, Drawer, ConfirmDialog, Empty, Alert, Toast, Tooltip,
  RxPadSection, HeroBanner.

Full list with one-line descriptions and per-component docs: **[`docs/CATALOG.md`](docs/CATALOG.md)**.
Browse them live in **Storybook** (`npm run storybook`).

---

## Icons (100% CDN)

Every icon is fetched from the design-system **CDN** at runtime — nothing is
bundled or stored in the package:

```
https://pmdoctorportal.tatvacare.in/tp-icons/<corner>/<style>/<family>/<name>.svg
```

You pass only a **name**; `corner`/`style` default to `rounded`/`linear` and the
`family` is resolved automatically. Use the exact CDN name.

```jsx
import { TPIcon, setIconBaseUrl } from "@dhspl-tatvacare/tesseract-ui";

<TPIcon name="calendar-1" />
<TPIcon name="warning" variant="bulk" color="var(--tesseract-warning-500)" />

setIconBaseUrl("/tp-icons"); // optional — self-host the SVGs
```

Variants: `linear` (default) · `bold` · `bulk` · `broken` · `twotone` · `outline`
(use `bulk` for active/selected state). Details in [`docs/ICONS.md`](docs/ICONS.md).

> **Logo** loads brand SVGs from `/brand/*.svg` — copy `public/brand/` into your
> app's web root (~20 KB). Every other component uses inline SVG and needs no
> extra assets.

---

## Tokens & fonts

`@dhspl-tatvacare/tesseract-ui/styles.css` ships the whole foundation as CSS variables —
`--tesseract-blue-500`, `--tesseract-space-4`, `--tesseract-radius-12`, the
typography scale, shadows, gradients — plus ready-made type classes
(`.tp-body-base`, `.tp-caption`, …) you can use in your own styles.

Fonts: **Inter** (body/UI) + **Mulish** (headings) — load them in your app:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Mulish:wght@600;700;800&display=swap" rel="stylesheet" />
```

---

## Theming

`TesseractThemeProvider` is the single theming surface — override ramps, component
tokens, breakpoints, or colour scheme; components re-theme with no prop changes
(they read `var(--tesseract-*)`). Never edit the token file; theme here instead.

```jsx
import { TesseractThemeProvider, useTheme, useBreakpoint, useComponentTokens } from "@dhspl-tatvacare/tesseract-ui";

<TesseractThemeProvider
  colorScheme="dark"                 // light | dark | system
  theme={{
    foundation: { colors: { blue: { 500: "#0EA5E9" } } },
    components: { button: { radius: "14px" } },
    breakpoints: { tablet: 720 },
  }}
>
  <App />
</TesseractThemeProvider>
```

Hooks: `useTheme()`, `useBreakpoint()` (`"mobile"|"tablet"|"desktop"`),
`useComponentTokens("button")`. Providers nest — a region can layer its own
overrides.

---

## AI tooling — build pages with Claude (`/tesseract` skill + MCP)

This repo ships an AI layer so Claude builds pages *in our world* and can't invent
a component:

- **[`.claude/skills/tesseract`](.claude/skills/tesseract)** — the `/tesseract`
  skill: brand, EMR page principles, a collaborative page intake, the component
  catalog, and domain knowledge.
- **[`mcp/`](mcp)** — the `tesseract` MCP server: serves the *exact* components,
  props, allowed values, tokens, and icon names from source, with a
  `validate_usage` guardrail.

### Install once, use everywhere (plugin — recommended, incl. cloud)

This repo is also a **private Claude Code plugin marketplace** — install it once and
the `/tesseract` skill **and** the MCP are available in **every** Claude Code session
(local or cloud), no per-project copying. The MCP is bundled dependency-free
(`mcp/dist/server.mjs`), so it runs anywhere Node runs.

```bash
# add this private repo as a marketplace, then install the plugin:
claude plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
claude plugin install tesseract@tesseract
```

(Or inside a session: `/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system`
then `/plugin install tesseract@tesseract`.)

- **Private auth:** a manual `add`/`install` uses your existing Git credentials
  (SSH / `gh auth login`). For automatic updates at startup — and in **cloud/web
  sessions** — set `GITHUB_TOKEN` (a PAT with repo read) in the environment.
- Updates: `claude plugin update tesseract@tesseract` (or auto on startup with the token).

### Manual alternatives (no plugin)

**In THIS repo** — open it in Claude Code, type `/tesseract`, and enable the MCP:
```bash
claude mcp add tesseract -- node "$(pwd)/mcp/src/server.mjs"
```

**In ANOTHER project** — copy the skill in and point the MCP at this repo:
```bash
cp -R <this-repo>/.claude/skills/tesseract  <your-project>/.claude/skills/tesseract
claude mcp add tesseract -- node <this-repo>/mcp/src/server.mjs
```

Then, in Claude Code: *“/tesseract — build me an All Patients list page.”* The
skill runs the intake, the MCP validates every component/prop/icon, and the output
is real `tesseract-ui` code. Full runbook: [`docs/USING-TESSERACT.md`](docs/USING-TESSERACT.md).

> Maintainers: after changing components, run `npm run build:mcp` to refresh the
> MCP manifest + bundled server, and commit — that keeps the plugin current.

---

## Peer dependencies

`react >= 18`, `react-dom >= 18` (uses `useId`, `createPortal`).

---

## Maintainers

```bash
npm run storybook                      # dev — Storybook on :6006
npm run build:lib                      # build dist/ (ESM + CJS + CSS + types)
npm run lint                           # eslint (0 errors)
node mcp/scripts/build-manifest.mjs    # refresh the MCP component manifest
```

**Distribution — cut a release:** to publish a new version, bump `version` in
`package.json`, then create a GitHub Release (`vX.Y.Z`).
[`.github/workflows/publish-package.yml`](.github/workflows/publish-package.yml)
builds with Vite and publishes `@dhspl-tatvacare/tesseract-ui@X.Y.Z` to **GitHub
Packages** (using the repo's built-in `GITHUB_TOKEN` — no PAT needed). Published
versions are immutable. In parallel, every push to `main` triggers
[`build-dist.yml`](.github/workflows/build-dist.yml), which keeps the prebuilt
**`build`** branch current for the no-token git-install fallback.

Tokens live in `src/tesseract-tokens.css` — never hand-edit in product code; theme
via `TesseractThemeProvider`. Icons are 100% CDN (no local SVG assets).

---

## Docs

Start at **[`docs/README.md`](docs/README.md)** — the documentation index. Key files:

- [`docs/CATALOG.md`](docs/CATALOG.md) — every component (40), grouped, with one-line
  descriptions and links to per-component usage docs in [`docs/components/`](docs/components).
- [`docs/PREREQUISITE.md`](docs/PREREQUISITE.md) — the **v1.0 stability contract**
  (SemVer, public-API surface, how consumers stay upgrade-safe). Read before adopting.
- [`docs/USING-TESSERACT.md`](docs/USING-TESSERACT.md) — consume the package, the
  skill, and the MCP in a new project (CLI / cloud).
- [`docs/ICONS.md`](docs/ICONS.md) — the icon CDN URL structure, families, styles,
  and name aliases.
