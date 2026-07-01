# Upgrading Tesseract UI — `1.0.2` → `1.0.3`

`@dhspl-tatvacare/tesseract-ui@1.0.3` is a **backward-compatible** release (one small
behavioural note below). Consuming apps upgrade by bumping **one** dependency line,
reinstalling, and rebuilding — every component in the library moves to the new code
as a unit.

> Publishing a version does **not** change any already-deployed app. A built app has
> the component code bundled in. Each microservice must reinstall + rebuild to pick up
> `1.0.3`.

---

## What changed in 1.0.3

- **HeroBanner — premium surface redesign.** The dark surface is now a layered,
  token-only "shiny" gradient (diagonal sheen + soft highlight pools + a near-black
  field), with an animated WebGL **light-ray** glow and a fine **film-grain** texture.
- **HeroBanner — back navigation.** The back control is now a bare `arrow-left3`
  (outline / straight) icon, vertically centred on the title — no button shell.
- **HeroBanner — tones reduced to `violet` + `blue`.** ⚠️ **`slate` and `dark` were
  removed.** If you passed `tone="slate"` or `tone="dark"`, it now falls back to
  `violet`. Switch those usages to `tone="violet"` or `tone="blue"`.
- **New `LightRays` atom** exported from the package (self-contained WebGL, zero deps).
- **Foundations → Colors** gains a **Surface gradients** doc (violet · blue) with a
  film-grain toggle, backed by a shared `surfaceGradients` source of truth.

No public prop was renamed or removed on any component other than the two HeroBanner
tone values above.

---

## Prerequisite — registry auth (unchanged from 1.0.2)

You already install `@dhspl-tatvacare/*` from GitHub Packages, so this is set up. For
reference, each consuming repo needs an `.npmrc` (do **not** commit tokens):

```ini
@dhspl-tatvacare:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

`GITHUB_TOKEN` (or a PAT) needs the **`read:packages`** scope.

---

## Human upgrade steps (per microservice)

1. **Bump the dependency** in the app's `package.json`:
   ```jsonc
   "dependencies": {
     "@dhspl-tatvacare/tesseract-ui": "^1.0.3"
   }
   ```
   — or run:
   ```bash
   npm install @dhspl-tatvacare/tesseract-ui@1.0.3
   ```
   (If it was already `^1.0.2`, a plain `npm update @dhspl-tatvacare/tesseract-ui`
   pulls `1.0.3` automatically.)

2. **Reinstall** so the lockfile updates:
   ```bash
   npm install
   ```

3. **Migrate removed tones (only if used).** Search for HeroBanner using the removed
   tones and switch to `violet`/`blue`:
   ```bash
   grep -rns 'tone="slate"\|tone="dark"\|tone={.*slate.*}\|tone={.*dark.*}' src
   ```

4. **Rebuild & redeploy** the microservice (whatever your build is — `npm run build`,
   Docker image, etc.). The new HeroBanner surface ships when the app is rebuilt.

5. **Verify** the violet HeroBanner shows the new layered gradient + soft light + grain.

### Rollback

Pin back to the previous version and reinstall:
```bash
npm install @dhspl-tatvacare/tesseract-ui@1.0.2
```

---

## Agent instruction (paste into a coding agent in each microservice repo)

Copy the block below into your AI coding agent, once per microservice. It is
self-contained — it assumes no prior context.

```text
TASK: Upgrade the Tesseract UI design system from 1.0.2 to 1.0.3 in this repository.

CONTEXT:
- This app depends on "@dhspl-tatvacare/tesseract-ui" (installed from GitHub Packages).
- 1.0.3 is backward compatible EXCEPT: the <HeroBanner> `tone` prop no longer supports
  "slate" or "dark" — only "violet" and "blue". Any "slate"/"dark" now falls back to
  "violet", so migrate them explicitly.
- 1.0.3 ships a premium HeroBanner surface (layered gradient + animated light rays +
  film grain) and a bare back-nav icon. These are visual-only; no API change beyond
  the tone note above.

STEPS:
1. In package.json, set:
     "@dhspl-tatvacare/tesseract-ui": "^1.0.3"
   Then run: npm install
   (Confirm package-lock.json now resolves tesseract-ui@1.0.3.)
2. Find every HeroBanner usage and migrate removed tones:
     grep -rns 'HeroBanner' src
     grep -rns 'tone="slate"\|tone="dark"' src
   Replace tone="slate" and tone="dark" with tone="violet" (or tone="blue" if the
   screen is a primary/blue context). Leave tone="violet"/tone="blue" untouched.
3. Do NOT change any other Tesseract component props — no other API changed.
4. Rebuild the app (use this repo's build script, e.g. `npm run build`) and fix any
   type/build errors that reference tesseract-ui.
5. If the app has a dev server / Storybook / preview, open the screens that use
   <HeroBanner> and confirm the violet banner renders the new layered surface (soft
   light glow from the upper area + subtle grain), and the back arrow is a bare icon.
6. Report: the resolved tesseract-ui version, every file where a tone was migrated,
   and the build result (pass/fail with errors).

CONSTRAINTS:
- Only touch dependency version + HeroBanner tone migrations + resulting build fixes.
- Do not publish, deploy, or push. Leave that to the human.
```

---

## Why 1.0.3 (not a re-published 1.0.2)

Registry versions are immutable. Re-publishing `1.0.2` with new code would break
`npm ci` (lockfile integrity-hash mismatch), cause install failures during the swap,
and make one version number mean two different code snapshots. `1.0.3` keeps every
version reproducible; consumers upgrade with a one-line bump (or automatically with a
`^1.0.2` range). See [`USING-TESSERACT.md`](./USING-TESSERACT.md) for install basics.
