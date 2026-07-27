# Tesseract — set up & use

TatvaPractice's React design system: **components** plus an **AI layer** (a hosted MCP + the
`/tesseract` skill) that builds screens with the *real* components. This one guide is
everything — set up once, then use it whether you're a **designer** or a **developer**.

## What you get
- **Component gallery** — every component, live: **https://tesseract.tatvapractice.in**
- **AI grounding** — the MCP + `/tesseract` skill so Cursor / Claude build with real components
- **The package** — `@dhspl-tatvacare/tesseract-ui` to import in your app
- **The design language** — [design.md](design.md)

## Access (once)
Everything is private to the **DHSPL-Tatvacare** GitHub org. Ask dev/ops — **Karthik Jangam**
(karthik.jangam@tatvacare.in) — for org access + the two tokens used below.

---

## Setup — do this once

### 1 · Connect the AI (the MCP)
Hosted at `https://tesseract.tatvapractice.in/mcp` — always the latest, nothing to clone.
**MCP token:** `c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54`

- **Cursor** — `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):
  ```json
  {
    "mcpServers": {
      "tesseract": {
        "url": "https://tesseract.tatvapractice.in/mcp",
        "headers": { "Authorization": "Bearer c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54" }
      }
    }
  }
  ```
- **Claude Code** —
  ```bash
  claude mcp add --transport http tesseract https://tesseract.tatvapractice.in/mcp \
    --scope project --header "Authorization: Bearer c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54"
  ```
  `--scope project` commits a `.mcp.json` so the whole team + cloud sessions get it.
- **claude.ai / Claude Desktop → Connectors** — add a custom connector with that URL, leave the
  **OAuth client id/secret blank** (it self-registers), and paste the token on the consent page.

Verify: ask *"list the tesseract MCP tools"* → you should see **9**.

### 2 · Add the `/tesseract` skill (Claude Code)
```
/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
/plugin install tesseract@tesseract
```
It grounds the AI in our brand + EMR page principles **and auto-configures the same hosted MCP**.
Type `/tesseract` before building any screen. (In cloud/web sessions, set `GITHUB_TOKEN` so the
private marketplace resolves + auto-updates.)

### 3 · Install the component package
Private on GitHub Packages — one-time `.npmrc` in your app root (token via `${NPM_TOKEN}`, a
`read:packages` PAT the team gives you):
```ini
@dhspl-tatvacare:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```
```bash
npm install @dhspl-tatvacare/tesseract-ui
```
```jsx
import "@dhspl-tatvacare/tesseract-ui/styles.css";               // once, at the app root
import { TesseractThemeProvider } from "@dhspl-tatvacare/tesseract-ui";
// wrap once: <TesseractThemeProvider colorScheme="light"><App/></TesseractThemeProvider>
import { Button, DataTable } from "@dhspl-tatvacare/tesseract-ui";
```
Add the fonts (Inter + Mulish) via a Google Fonts `<link>`. The install token is also stored as a
**GitHub + Azure secret**, so pushes and CI/CD builds work with **no per-person setup**.

> **Two tokens:** the **MCP token** (`c5713…`, step 1) and the **`read:packages` token** (`${NPM_TOKEN}`,
> step 3). Both come from the DS team.

---

## For designers
1. **Browse** the gallery (link above) — flip the controls, copy code. It's your palette.
2. **Learn the language** — skim [design.md](design.md): colours & meaning, type, spacing, rules.
3. **Build by describing** — in Cursor/Claude, type `/tesseract` and describe a screen: *"an All
   Patients list with search, filters, a table, and an Add Patient button."* It builds real
   Tesseract code, checking every component/prop/icon against the MCP. Refine by asking (*"denser
   table"*, *"warning tone for overdue"*).

## For developers
- **Use it** — import from the package root; theme via `TesseractThemeProvider`; icons load from
  the CDN (`TPIcon`). Every component's usage doc is in [docs/components/](docs/components).
- **Mixed stack** (embedding in an AntD / Material app) — wrap with `rootTheme={false}` so Tesseract
  doesn't stamp its base typography onto the host; style via the stable `data-*` hooks, never hashed
  CSS-module classes.
- **Ground with the MCP** — `get_component` / `validate_usage` before writing JSX; `check_version`
  (pass the installed version) to see if the project is behind.
- **Upgrade** — `npm update @dhspl-tatvacare/tesseract-ui`; SemVer-safe within `1.x` (additive only;
  a major `2.x` ships a migration note). Per-version notes: [docs/UPGRADING.md](docs/UPGRADING.md).

## The one rule
Always output real **`@dhspl-tatvacare/tesseract-ui`** components, grounded via the MCP — never Ant
Design, Material, Tailwind, or hand-rolled. The MCP + `/tesseract` skill enforce this automatically.

## Reference
[docs/CATALOG.md](docs/CATALOG.md) — every component (+ per-component docs) ·
[design.md](design.md) — the design language ·
[docs/ICONS.md](docs/ICONS.md) — the icon system ·
[CHANGELOG.md](CHANGELOG.md) — version history.
