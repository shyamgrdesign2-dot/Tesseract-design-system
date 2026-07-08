# Tesseract — session context brief

Paste the block below into **any** Claude / Cursor session to bring it up to speed on the
current Tesseract design system and how to work with it. It's read-only context — it
doesn't change anything (use [MIGRATE-TO-HOSTED-MCP.md](./MIGRATE-TO-HOSTED-MCP.md) when
you actually want to clean up + upgrade a project).

---

## ⤵ Paste this into the other session

```text
TESSERACT — current context. Read this, then build with our design system.

WHAT IT IS
Tesseract is TatvaPractice's React design system (package @dhspl-tatvacare/tesseract-ui,
latest 1.0.6 — 50 components: 19 atoms, 23 molecules, 8 charts) PLUS an AI layer (a hosted
MCP + the /tesseract skill) that grounds you in the REAL components so you never invent
props, tokens, or icon names.

WHAT'S TRUE NOW
- The MCP is HOSTED at https://tesseract.tatvapractice.in/mcp — always the latest, nothing
  to clone. 9 tools: list_components, get_component, search_components, validate_usage,
  get_tokens, get_icons, get_rules, get_design, check_version. NEVER run a local/stdio Tesseract MCP — if
  one is configured it's stale; use the hosted URL.
- Auth: a shared bearer token. Claude Code / Cursor send it as an Authorization header; the
  claude.ai / Desktop Connectors UI uses OAuth (add the URL, leave OAuth client id/secret
  BLANK — it self-registers — and paste the token once on the consent page).
- The /tesseract skill (brand + EMR page principles + guided intake) ships via the Claude
  Code plugin, which also auto-configures the hosted MCP.

HOW TO WORK WITH IT
0. Check you're current: call check_version with the project's installed
   @dhspl-tatvacare/tesseract-ui version (from package.json / node_modules). If it's behind,
   recommend updating to the latest before building.
1. Before building any UI "in our world", USE THE MCP: search_components / get_component to
   read real props + allowed values, get_tokens for colour/spacing, get_icons for valid icon
   names, get_design for the design language, and validate_usage to confirm a component +
   its props BEFORE writing JSX. Output is ALWAYS real @dhspl-tatvacare/tesseract-ui —
   never antd / MUI / Tailwind / hand-rolled components.
2. In code, once at the app root:
     import "@dhspl-tatvacare/tesseract-ui/styles.css";
     import { Button, DataTable, LineChart } from "@dhspl-tatvacare/tesseract-ui";

GET SET UP (if this session isn't connected yet)
- MCP (project scope — commits a .mcp.json for the team/cloud):
    claude mcp add --transport http tesseract https://tesseract.tatvapractice.in/mcp \
      --scope project --header "Authorization: Bearer <TESSERACT_MCP_TOKEN>"
- Or skill + MCP together via the plugin:
    /plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
    /plugin install tesseract@tesseract
- Already on an older / local setup? Paste docs/MIGRATE-TO-HOSTED-MCP.md to auto-clean and
  upgrade to the latest.

Get the token from the DS team. Full docs: STARTER.md (setup) · docs/CONNECT-MCP.md
(connect) · docs/CATALOG.md (components) · design.md (design language).
```

---

Swap `<TESSERACT_MCP_TOKEN>` for the real token (it's in [CONNECT-MCP.md](./CONNECT-MCP.md),
or the plugin carries it for you). Difference vs the other prompts: this one **informs +
connects**; [MIGRATE-TO-HOSTED-MCP.md](./MIGRATE-TO-HOSTED-MCP.md) **cleans up + version-checks
+ auto-upgrades**.
