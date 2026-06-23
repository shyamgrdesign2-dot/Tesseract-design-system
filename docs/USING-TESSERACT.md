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

Pick ONE install path. The package is **private** (org `DHSPL-Tatvacare`), React
`>=18`, ships a prebuilt bundle (`dist/`) — so a consuming app never deals with
the SCSS/aliases.

### Option A — GitHub Packages (recommended for real use)

One-time in the **DS repo** (publishing is your call to run — it's outward-facing):
1. Scope the name for GitHub Packages — set in `package.json`:
   `"name": "@dhspl-tatvacare/tesseract-ui"`, and add
   `"publishConfig": { "registry": "https://npm.pkg.github.com" }`.
2. Build + publish: `npm run build:lib && npm publish`
   (or via a GitHub Actions workflow on tag).

In the **consuming project**:
```bash
# .npmrc in the project root:
echo "@dhspl-tatvacare:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}" >> .npmrc
# then:
npm install @dhspl-tatvacare/tesseract-ui react react-dom
```
(`GITHUB_TOKEN` = a PAT with `read:packages`; in CI use the provided token.)

### Option B — Tarball (fastest, no registry — great to trial)

```bash
# in the DS repo:
npm run build:lib && npm pack          # → tesseract-ui-0.1.0.tgz
# in the consuming project:
npm install /Users/shyamsundar/Desktop/TP_UI_Storybook/tesseract-ui-0.1.0.tgz react react-dom
```

### Option C — Install straight from GitHub

Needs a one-time tweak in the DS repo (because `dist/` isn't committed): add
`"prepare": "npm run build:lib"` to `scripts` in `package.json`. Then:
```bash
npm install git+https://github.com/DHSPL-Tatvacare/tesseract-design-system.git react react-dom
```

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
