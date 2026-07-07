# Tesseract UI — v1.0 stability contract

Read this once before adopting. It's the promise that lets GenX and TatvaPractice
build on `tesseract-ui` without fear of future churn.

## What "v1.0" means

v1.0 is the **first stable, public version**. From here we follow [SemVer](https://semver.org):

- **Patch** (`1.0.x`) — bug/visual/a11y fixes. Always safe to take.
- **Minor** (`1.x.0`) — new components, new **optional** props, new variants. Additive only. Safe to take.
- **Major** (`2.0.0`) — the only release that may change or remove existing public API. Announced with a migration guide.

**The guarantee:** within the `1.x` line, code that works against v1.0 keeps working. We never remove a public component, rename a prop, change a default that alters the rendered result, or change an existing prop's type — those wait for a major.

## What is "public API" (covered by the contract)

- The named exports from the package root (`import { Button, Drawer } from "@dhspl-tatvacare/tesseract-ui"`).
- Their documented props (see each component's doc in [`docs/components/`](./components)) and their defaults.
- The design tokens (`--tesseract-*`) and their meaning.

## What is NOT public API (may change in any release)

- Internal files, `*.module.scss` class names, the exact DOM structure.
- Anything under `src/hooks/ui/` (overlay primitives) imported by deep path.
- Storybook stories themselves.
- The hashed CSS-module class names — style via props/tokens, never by targeting `._x_hash`.

## Rules for us (maintainers), so v1 consumers never break

1. **Add, don't change.** New behaviour ships as a new optional prop with a default that preserves the current look.
2. **Token-only.** Colours/spacing/radius/typography come from `--tesseract-*`. We never hardcode; a theme swap is a token-ramp change, zero component edits.
3. **Defaults are frozen.** Changing a default's rendered result is a breaking change.
4. **Every change is gated** by `npm run test-storybook` (render + interaction + a11y) + lint + build in CI before it merges.

## Rules for you (consumer), to stay upgrade-safe

1. Import only from the package root, never deep internal paths.
2. Configure via **props and tokens** — don't override hashed `.module.scss` classes.
3. Pin a minor range (`"@dhspl-tatvacare/tesseract-ui": "^1.0.0"`) and take patches/minors freely; review the CHANGELOG before a major.

See [../STARTER.md](../STARTER.md) to install and start using it without touching your existing components, and [CATALOG.md](./CATALOG.md) for the full component list.
