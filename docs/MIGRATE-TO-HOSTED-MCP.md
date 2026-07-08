# Sync a project to the latest Tesseract

Paste the block below into any other Claude Code session / project that uses Tesseract.
It brings that project fully up to date in one shot:

1. **MCP → hosted only.** Removes any local/stdio/bundled/cloned Tesseract MCP and points
   the session at the hosted server (`https://tesseract.tatvapractice.in/mcp`), which
   **auto-updates** on every release — so the AI is always grounded in the current
   components, props, tokens, icons, rules and design language.
2. **Skill/plugin → current.** Updates the `/tesseract` plugin (which now auto-configures
   the hosted MCP).
3. **Component package → latest.** Checks the installed `@dhspl-tatvacare/tesseract-ui`
   version against the newest release and **upgrades if older** (SemVer-safe within `1.x`).

It detects before it deletes, keeps the component package the app imports, and reports
what it changed.

---

## ⤵ Paste this into the other session

```text
TASK — Sync this project to the LATEST Tesseract (MCP + skill + component package).

Context: Tesseract's MCP is now a HOSTED HTTP server at https://tesseract.tatvapractice.in/mcp
(bearer-token auth, and OAuth for Claude's Connectors UI). It auto-updates on every release,
so nothing should run a local copy. The component library latest is >= 1.0.6. Bring this
project fully current. Detect before deleting; keep the component package the app imports.

STEP 1 — MCP: hosted only.
  a) DETECT (read-only), then print findings: `claude mcp list` (any `tesseract` server whose
     command is a local `node … .mjs` path); `.mcp.json` here/parent with a `tesseract` entry
     using "command"/"args" (local) rather than "type":"http"; `~/.claude.json` mcpServers
     named `tesseract` with a local path; copied `**/.claude/skills/tesseract` folders; any
     local design-system clone (`.claude-plugin/plugin.json` name "tesseract", or mcp/src/server.mjs);
     any vendored `tesseract-ui-*.tgz`.
  b) REMOVE the local MCP wiring: `claude mcp remove tesseract` if local; delete/replace local
     `tesseract` entries in `.mcp.json` and `~/.claude.json`; delete copied `.claude/skills/tesseract`
     folders; delete a local DS clone ONLY if `git status` shows no unique uncommitted work
     (else stop and ask me). Keep node_modules/@dhspl-tatvacare/tesseract-ui.
  c) CONNECT the hosted MCP at project scope (commits a .mcp.json for the team/cloud):
     claude mcp add --transport http tesseract https://tesseract.tatvapractice.in/mcp \
       --scope project --header "Authorization: Bearer <TESSERACT_MCP_TOKEN>"
     (Get the token from the DS team. For the claude.ai/Desktop Connectors UI instead: add a
     custom connector with that URL, leave OAuth client id/secret BLANK — it self-registers —
     and paste the token once on the consent page.)

STEP 2 — Skill/plugin: current.
  If the `/tesseract` plugin is installed: run `claude plugin update tesseract@tesseract`
  (it now auto-configures the hosted MCP). If not installed and you want the page-building
  skill: `/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system` then
  `/plugin install tesseract@tesseract`.

STEP 3 — Component package: latest (auto-upgrade if older).
  a) INSTALLED version: read node_modules/@dhspl-tatvacare/tesseract-ui/package.json "version"
     (and the range in this app's package.json).
  b) LATEST version: `npm view @dhspl-tatvacare/tesseract-ui version` (public npm — no auth).
     Or ask the tesseract MCP's check_version tool with the installed version.
  c) IF installed < latest → UPGRADE (SemVer-safe within 1.x — additive only):
       npm install @dhspl-tatvacare/tesseract-ui@latest
     Then rebuild. If the jump crosses a MAJOR (2.x), STOP and tell me — read the CHANGELOG first.
  d) Confirm one import still resolves, e.g.:
       import "@dhspl-tatvacare/tesseract-ui/styles.css";
       import { Button } from "@dhspl-tatvacare/tesseract-ui";

STEP 4 — VERIFY + REPORT.
  `claude mcp list` shows `tesseract` as the HTTP URL, Connected. Ask yourself to "list the
  tesseract MCP tools" — expect 9: list_components, get_component, search_components,
  validate_usage, get_tokens, get_icons, get_rules, get_design, check_version. Summarize: local MCP removed,
  hosted MCP connected, plugin updated, package version before → after, and anything left for me.
```

---

## What it changes / keeps

| Brought up to date | Left alone |
|---|---|
| MCP → hosted (auto-latest); local copies removed | `@dhspl-tatvacare/tesseract-ui` package (the app imports it — just upgraded, not removed) |
| `/tesseract` plugin → current (hosted MCP) | Your app code (upgrade is additive within `1.x`) |
| Component package → newest `1.x` if older | Non-Tesseract dependencies |

The **token** goes to the DS team, not into random chats. See [CONNECT-MCP.md](./CONNECT-MCP.md)
(all connect options incl. the OAuth Connectors flow) and [UPGRADING.md](./UPGRADING.md)
(per-version notes).
