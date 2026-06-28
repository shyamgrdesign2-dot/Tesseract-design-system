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
│  3. tesseract-ui package → import { Button } from "@dhspl-tatvacare/tesseract-ui"│
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

### ✅ Primary install — GitHub Packages (private npm registry)

The library is published as a real, **versioned** npm package to the org's private
GitHub Packages registry: **`@dhspl-tatvacare/tesseract-ui`**. This is the chosen
method because published versions are **immutable** (a release can never change
under a consumer), semver ranges work (`^1.0.0` → safe patches), and it scales
cleanly to any number of apps. Access is gated by **org membership** + a token.

**One-time consumer setup** — add an `.npmrc` to the app's repo root (template in
the DS repo's [`.npmrc.example`](../.npmrc.example)):
```ini
@dhspl-tatvacare:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```
Then expose a GitHub token with **`read:packages`** as `GITHUB_TOKEN` (in your
shell profile locally; as a CI secret in pipelines). Never paste the token into the
file — the `${GITHUB_TOKEN}` reference keeps it out of git.

**Install:**
```bash
npm install @dhspl-tatvacare/tesseract-ui
```
In `package.json` this lands as `"@dhspl-tatvacare/tesseract-ui": "^1.0.0"`. Pull
updates with `npm update @dhspl-tatvacare/tesseract-ui` — you get patches/minors
automatically and never a breaking change within `1.x` (see [PREREQUISITE.md](./PREREQUISITE.md)).

**How a new version ships:** a maintainer cuts a GitHub Release (e.g. `v1.0.2`);
`.github/workflows/publish-package.yml` then builds with Vite and publishes that
version to the registry using the repo's built-in `GITHUB_TOKEN` (no PAT needed on
our side). Immutable, one version per release.

### Fallback — Git tag install (no token needed)

For a quick spike, or a machine where you'd rather not set up the registry token,
you can still install the prebuilt bundle straight from the repo by tag (gated by
git access alone):
```jsonc
{ "dependencies": { "@dhspl-tatvacare/tesseract-ui": "github:DHSPL-Tatvacare/tesseract-design-system#v1.0.2" } }
```
A GitHub Action keeps a `build` branch with the prebuilt `dist/` up to date, so
`#build` (always-latest) and `#v1.0.2` (pinned) both work. Prefer the registry for
real consumers — a pinned tag/`#build` doesn't give true semver ranges.

For a fully local trial, `npm run build:lib && npm pack` produces a `.tgz` you can
`npm install <path>`.

---

## 4. Use it in code (any install path)

```jsx
// main.jsx / app root — once:
import "@dhspl-tatvacare/tesseract-ui/styles.css";                 // the whole token + style layer
import { TesseractThemeProvider } from "@dhspl-tatvacare/tesseract-ui";

createRoot(el).render(
  <TesseractThemeProvider colorScheme="light">
    <App />
  </TesseractThemeProvider>
);
```

```jsx
// anywhere:
import { Button, DataTable, Badge, TPIcon } from "@dhspl-tatvacare/tesseract-ui";

<Button variant="solid" theme="primary" leftIcon={<TPIcon name="add" size={16} />}>
  Add Patient
</Button>
```

Also:
- **Fonts** — load Inter (body) + Mulish (headings), e.g. Google Fonts `<link>` (see README).
- **Icons** — come from the CDN automatically; nothing to host. To self-host,
  `setIconBaseUrl("/tp-icons")` once at startup.
- **Theming** — override via `TesseractThemeProvider` props; never edit tokens.

> The package is scoped: always import from `@dhspl-tatvacare/tesseract-ui`. The
> `/tesseract` skill and the MCP know the correct path.

---

## 5. End-to-end: a brand-new project, start to page

```bash
# 1. scaffold your app (Vite/Next/CRA — any React 18+ app)
npm create vite@latest my-emr -- --template react && cd my-emr

# 2. components
npm install /Users/shyamsundar/Desktop/TP_UI_Storybook/dhspl-tatvacare-tesseract-ui-1.0.2.tgz react react-dom   # (Option B — from `npm pack`)

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
