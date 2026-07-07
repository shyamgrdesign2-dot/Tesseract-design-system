# Tesseract — setup

TatvaPractice's React design system: a **component library** plus an **AI layer**
(the `/tesseract` skill + a hosted MCP) that makes Claude / Cursor build our screens
with the *real* components — not invented props.

Three independent pieces — set up whichever you need.

---

## Access (read first)
Everything is **private** to the `DHSPL-Tatvacare` org:
- the repo `DHSPL-Tatvacare/tesseract-design-system` (skill + MCP),
- the npm package `@dhspl-tatvacare/tesseract-ui` (GitHub Packages),
- the hosted-MCP bearer token.

No access? Ask dev / ops — **Karthik Jangam** (karthik.jangam@tatvacare.in).

---

## 1 · Point your AI at Tesseract (the MCP)
The **hosted MCP** feeds your AI tool our exact components, props, tokens, icons, and
design language, with a `validate_usage` guardrail. Connect by URL — always the
latest, nothing to clone:

- **URL:** `https://tesseract.tatvapractice.in/mcp`
- **Auth:** a bearer token — ask the DS team.

Per-tool config (Cursor / Claude Code / Claude Desktop) → **[docs/CONNECT-MCP.md](docs/CONNECT-MCP.md)**.

## 2 · Add the `/tesseract` skill (Claude Code)
The skill grounds Claude in our brand + EMR page principles + a guided page intake
(and bundles a local MCP). Install once:
```
/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
/plugin install tesseract@tesseract
```
Then start every screen by typing `/tesseract` (or "use the Tesseract design system").

## 3 · Install the component package
Private npm on GitHub Packages. One-time `.npmrc` in your app root (token needs
`read:packages`):
```ini
@dhspl-tatvacare:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```
```bash
npm install @dhspl-tatvacare/tesseract-ui
```
```jsx
// app root, once:
import "@dhspl-tatvacare/tesseract-ui/styles.css";
import { TesseractThemeProvider } from "@dhspl-tatvacare/tesseract-ui";
// then import any component:
import { Button, DataTable, LineChart } from "@dhspl-tatvacare/tesseract-ui";
```
Pin a range (`^1.0.0`) and take patches/minors freely — never a breaking change
within `1.x` (see [docs/PREREQUISITE.md](docs/PREREQUISITE.md)).

Want a copy-paste, brand-new-project walkthrough? → **[docs/TRIAL.md](docs/TRIAL.md)**.

---

**In one line:** connect the MCP by URL → `/plugin install` the skill → `npm install`
the package.

**Learn the design language:** [design.md](design.md) · **every component:** [docs/CATALOG.md](docs/CATALOG.md) · **mixed-stack app:** [docs/ADOPTION.md](docs/ADOPTION.md).
