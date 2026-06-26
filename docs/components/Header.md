# Header
> The single configurable top app bar — back/logo/user/title on the left, a typed list of CTAs/avatars/selects on the right.

**Import**
```jsx
import { Header } from "tesseract-ui";
```

**When to use** — The page/shell top bar: home shell, RxPad, print views, patient context bars. Composes atoms (Button, Avatar, Badge, Divider) so every CTA stays consistent.
**When not** — For an in-card or section heading, use `SectionCard`; for a hero/marketing band, use `HeroBanner`.

**Key props**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `actions` | array (max 8) | `[]` | Right-cluster items. Each is typed: `cta`, `avatar`, `select`, `info`, `tutorial`, `divider`, `node`. |
| `user` | `{ name, meta, avatar?, dropdown? }` | — | Left-side patient/user block. |
| `title` / `subtitle` | node | — | Leading title (+ optional subtext). |
| `logo` | node | — | Brand mark (pass the `Logo` atom). |
| `back` / `onBack` | bool / fn | — | Shows the small back icon button; `backIcon` overrides the glyph. |
| `align` | `"left" \| "center"` | `"left"` | Center-aligned title (MD3 style). |
| `search` | `{ placeholder?, value?, onChange?, width? }` | — | First-class pill search field in the bar. |
| `density` | `"comfortable" \| "compact"` | `"comfortable"` | Compact scales controls 42px→36px + tightens padding. |
| `maxVisibleActions` | number | — | Extra actions roll into a "More" overflow menu (one line at narrow widths). |
| `sticky` / `elevation` | bool / `bool\|"always"\|"onScroll"` | `false` | Pin to top; drop shadow (static or on scroll). |
| `background` / `borderColor` | token | slate-0 / slate-100 | Surface + bottom-border overrides (token-driven). |

Colours, spacing, and control heights come from `--tesseract-*` tokens — don't hardcode hex or px in consumers; use `background`/`borderColor` token overrides instead.

**Example**
```jsx
<Header
  back onBack={goBack}
  user={{ name: "Ramesh Kumar", meta: "Male | 76y", dropdown: true }}
  actions={[
    { type: "cta", label: "Print", icon: "printer", variant: "tonal", theme: "neutral", onClick: print },
    { type: "cta", icon: "notification", badge: { color: "error" }, ariaLabel: "Alerts", onClick: openAlerts },
    { type: "divider" },
    { type: "avatar", name: "Dr Sheela", ring: true, onClick: openProfile },
  ]}
/>
```

**Variants**
- **Shell** — home bar: title + actions + avatar.
- **RxPad** — patient context bar with `user` block + dropdown.
- **Print** — minimal print-view header.
- **Title with subtext** / **Center-aligned title** — title + subtitle layouts.
- **Info Tags** — non-clickable violet data tags (ward, doctor, status).
- **Compact density** — 36px controls.
- **Search slot** — inline pill search field.
- **Action overflow (More menu)** — `maxVisibleActions` rollup.
- **Trailing slot + sticky** / **Elevate on scroll** — free-form right node, pinning, scroll shadow.
- **Playground** — all props wired as controls.
