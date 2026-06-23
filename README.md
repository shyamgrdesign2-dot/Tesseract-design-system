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

## Install (private — straight from this repo)

A GitHub Action builds the library on every push to `main` and keeps a prebuilt
**`build`** branch up to date. Consumers install from that branch — no registry,
no public npm, no per-package tokens. Add to your app's `package.json`:

```jsonc
{
  "dependencies": {
    "tesseract-ui": "github:DHSPL-Tatvacare/tesseract-design-system#build"
  }
}
```

then `npm install`. (SSH form, for machines using an SSH key:
`git+ssh://git@github.com/DHSPL-Tatvacare/tesseract-design-system.git#build`.)

- **The only access gate is Git access to this repo** — an SSH key locally, or a
  PAT / deploy key with repo-read in CI. No repo access → `npm install` fails.
- The `build` branch ships prebuilt `dist/` and runs **no install-time build**, so
  it never pulls our dev tooling (Storybook/Playwright) into your app.
- **Updates:** `npm update tesseract-ui` — the branch refreshes on every merge to `main`.
- **Peers:** `npm install react react-dom` (React 18+).

---

## Quick start

```jsx
// app root — once
import "tesseract-ui/styles.css";
import { TesseractThemeProvider } from "tesseract-ui";

root.render(
  <TesseractThemeProvider colorScheme="light">
    <App />
  </TesseractThemeProvider>
);
```

```jsx
// anywhere
import { Button, Badge, DataTable, TPIcon } from "tesseract-ui";

<Button variant="solid" theme="primary" leftIcon={<TPIcon name="add" size={16} />}>
  Add Patient
</Button>
```

`import` resolves to `dist/tesseract-ui.js` (ESM), `require` to `dist/tesseract-ui.cjs`
(CJS); types ship at `dist/index.d.ts`.

---

## What's inside

- **Atoms (16):** Button, Badge, Chip, Checkbox, Radio, Toggle, Slider, InputBox,
  Avatar, Divider, Skeleton, LoadingIndicator, SegmentedControl, AnimatedGrid,
  Logo, MedicalIcon — plus the icon components `TPIcon` / `TPLibraryIcon`.
- **Molecules (15):** Header, Sidebar, SecondarySidebar, Tabs, Accordion,
  DataTable, ClinicalTable, Filter, Dropdown, DateRangePicker, ConfirmDialog,
  Toast, Tooltip, RxPadSection, HeroBanner.

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
import { TPIcon, setIconBaseUrl } from "tesseract-ui";

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

`tesseract-ui/styles.css` ships the whole foundation as CSS variables —
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
import { TesseractThemeProvider, useTheme, useBreakpoint, useComponentTokens } from "tesseract-ui";

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

**Distribution:** pushing to `main` triggers
[`.github/workflows/build-dist.yml`](.github/workflows/build-dist.yml), which
rebuilds and force-commits `dist/` to the **`build`** branch that consumers install
from. (The branch is already seeded, so installs work even before the first CI run.)

Tokens live in `src/tesseract-tokens.css` — never hand-edit in product code; theme
via `TesseractThemeProvider`. Icons are 100% CDN (no local SVG assets).

---

## Docs

- [`docs/USING-TESSERACT.md`](docs/USING-TESSERACT.md) — consume the package, the
  skill, and the MCP in a new project (CLI / cloud).
- [`docs/ICONS.md`](docs/ICONS.md) — the icon CDN URL structure, families, styles,
  and name aliases.
