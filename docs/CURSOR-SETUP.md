# Connect the Tesseract MCP in Cursor

The Tesseract MCP is **hosted** — you connect by URL, always the latest (currently
9 tools), nothing to clone. Two config styles depending on your Cursor version; the
first is preferred.

**Bearer token:** `c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54`

---

## 1 · Add the config

Create **`~/.cursor/mcp.json`** (global — all projects) or **`.cursor/mcp.json`** in a
project (that repo only).

### Recent Cursor (remote MCP with headers) — use this first
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

### Older Cursor (no `headers` support) — bridge with `mcp-remote`
If the URL form doesn't connect (older builds only spoke stdio), use the npx bridge:
```json
{
  "mcpServers": {
    "tesseract": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://tesseract.tatvapractice.in/mcp", "--header", "Authorization:${AUTH_HEADER}"],
      "env": { "AUTH_HEADER": "Bearer c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54" }
    }
  }
}
```
> The `Authorization:${AUTH_HEADER}` + `env` trick avoids an `mcp-remote` bug with spaces
> in a `--header` value. Needs Node installed.

---

## 2 · Enable it in Cursor

Open **Cursor Settings → MCP** (newer builds: **Settings → Tools & Integrations → MCP
Tools**). Cursor auto-reads the `mcp.json` — you'll see **`tesseract`** in the list.
- Toggle it **on**. A **green dot** + **"9 tools"** means it's connected.
- If it doesn't show, **restart Cursor** (or hit the refresh icon on the MCP panel).

---

## 3 · Use it in the chat (Agent)

Open the chat in **Agent** mode (⌘/Ctrl + I). The Tesseract tools are now available and
the agent calls them automatically when it's building UI. To drive it explicitly:
- *"List the tesseract MCP tools."* → expect **9**: `list_components`, `get_component`,
  `search_components`, `validate_usage`, `get_tokens`, `get_icons`, `get_rules`,
  `get_design`, `check_version`.
- *"Use the tesseract MCP: get_component for Button, then build a patient list page with
  real @dhspl-tatvacare/tesseract-ui components — validate_usage before you finalize."*
- *"Run check_version against this project's installed @dhspl-tatvacare/tesseract-ui and
  tell me if I should upgrade."*

**Rule to give the agent:** always output real `@dhspl-tatvacare/tesseract-ui` components,
grounded via the MCP (`get_component` / `validate_usage`) — never Ant Design, MUI, Tailwind,
or hand-rolled.

---

## Verify
Cursor Settings → MCP shows **tesseract** green with **9 tools**, and the agent can list
them. If it fails to connect, check: the token is exact, the machine can reach
`https://tesseract.tatvapractice.in/mcp` (it's public HTTPS), and for the bridge form that
Node/`npx` is on PATH.

*(This is only the MCP — the AI grounding. To also install the component package in an app,
see SETUP-TESSERACT.md.)*
