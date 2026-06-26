# Tesseract UI — documentation (v1.0)

The `tesseract-ui` design system: 40 token-driven React components (atoms + molecules)
for GenX and TatvaPractice.

## Start here

1. **[CATALOG.md](./CATALOG.md)** — every component, grouped, with a one-line description and a link to its usage doc.
2. **[USING-TESSERACT.md](./USING-TESSERACT.md)** — install the package, the `/tesseract` skill, and the MCP; set up the theme provider; use it in code.
3. **[PREREQUISITE.md](./PREREQUISITE.md)** — the v1.0 stability contract (SemVer, what's public API, how to stay upgrade-safe). Read before adopting.
4. **[ICONS.md](./ICONS.md)** — the icon system (`TPIcon` / `TPLibraryIcon`, families, self-hosting).

## Per-component docs

One concise usage doc per component lives in **[`components/`](./components)** — import, when-to-use, key props, a realistic example, and the notable variants.

## Quick install (GenX / TatvaPractice)

```jsonc
// package.json — installs the prebuilt bundle from the private repo, gated by repo access
{ "dependencies": { "tesseract-ui": "github:DHSPL-Tatvacare/tesseract-design-system#v1.0.0" } }
```

```jsx
// app root, once:
import "tesseract-ui/styles.css";
import { TesseractThemeProvider } from "tesseract-ui";
// then import any component from "tesseract-ui".
```

Adopting alongside an existing UI? Importing Tesseract components does not touch your
current ones — styles are scoped CSS-module classes under `--tesseract-*` tokens, so
there's no global bleed. See USING-TESSERACT.md for the safe-coexistence details.

## Explore interactively

```bash
npm run storybook   # every component, every variant, with live controls
```
