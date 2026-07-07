# Connect the Tesseract MCP

The **tesseract MCP** feeds your AI tool our *exact* components, props, tokens, icons,
rules, and the design language (`design.md`) — with a `validate_usage` guardrail — so it
builds with **real** Tesseract, not invented props.

It's **hosted** — connect by URL, always the latest, nothing to clone.

- **URL:** `https://tesseract.tatvapractice.in/mcp`
- **Auth:** a bearer token — included in the configs below. It's a shared secret; if it
  leaks, the DS team rotates it on the Container App and reshares.

---

## Cursor
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

## Claude Code
```
claude mcp add --transport http tesseract https://tesseract.tatvapractice.in/mcp \
  --header "Authorization: Bearer c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54"
```

## Claude Desktop
Settings → **Connectors** → add a custom **HTTP** connector: the URL above, with a header
`Authorization: Bearer c5713ed5ca2e4fc0527e6b19e5ecbb81710554a2dd9b5068f4fea8d4fb3a9f54`.

---

## Verify
Ask your agent: **"list the tesseract MCP tools."** You should see 8:
`list_components`, `get_component`, `search_components`, `validate_usage`, `get_tokens`,
`get_icons`, `get_rules`, `get_design`.

## Want it local, or need the `/tesseract` skill?
Install the Claude Code plugin (ships the page-building **`/tesseract`** skill + a local
stdio MCP; needs access to the private repo):
```
/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
/plugin install tesseract@tesseract
```
