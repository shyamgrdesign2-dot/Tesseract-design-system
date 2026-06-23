# Tesseract Design System (`tesseract-ui`)

The **Tesseract** design system — a first-party React component library (atoms +
molecules) built with **zero runtime dependencies**. The only externals are
`react` and `react-dom`, declared as **peer dependencies** (never bundled).

Tokens are namespaced `--tesseract-*` so Tesseract can be adopted gradually and
run **side by side** with any existing UI library without collisions.

## Install

```bash
npm install tesseract-ui
# peers (if not already in your app)
npm install react react-dom
```

## Usage

```jsx
import { Button, Badge, Dropdown, DataTable, ClinicalTable, Logo } from "tesseract-ui";
import "tesseract-ui/styles.css"; // one stylesheet for the whole library

export function Example() {
 return <Button variant="solid" theme="primary">Save</Button>;
}
```

- **ESM + CJS**: `import` resolves to `dist/tesseract-ui.js`, `require` to `dist/tesseract-ui.cjs`.
- **Types**: `dist/index.d.ts` ships with the package.
- **Styles**: import `tesseract-ui/styles.css` once at your app root.

## What's inside

- **Atoms**: Button, Badge, Chip, Checkbox, Radio, Toggle, Slider, InputBox,
 Avatar, Divider, Skeleton, LoadingIndicator, AnimatedGrid, Logo, icon components.
- **Molecules**: Dropdown, DataTable, ClinicalTable, Filter, Accordion, Tabs,
 Tooltip, Toast, ConfirmDialog, DateRangePicker, HeroBanner, Sidebar,
 SecondaryNav, Header.

## Static assets (important)

A few components load SVGs at runtime rather than bundling them:

- **Icons** (`TPLibraryIcon`, `TPMedicalIcon`) load from the design-system **CDN**
 by default, `https://pmdoctorportal.tatvacare.in/design-system-assets/icons/<style>/<name>.svg`
 (style = `linear` | `bulk` | `bold`). No hosting needed. To self-host, point the
 base elsewhere once at app start:

 ```js
 import { setIconBaseUrl } from "tesseract-ui";
 setIconBaseUrl("/design-system-assets/icons"); // or any base; or via TesseractThemeProvider iconBaseUrl
 ```

- **`Logo`** still fetches `/brand/*.svg`, copy `public/brand/` into your app's
 web root (tiny, ~20 KB).

All other components, Button, Badge, Dropdown, DataTable, ClinicalTable, etc., use inline SVGs and need no extra assets.

## Design tokens & fonts

`tesseract-ui/styles.css` includes the full foundational token layer as CSS variables, colours (`--tesseract-blue-500`…), typography scale, radius (`--tesseract-radius-10`), shadows
(`--tesseract-shadow-md`), spacing (`--tesseract-space-4`), sizing, and gradients, plus
ready-to-use type classes (`.tp-h1`, `.tp-body-base`, …). Components consume
these tokens, and you can use them in your own styles. Browse them under
**Design System → Foundations** in Storybook.

Fonts: the type tokens reference **Inter** (body/UI) and **Mulish** (headings).
Load them in your app (Google Fonts or self-host), e.g.:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Mulish:wght@600;700;800&display=swap" rel="stylesheet" />
```

## Theming

`TesseractThemeProvider` is the single theming surface, it carries the whole theme
(foundation tokens, component tokens, breakpoints, colour scheme), provides it via
context, and scopes the matching CSS variables so components re-theme with no prop
changes (they read `var(--tesseract-*)`):

```jsx
import { TesseractThemeProvider, useTheme, useBreakpoint, useComponentTokens } from "tesseract-ui";

<TesseractThemeProvider
 colorScheme="dark" // light | dark | system
 theme={{
 foundation: { colors: { blue: { 500: "#0EA5E9" } } },
 components: { button: { radius: "14px" } },
 breakpoints: { tablet: 720 },
 }}
>
 <App />
</TesseractThemeProvider>

const { theme, colorScheme, setColorScheme } = useTheme();
const bp = useBreakpoint(); // "mobile" | "tablet" | "desktop"
const btn = useComponentTokens("button"); // { radius, height, … }
```

Providers nest (a region layers its own overrides). See **Foundations → Theme
Provider** in Storybook for a live playground.

## Peer dependencies

`react >= 18`, `react-dom >= 18` (uses `useId`, `createPortal`).

## Build (maintainers)

```bash
npm run build:lib # vite lib build (ESM+CJS+CSS) + d.ts via tsc
```
