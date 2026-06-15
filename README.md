# tp-ui

TatvaPractice UI — an in-house React component library (atoms + molecules) built
with **zero runtime dependencies**. The only externals are `react` and
`react-dom`, declared as **peer dependencies** (never bundled).

## Install

```bash
npm install tp-ui
# peers (if not already in your app)
npm install react react-dom
```

## Usage

```jsx
import { Button, Badge, Dropdown, DataTable, ClinicalTable, Logo } from "tp-ui";
import "tp-ui/styles.css"; // one stylesheet for the whole library

export function Example() {
  return <Button variant="solid" theme="primary">Save</Button>;
}
```

- **ESM + CJS**: `import` resolves to `dist/tp-ui.js`, `require` to `dist/tp-ui.cjs`.
- **Types**: `dist/index.d.ts` ships with the package.
- **Styles**: import `tp-ui/styles.css` once at your app root.

## What's inside

- **Atoms**: Button, Badge, Chip, Checkbox, Radio, Toggle, Slider, InputBox,
  Avatar, Divider, Skeleton, LoadingIndicator, AnimatedGrid, Logo, icon components.
- **Molecules**: Dropdown, DataTable, ClinicalTable, Filter, Accordion, Tabs,
  Tooltip, Toast, ConfirmDialog, DateRangePicker, HeroBanner, Sidebar,
  SecondaryNav, Header.

## Static assets (important)

A few components load SVGs at runtime from **absolute URLs** rather than bundling
them, so those assets must be served from your app's web root:

| Component | Expects to fetch |
|---|---|
| `Logo` | `/brand/*.svg` |
| `MedicalIcon` (`TPMedicalIcon`) | `/icons/medical/*.svg` |
| `TPLibraryIcon` | `/tp-icons/<style>/<name>.svg` (the full ~25k-icon set) |

These are **not** included in the npm package (the icon set alone is ~100 MB).
To use those components, copy the asset folders into your app's `public/`
directory (so they resolve at `/brand`, `/icons`, `/tp-icons`). All other
components — Button, Badge, Dropdown, DataTable, ClinicalTable, etc. — work with
no extra assets (they use inline SVGs).

## Peer dependencies

`react >= 18`, `react-dom >= 18` (uses `useId`, `createPortal`).

## Build (maintainers)

```bash
npm run build:lib   # vite lib build (ESM+CJS+CSS) + d.ts via tsc
```
