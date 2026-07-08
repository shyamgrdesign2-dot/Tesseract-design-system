# Set up Tesseract (send this whole file to Claude)

**How to use:** paste this entire file into a **Claude** chat (Claude Code, the desktop
app, or claude.ai) and say *"help me set up Tesseract by following this."* Claude will walk
you through it. Everything you need is in this one file — you don't need any other doc.

Tesseract is TatvaPractice's React design system. It has **three pieces**, and you can set
up any subset:
1. **The MCP** — grounds your AI in the real components/props/tokens/icons (hosted; always latest).
2. **The `/tesseract` skill** — the page-building brand + EMR principles (Claude Code plugin).
3. **The component package** — `@dhspl-tatvacare/tesseract-ui` you import in your app.

---

## 0 · Access you need first
- Membership in the **`DHSPL-Tatvacare`** GitHub org (gates the repo, the plugin, and the package).
  No access? Ask **Karthik Jangam** (karthik.jangam@tatvacare.in).
- The **MCP token** (a shared bearer token) — included below.

---

## 1 · Connect the MCP (pick your client)

The MCP is hosted at **`https://tesseract.tatvapractice.in/mcp`** — connect by URL, always
the latest, nothing to clone.

**Token:** `c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54`

### Claude Code (CLI or cloud) — recommended
Run in your project (writes a shareable `.mcp.json`):
```bash
claude mcp add --transport http tesseract https://tesseract.tatvapractice.in/mcp \
  --scope project \
  --header "Authorization: Bearer c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54"
```

### Cursor
`.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):
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

### claude.ai / Claude Desktop — Connectors
Settings → **Connectors** → **Add custom connector**:
- **Name:** `tesseract`
- **Remote MCP server URL:** `https://tesseract.tatvapractice.in/mcp`
- **OAuth Client ID / Secret:** leave **BLANK** (it self-registers)
- Continue → a Tesseract consent page opens → paste the **token above** once → authorize.

**Verify:** ask your AI *"list the tesseract MCP tools."* You should see 9 —
`list_components`, `get_component`, `search_components`, `validate_usage`, `get_tokens`,
`get_icons`, `get_rules`, `get_design`, `check_version`.

---

## 2 · The `/tesseract` skill (Claude Code plugin)

Gives you the page-building skill **and** auto-configures the hosted MCP for you. In Claude Code:
```
/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
/plugin install tesseract@tesseract
```
Then **restart Claude Code**. Type `/tesseract` before building any screen. (In cloud/web
sessions, set `GITHUB_TOKEN` — a PAT with repo read — so the private marketplace resolves and
the plugin auto-updates at startup.)

---

## 3 · Install the component package

It's **public on npm — no token, no `.npmrc`, no org membership**:
```bash
npm install @dhspl-tatvacare/tesseract-ui
```
Use it (once, at your app root, then anywhere):
```jsx
import "@dhspl-tatvacare/tesseract-ui/styles.css";
import { TesseractThemeProvider } from "@dhspl-tatvacare/tesseract-ui";

// wrap your app once:
// <TesseractThemeProvider colorScheme="light"><App /></TesseractThemeProvider>

import { Button, DataTable, LineChart } from "@dhspl-tatvacare/tesseract-ui";
```
Add the fonts in your HTML `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Mulish:wght@600;700;800&display=swap" rel="stylesheet" />
```

---

## Just one token
Only the **MCP bearer** token `c5713…` (Step 1 / the Connectors consent page). The npm
package is **public** — installing it (Step 3) needs no token at all.

## In one line
Connect the MCP (Step 1) → install the plugin for `/tesseract` (Step 2) → `npm install` the
package (Step 3). The MCP and skill auto-update; take component updates with
`npm update @dhspl-tatvacare/tesseract-ui`.

**Rule when building UI:** always output real `@dhspl-tatvacare/tesseract-ui` components,
grounded via the MCP (`get_component` / `validate_usage`) — never Ant Design, MUI, Tailwind,
or hand-rolled components.
