# SecondarySidebar
> A gradient secondary navigation rail (the RxPad pattern) — a fixed-width column of icon pills with an active-state indicator, collapsible between an 80px rail and a 200px labelled mode.

**Import**
```jsx
import { SecondarySidebar } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — a per-record context nav nested inside a page (e.g. a patient's Visits / Vitals / Lab Results), sitting beside the primary `Sidebar`.
**When not** — the app's top-level navigation: use `Sidebar`.

**Key props**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `items` | `[{ id, label, icon, signal?, badge?, disabled?, href?, children? }]` | `[]` | Nav model. A leaf with `href` renders a real `<a>` (SSR/routing); `children` makes an expandable section. `signal: true` shows a notification dot. |
| `activeId` | `string` | — | Id of the active item (controlled). |
| `onSelect` | `(id) => void` | — | Fired when an item is chosen. |
| `tone` | `"blue" \| "violet" \| "slate" \| "green"` | `"blue"` | Swaps rail gradient, fade, and active-icon ramp via `--tesseract-*` tokens. |
| `density` | `"comfortable" \| "compact"` | `"comfortable"` | Tightens pill/padding/label sizing (the dense option). |
| `collapsed` / `defaultCollapsed` | `boolean` | `defaultCollapsed: true` | Controlled / uncontrolled rail state (80px vs 200px). |
| `search` | `boolean` | `false` | Shows a filter input in expanded mode. |
| `footer` | `ReactNode` | — | Pinned at the bottom of the rail (above the fade). |
| `collapsedWidth` / `expandedWidth` | `number` | `80` / `200` | Rail widths in px. |

Colours and spacing come from `--tesseract-*` tokens (`tone`/`gradient` map onto the ramps) — consumers don't hardcode hex or pixels; pass `tone`, `density`, or `pillRadius` instead.

**Example**
```jsx
const items = [
  { id: "pastVisits", label: "Past Visits", icon: "clipboard-text" },
  { id: "vitals", label: "Vitals", icon: "heart-rate", signal: true },
  { id: "labResults", label: "Lab Results", icon: "lab" },
  { id: "vaccine", label: "Vaccine", icon: "injection", badge: "trial" },
];

const [active, setActive] = React.useState("vitals");

<SecondarySidebar
  items={items}
  activeId={active}
  onSelect={setActive}
  collapsed
/>
```

`badge` accepts a string shorthand (`"trial"`, `"soon"`) or a full `{ text, variant, color, sticky }` object, reusing the `Badge` atom.

**Variants**
- **Playground** — default collapsed blue rail with active state.
- **Badges + Signal Dots** — items carrying `badge` chips and `signal` dots.
- **Signal Dot (Notification)** — notification dot only.
- **Tone + Density + Footer** — violet `tone`, `compact` density, and a pinned `footer` slot.
