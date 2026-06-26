# Sidebar
> Vertical app navigation rail driven by a nested `items` array — collapses to an icon rail with hover flyouts, with optional search, badges, header/footer slots, and active-state tracking.

**Import**
```jsx
import { Sidebar } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — The primary left-hand navigation for an EMR/app shell: top-level sections, nested sub-pages, and a collapsible icon rail. Pass a flat or one-level-nested `items` tree and let it manage active highlighting + open sections.
**When not** — For in-page section grouping (not navigation) use `SectionCard`; for a temporary slide-over panel use `Drawer`.

**Key props**

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `items` | `Array<{ id, label, icon, badge?, href?, children? }>` | `[]` | Nav tree. A leaf with `href` renders a real `<a>` (SSR/middle-click/prefetch); `children` make a collapsible section / hover flyout when collapsed. |
| `activeId` | `string` | — | Currently selected item id; drives highlight and auto-opens its section. |
| `onSelect` | `(id) => void` | — | Fires when any leaf is chosen. |
| `collapsed` / `defaultCollapsed` | `bool` | `false` | Controlled / uncontrolled icon-rail mode. Pair with `onCollapsedChange`. |
| `search` | `bool` | `false` | Shows a filter input in the header (`searchPlaceholder` to label it). |
| `density` | `"comfortable" \| "compact"` | `"comfortable"` | Compact tightens row spacing for dense screens. |
| `accent` | CSS color | `var(--tesseract-blue-500)` | Active/highlight colour; mid/strong steps are derived via `color-mix`. |
| `logo` / `header` / `footer` | `ReactNode` | — | Slots: brand mark (top), card under header (e.g. account), pinned footer. |
| `loading` | `bool` | `false` | Renders skeleton rows. |

> Colours, spacing, and radii all come from `--tesseract-*` tokens — set `accent` to a token, never a hardcoded hex.

**Example**
```jsx
const [active, setActive] = useState("patients");

<Sidebar
  logo={<Logo />}
  search
  activeId={active}
  onSelect={setActive}
  items={[
    { id: "dashboard", label: "Dashboard", icon: "category" },
    { id: "patients", label: "Patients", icon: "profile-2user", badge: { text: "12", color: "primary" } },
    {
      id: "clinical", label: "Clinical", icon: "health",
      children: [
        { id: "rx", label: "Prescriptions", icon: "note" },
        { id: "labs", label: "Lab Orders", icon: "flask", badge: "soon" },
      ],
    },
    { id: "billing", label: "Billing", icon: "wallet" },
  ]}
  footer={<AccountChip />}
/>
```

**Variants**
- **Playground** — all controls live.
- **Collapsed Rail** — icon-only rail; parents open as hover flyouts.
- **Expanded (Flat Items)** — single-level nav, no nesting.
- **Nested Items + Search** — collapsible sections with header filter.
- **Badges & Mixed Content** — count badges plus `"trial"` / `"soon"` presets.
- **Controlled Collapse** / **No Collapse Toggle (Locked)** — externally driven vs. fixed width.
- **With Footer** — pinned account/footer slot.
- **Custom Accent + Compact + Header** — clinic skin: custom `accent`, compact density, header slot.
- **Loading + Empty States** — skeleton rows and empty-filter message.
