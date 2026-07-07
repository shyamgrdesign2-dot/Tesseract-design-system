# Maintaining Tesseract — propagation & the release gate

This is the control center. Everything consumers use flows from **this repo**, and a
**preflight gate** stops any change that would break them from shipping.

## How an update reaches everyone

Three surfaces, three channels — all pull from this repo, so you control them here:

| Surface | Lives in | How consumers get the update |
|---|---|---|
| **`/tesseract` skill** | `.claude/skills/tesseract/` | The Claude Code plugin. Edit the skill → push to **`main`** → users pick it up on `claude plugin update tesseract@tesseract` (auto at startup when a marketplace + `GITHUB_TOKEN` are configured). |
| **MCP** (components, props, tokens, icons, rules, design) | `mcp/` → hosted at `tesseract.tatvapractice.in/mcp` | **Hosted = auto-latest.** Deploy the container (push **`tesseract`**) and every connected client — Claude Code, Cursor, the Connectors UI — sees the new data immediately. Nothing to update client-side. |
| **Component package** | `src/` → `@dhspl-tatvacare/tesseract-ui` | GitHub Packages / build branch. Consumers `npm update` within `1.x` (SemVer-safe). |

So: **edit the skill here → it flows to every cloud session on the plugin. Update the
components here → the hosted MCP serves them to everyone automatically.** No copies to
chase; the `docs/MIGRATE-TO-HOSTED-MCP.md` prompt brings any stale project back in line.

## The preflight gate — never ship a break

`npm run preflight` runs the internal-consistency checklist. It is enforced in **three**
places, all calling the one script (`scripts/preflight.mjs`):

- **Local** — `.githooks/pre-push` blocks `git push` until it's green. Enable once per
  clone: `npm run setup:hooks`.
- **CI** — `quality.yml` runs it on `main` / PRs.
- **Deploy** — the Azure workflow's `preflight` job **gates** `build-and-deploy`. A failing
  check means the container never builds, so prod stays on the last-good revision and
  hosted-MCP users are never served a broken update.

### What it checks
1. **MCP artifacts fresh** — manifest + both `mcp/dist` bundles rebuild to exactly what's
   committed (shipped == source; no stale hosted MCP).
2. **MCP smoke test** — all 8 tools answer from the manifest.
3. **Skill inventory fresh** — the `/tesseract` inventory is regenerated from source.
4. **Component count** — README + CATALOG match the manifest total.
5. **Per-component docs** — every component has `docs/components/<Name>.md` (aliases like
   `DatePicker` / `Menu` / `MedicalIcon` are listed exceptions).
6. **No broken doc links** — every relative `.md` link in the docs resolves.

Each failure prints the exact fix command.

## Release checklist (any change)
1. Make the change (component / token / icon / skill / doc).
2. If components/tokens/icons changed: `npm run build:mcp` (regenerates manifest + bundles).
3. Update docs: `docs/components/<Name>.md`, the count in README/CATALOG, `CHANGELOG.md`,
   `docs/UPGRADING.md`, and the skill inventory (`sync-catalog.mjs`).
4. `npm run preflight` → **green**.
5. Commit. `git push` (the hook re-runs preflight).
6. Push **`main`** (skill + docs → plugin) and **`tesseract`** (deploys the hosted MCP +
   Storybook; the deploy re-gates via preflight).
7. Bump the package version + publish only when you intend a component release
   (`publish-package.yml` on a GitHub Release).

## Fresh clone
```bash
npm ci
npm run setup:hooks   # points git at .githooks so the pre-push gate is active
```
