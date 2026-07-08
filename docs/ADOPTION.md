# Adopting Tesseract in an existing / mixed-stack app

Rolling Tesseract into an app that already runs **Ant Design, Material, or its own
styles** — one feature at a time? This guide keeps Tesseract **contained** so it
never fights the host, and keeps your overrides **upgrade-safe**.

> Pure-Tesseract apps (Tesseract is the *only* design system, end-to-end) don't need
> any of this — use the defaults; Tesseract owns the page as intended.

---

## 1 · Install from the registry (not a vendored tarball)

Consume the real, versioned package so builds are reproducible and integrity-checked
via your lockfile:

```bash
npm install @dhspl-tatvacare/tesseract-ui@1.0.6
```

It's **public on npm** — no token or `.npmrc` needed. Avoid `file:vendor/*.tgz`: no
integrity pin, no clean upgrade path.

## 2 · Contain the theme — `rootTheme={false}`

By default the outermost provider "owns the page": it stamps the theme onto `<html>`
so base typography and portals inherit it. In a **mixed app that's wrong** — it would
apply Tesseract's font/colour to your AntD/Material screens. Turn it off:

```jsx
import { TesseractThemeProvider } from "@dhspl-tatvacare/tesseract-ui";

// Wrap ONLY your Tesseract feature, and opt out of owning the host root:
<TesseractThemeProvider rootTheme={false}>
  <YourTesseractFeature />
</TesseractThemeProvider>
```

`rootTheme={false}` still exposes the CSS variables on `<html>` (so Dropdown / Tooltip /
Dialog menus that portal to `document.body` resolve their tokens and dark values), but
**does not** apply Tesseract's base typography or `color-scheme` to the host document.
No leak into your non-Tesseract screens.

> The package's `styles.css` also ships two universal rules — `*{box-sizing:border-box}`
> and `body{margin:0}` — the same standard reset Ant Design and Material already apply.
> They're benign in practice; the CSS **variables** on `:root`/`<html>` are inert (they
> only take effect where `var(--tesseract-*)` is referenced).

## 3 · Style against the **stable contract**, never hashed classes

Component class names are hashed CSS-Module names (`_root_1f6gy…`) and **will change on
any rebuild** — do not target them. Every component exposes stable, documented
**`data-*` hooks** and reads **`--tesseract-*` tokens**. Target those instead:

```css
/* ❌ brittle — breaks on the next design-system release */
[class*="_root_1f6gy"] { … }

/* ✅ stable public contract */
[data-variant="solid"] { … }
[data-size="lg"]       { … }
[data-tone="danger"]   { … }
```

Stable hooks include: `data-variant`, `data-size`, `data-theme`, `data-color`,
`data-status`, `data-surface`, `data-tone`, `data-align`, `data-density`, `data-open`,
`data-selected`, `data-active`, `data-disabled`, `data-orientation`, `data-tp-theme`.
For colours/spacing/radii, read the tokens (`var(--tesseract-blue-500)` etc.) — never
hardcode. If you find yourself needing a hashed class, ask the DS team to expose a hook.

## 4 · Point icons at an env base (+ a fallback)

Icons are CDN-served. Set the base once for your environment, and self-host as a
fallback so a CDN/domain issue doesn't blank your icons:

```js
import { setIconBaseUrl } from "@dhspl-tatvacare/tesseract-ui";

setIconBaseUrl(process.env.REACT_APP_TP_ICON_BASE); // e.g. your own /tp-icons mirror
```

Verify icon render under poor-network / blocked-CDN in your UAT checklist.

## 5 · UAT checklist (mixed app)

- Import `styles.css`, then confirm **no typography/colour drift** on your non-Tesseract
  screens (with `rootTheme={false}`).
- Tesseract portals (Dropdown/Tooltip/Dialog) render themed inside your feature.
- Icons render on poor network / blocked-CDN (env base + fallback).
- No overrides target `[class*="_…"]` hashed classes.
- Lighthouse before/after on a route that includes Tesseract.

---

That's the whole containment story: **install from the registry, `rootTheme={false}`,
target `data-*` + tokens, env icon base.** Nothing here changes behaviour for a
pure-Tesseract app.
