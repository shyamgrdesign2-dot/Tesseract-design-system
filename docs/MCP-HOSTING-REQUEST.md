# Tesseract MCP — hosting note

**For:** Karthik / DevOps · **Date:** 2026-07-07

We have an MCP server (feeds our design-system data to AI tools like Cursor / Claude).
Right now each dev has to clone the repo to use it, so it goes stale between versions.
We want it as a hosted URL that's always up to date.

We can **co-host it inside the Storybook you already run** at `tesseract.tatvapractice.in`
— add a small Node process to that same container and let nginx serve it at
**`https://tesseract.tatvapractice.in/mcp`**. Same Azure app, same DNS, same deploy —
**nothing new to provision.** All the code changes (Dockerfile + one nginx rule + the MCP)
are on our side and ship on the existing `tesseract` deploy.

Two quick decisions from you:

1. **OK to run it in the prod container?** (adds a small Node process next to nginx —
   slightly bigger image, shares the Storybook's uptime.)
2. **Open or token-gated?** It serves the *same* data as the already-public Storybook, so
   **open** is fine (no secret). If you'd rather gate it, you set one bearer-token env var
   and we enforce it.

That's it — once you're good with the above, we build + test it and it goes live at
`…/mcp` on the next deploy.
