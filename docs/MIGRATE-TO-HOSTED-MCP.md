# Migrate a project to the hosted Tesseract MCP

Any project that wired up Tesseract **before** the hosted MCP existed may be running a
**local** MCP — a stdio server (`node …/mcp/src/server.mjs`), a plugin-bundled copy, a
cloned design-system repo, or a vendored tarball. Those freeze at setup time and go
stale. The MCP is now **hosted** at `https://tesseract.tatvapractice.in/mcp` (bearer
auth) and auto-updates on every release.

**How to use:** open the other project in Claude Code and paste the block below as your
message. It detects everything first, removes only the local MCP wiring, connects the
hosted MCP, and verifies — while leaving the `@dhspl-tatvacare/tesseract-ui` component
package (which the app legitimately imports) untouched.

---

## ⤵ Paste this into the other session

```text
TASK — Migrate this project to the HOSTED Tesseract MCP and remove every local/stale copy.

Context: The Tesseract design-system MCP is now a hosted HTTP server at
https://tesseract.tatvapractice.in/mcp (bearer-token auth). Any locally-run, bundled,
cloned, or tarball Tesseract MCP is stale and must be removed. ALL AI grounding must go
through the hosted MCP so it auto-updates. Do NOT remove the component library
(@dhspl-tatvacare/tesseract-ui in node_modules / package.json) — the app imports that
and it stays.

Work in this order and DO NOT delete anything until after step 1:

1) DETECT (read-only) — search this project and my Claude config, then print exactly what
   you find:
   - `claude mcp list` — any `tesseract` server whose command is a local `node … .mjs`
     path (that's a local MCP).
   - `.mcp.json` in this repo (and any parent) with a `tesseract` entry using
     `"command"/"args"` (local stdio) rather than `"type":"http"`.
   - `~/.claude.json` — global or per-project `mcpServers` named `tesseract` with a local
     command/path.
   - Copied skill folders: any `**/.claude/skills/tesseract` directory.
   - Any local clone of the design-system repo (a folder containing
     `.claude-plugin/plugin.json` with "name": "tesseract", or `mcp/src/server.mjs`).
   - Any vendored `tesseract-ui-*.tgz` or a `package.json` dependency that points at a
     local tarball/`file:`/`github:` path instead of the registry.

2) REMOVE the local MCP wiring (after showing me step 1):
   - `claude mcp remove tesseract` if a local one is registered.
   - Delete or replace local `tesseract` entries in `.mcp.json` and `~/.claude.json`.
   - Delete copied `.claude/skills/tesseract` folders (the skill ships via the plugin now).
   - Delete a local design-system clone ONLY if it has no uncommitted unique work
     (run `git status`; if unsure, stop and ask me). It is otherwise recoverable by re-clone.
   - Keep node_modules/@dhspl-tatvacare/tesseract-ui as-is.

3) CONNECT the hosted MCP:
   claude mcp add --transport http tesseract https://tesseract.tatvapractice.in/mcp \
     --header "Authorization: Bearer c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54"
   (Or, to commit it for the team, add to `.mcp.json`:
    { "mcpServers": { "tesseract": { "type": "http",
      "url": "https://tesseract.tatvapractice.in/mcp",
      "headers": { "Authorization": "Bearer c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54" } } } } )

4) COMPONENT PACKAGE (report only, don't break the build): if the app installs the
   components from a stale vendored `.tgz` or a `file:`/pinned `github:` path instead of
   the private registry `@dhspl-tatvacare/tesseract-ui` on GitHub Packages, tell me — and
   offer to switch it to the registry. Do NOT remove the tarball unless you've wired the
   registry install first.

5) VERIFY and report:
   - `claude mcp list` shows `tesseract` as the HTTP URL, status Connected.
   - Ask yourself to "list the tesseract MCP tools" — expect 8: list_components,
     get_component, search_components, validate_usage, get_tokens, get_icons, get_rules,
     get_design.
   Summarize: what you removed, what you added, and anything you left for me to decide.
```

---

## What it does / does not touch

| Removed (stale local MCP) | Kept (still needed) |
|---|---|
| Local stdio `tesseract` MCP registrations (`claude mcp`, `.mcp.json`, `~/.claude.json`) | `@dhspl-tatvacare/tesseract-ui` component package (imported by the app) |
| Copied `.claude/skills/tesseract` folders | The hosted MCP config it just added |
| Local design-system clones used only for the MCP (if git-clean) | The private registry / `.npmrc` setup |

The **token** in the block is the shared hosted-MCP bearer token (same one in
[CONNECT-MCP.md](./CONNECT-MCP.md)). If you'd rather not paste it into a given session,
replace it with `<token>` and add the header yourself.

See also: [CONNECT-MCP.md](./CONNECT-MCP.md) (per-client config) · [../STARTER.md](../STARTER.md) (full setup).
