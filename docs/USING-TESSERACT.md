# Using Tesseract in a new project (CLI / cloud)

How to take the Tesseract design system into any other project — both the
**components** (so you can `import` them) and the **AI grounding** (so Claude
builds pages correctly): the `/tesseract` skill + the `tesseract` MCP.

There are three independent pieces. You can set up any subset.

```
┌─ AI grounding (so the assistant builds it right) ─────────────┐
│  1. /tesseract skill   → brand, principles, page intake        │
│  2. tesseract MCP       → exact components/props/icons + guard  │
├─ The actual code ─────────────────────────────────────────────┤
│  3. tesseract-ui package → import { Button } from "tesseract-ui"│
└───────────────────────────────────────────────────────────────┘
```

Paths below assume the design-system repo is at
`/Users/shyamsundar/Desktop/TP_UI_Storybook` (the GitHub repo
`DHSPL-Tatvacare/tesseract-design-system`). Adjust to wherever it lives.

---

## 1. The `/tesseract` skill (AI page-building context)

**On this machine — already done.** The skill is symlinked into `~/.claude/skills/`,
so in *any* project/session you can just type `/tesseract` (or say "use the
Tesseract design system") and Claude is grounded.

**For a new project repo, a teammate, or a cloud session** (where your global
`~/.claude` isn't present), ship the skill *inside the project* so it travels:

```bash
mkdir -p <new-project>/.claude/skills
cp -R /Users/shyamsundar/Desktop/TP_UI_Storybook/.claude/skills/tesseract \
      <new-project>/.claude/skills/tesseract
git -C <new-project> add .claude/skills/tesseract && git -C <new-project> commit -m "Add Tesseract skill"
```

Now anyone opening that repo in Claude Code (local or cloud) gets `/tesseract`.

---

## 2. The `tesseract` MCP (ground-truth components, no hallucination)

The MCP server answers only from the manifest extracted from real source, so the
assistant can `get_component`, `get_icons`, and `validate_usage` instead of
guessing. It runs over stdio from the design-system repo.

**Add it to a project (Claude Code CLI):**

```bash
# from inside the project you're working in:
claude mcp add tesseract -- node /Users/shyamsundar/Desktop/TP_UI_Storybook/mcp/src/server.mjs
```

**Or commit it to the project** as `.mcp.json` (so the team/cloud gets it):

```jsonc
{
  "mcpServers": {
    "tesseract": {
      "command": "node",
      "args": ["/Users/shyamsundar/Desktop/TP_UI_Storybook/mcp/src/server.mjs"]
    }
  }
}
```

> One-time, in the DS repo: `cd mcp && npm install` (already done here).
> When the design system changes, refresh: `node mcp/scripts/build-manifest.mjs`.
> To always serve a fresh manifest, use `"command": "npm", "args": ["--prefix",
> "/Users/shyamsundar/Desktop/TP_UI_Storybook/mcp", "start"]` instead.

Verify the tools are live: `claude mcp list` (or ask Claude to "list Tesseract components").

---

## 3. The `tesseract-ui` package (so you can import components)

The package is **private** (org `DHSPL-Tatvacare`), React `>=18`, ships a prebuilt
bundle (`dist/`) — so a consuming app never deals with the SCSS/aliases. It is
**never published to public npm.** Access is gated by who can access this repo.

### ✅ Internal install — Git + `build` branch (the chosen method)

A GitHub Action (`.github/workflows/build-dist.yml`) builds the library on every
push to `main` and commits the prebuilt `dist/` to a **`build`** branch. Consumers
install straight from the private repo — no registry, no publish, no public npm.
Only someone with **access to this repo** can install it.

In **Pm-Doctor-Portal** `package.json`:
```jsonc
{
  "dependencies": {
    "tesseract-ui": "github:DHSPL-Tatvacare/tesseract-design-system#build"
  }
}
```
then `npm install`. (Or one-shot: `npm i github:DHSPL-Tatvacare/tesseract-design-system#build`.)

- The installing machine just needs **Git access to the repo** (SSH key or a
  GitHub token) — exactly the gate you want. In CI, add a deploy key or a PAT with
  repo read.
- Because `dist/` is prebuilt on the `build` branch and there's **no `prepare`
  script**, the install is lightweight — it does **not** build or pull our dev
  tools (Storybook/Playwright) into Pm-Doctor-Portal.
- To pin a version, install from a tag instead of `#build` once you start tagging
  releases (e.g. `#v0.1.0`).
- After this is set up, the `build` branch refreshes automatically on every merge
  to `main`. To pull updates in Pm-Doctor-Portal: `npm update tesseract-ui` (or
  re-`npm install`).

> CRA note: react-scripts 5 (webpack 5) resolves the package `exports`, so
> `import "tesseract-ui/styles.css"` works. If a tool ever can't resolve the
> subpath, fall back to `import "tesseract-ui/dist/tesseract-ui.css"`.

We deliberately do **not** use public npm (it would make the package public) or
GitHub Packages (a private registry, but it needs per-consumer tokens and a
publish step). The `build`-branch git install above keeps everything gated by
this private repo's access — that's the whole point. For a quick local trial
without touching a consumer repo, `npm run build:lib && npm pack` produces a
`.tgz` you can `npm install <path>`.

---

## 4. Use it in code (any install path)

```jsx
// main.jsx / app root — once:
import "tesseract-ui/styles.css";                 // the whole token + style layer
import { TesseractThemeProvider } from "tesseract-ui";

createRoot(el).render(
  <TesseractThemeProvider colorScheme="light">
    <App />
  </TesseractThemeProvider>
);
```

```jsx
// anywhere:
import { Button, DataTable, Badge, TPIcon } from "tesseract-ui";

<Button variant="solid" theme="primary" leftIcon={<TPIcon name="add" size={16} />}>
  Add Patient
</Button>
```

Also:
- **Fonts** — load Inter (body) + Mulish (headings), e.g. Google Fonts `<link>` (see README).
- **Icons** — come from the CDN automatically; nothing to host. To self-host,
  `setIconBaseUrl("/tp-icons")` once at startup.
- **Theming** — override via `TesseractThemeProvider` props; never edit tokens.

> If you used a scoped name (Option A), import from `@dhspl-tatvacare/tesseract-ui`
> instead of `tesseract-ui`. The `/tesseract` skill auto-detects the right path.

---

## 5. End-to-end: a brand-new project, start to page

```bash
# 1. scaffold your app (Vite/Next/CRA — any React 18+ app)
npm create vite@latest my-emr -- --template react && cd my-emr

# 2. components
npm install /Users/shyamsundar/Desktop/TP_UI_Storybook/tesseract-ui-0.1.0.tgz react react-dom   # (Option B)

# 3. AI grounding
cp -R /Users/shyamsundar/Desktop/TP_UI_Storybook/.claude/skills/tesseract .claude/skills/tesseract
claude mcp add tesseract -- node /Users/shyamsundar/Desktop/TP_UI_Storybook/mcp/src/server.mjs

# 4. build a page — in Claude Code:
#    "/tesseract — build me an All Patients list page"
#    → the skill runs intake, the MCP validates every component/prop, output is real tesseract-ui code.
```

That's the whole loop: **skill** decides the page architecture with you, the
**MCP** guarantees every component/prop/icon is real, and the **package** makes
the generated `import`s resolve.
