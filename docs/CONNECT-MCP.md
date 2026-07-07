# Connect the Tesseract MCP

The **tesseract MCP** serves our exact components, props, design tokens, icons,
the hard rules, and the design language (`design.md`) — with a `validate_usage`
guardrail — so any AI client builds with *real* Tesseract, not invented props.

It is a **local `stdio` server bundled inside the design-system repo** (self-contained
— no `npm install`, it just needs Node). It reads local files, so **it is not a hosted
URL** — the client runs `node .../mcp/dist/server.mjs`, which means you need the repo
present (clone it, or on Claude Code the plugin auto-clones it).

---

## Before you connect (once)

1. **Repo access** — a GitHub account with access to the **private** repo
   `DHSPL-Tatvacare/tesseract-design-system`. No access? Ask the dev/ops team
   (**karthik.jangam@tatvacare.in**).
2. **Node.js 18+** installed (`node -v`).
3. **Get the files** — either use the Claude Code plugin (auto-clones, below), or clone:
   ```bash
   git clone https://github.com/DHSPL-Tatvacare/tesseract-design-system.git
   ```
   Then note the **absolute path** to `…/tesseract-design-system/mcp/dist/server.mjs`.

---

## Claude Code — the plugin (recommended, zero config)

```
/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
/plugin install tesseract@tesseract
```

That clones the repo and wires **both** the `/tesseract` skill and the MCP.
*(Manual alternative:* `claude mcp add tesseract -- node /ABS/PATH/tesseract-design-system/mcp/dist/server.mjs`.)

## Cursor

Add to **`.cursor/mcp.json`** in the project (or `~/.cursor/mcp.json` for global), then
reload MCP / restart Cursor:

```json
{
  "mcpServers": {
    "tesseract": {
      "command": "node",
      "args": ["/ABS/PATH/tesseract-design-system/mcp/dist/server.mjs"]
    }
  }
}
```

## Claude Desktop

**Settings → Developer → Edit Config** (`claude_desktop_config.json`), add the same
block, then restart Claude Desktop:

```json
{
  "mcpServers": {
    "tesseract": {
      "command": "node",
      "args": ["/ABS/PATH/tesseract-design-system/mcp/dist/server.mjs"]
    }
  }
}
```

## Any other MCP client

It's a standard **stdio** server: `command: node`, `args: [<abs path to mcp/dist/server.mjs>]`.
No env vars or tokens are needed to *run* it (only repo access to *get* it).

---

## Verify it's connected

Ask the agent: **"list the tesseract MCP tools."** You should see 8:
`list_components`, `get_component`, `search_components`, `validate_usage`,
`get_tokens`, `get_icons`, `get_rules`, `get_design`.

Or: *"use get_component to show me the LineChart props"* → real props come back.

---

## Paste-into-chat setup (let the AI do it)

Paste this into your Cursor / Claude chat and it will set the MCP up for you:

```text
Set up the "tesseract" design-system MCP for me (a local stdio MCP server).
1. Check Node 18+ is installed (node -v).
2. Clone the private repo (I have GitHub access) into my home dir:
   git clone https://github.com/DHSPL-Tatvacare/tesseract-design-system.git ~/tesseract-design-system
   (No npm install — the server is self-contained.)
3. Register the MCP as a stdio server named "tesseract" running:
   node ~/tesseract-design-system/mcp/dist/server.mjs
   - Cursor: add it to ~/.cursor/mcp.json (or ./.cursor/mcp.json) under "mcpServers".
   - Claude Code: run  claude mcp add tesseract -- node ~/tesseract-design-system/mcp/dist/server.mjs
   - Claude Desktop: add it to claude_desktop_config.json under "mcpServers".
4. Reload MCP / restart the client, then list the MCP tools to confirm — I expect:
   list_components, get_component, search_components, validate_usage, get_tokens,
   get_icons, get_rules, get_design.
If the clone fails with a permission error, tell me — I need access to
DHSPL-Tatvacare/tesseract-design-system (ask karthik.jangam@tatvacare.in).
```

---

## Keeping it fresh

The server reads the repo's files, so pull the latest to get new components/tokens:

```bash
git -C /ABS/PATH/tesseract-design-system pull
```

Claude Code plugin users: re-run `/plugin install tesseract@tesseract` to update.

> Want a **zero-clone hosted endpoint** (a remote HTTP MCP everyone points a URL at,
> no local files)? That's a separate deploy — ask the DS team and we can stand one up.
