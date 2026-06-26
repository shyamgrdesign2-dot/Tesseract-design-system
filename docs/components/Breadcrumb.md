# Breadcrumb
> Data-driven wayfinding for deep, hierarchical navigation — the path to the current resource (Patients › Ramesh Kumar › Visit).

**Import**
```jsx
import { Breadcrumb } from "tesseract-ui";
```

**When to use** — deep EMR drill-downs where the user needs the trail back (patient → encounter → result). Pair it with a page Header/HeroBanner.
**When not** — switching between sibling views is **Tabs**; primary app navigation is **Sidebar**.

**Key props**

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `items` | `[{ label, href?, onClick?, icon? }]` | `[]` | The trail. Last item = current page (text + `aria-current`); earlier items become `<a>` when `href`, `<button>` when only `onClick`, else plain text. |
| `separator` | icon name `string` \| node | `"arrow-right3"` | Glyph between crumbs. |
| `maxItems` | `number` | — | Collapse the middle to a hover-titled "…" once the trail exceeds this (keeps first + last two). |
| `size` | `"sm"` \| `"md"` | `"md"` | Density — use `sm` for compact toolbars/headers. |
| `className`, `...rest` | — | — | Spread onto the `<nav>`. |

Colours, spacing, and the separator glyph all come from `--tesseract-*` tokens — don't hardcode.

**Example**
```jsx
<Breadcrumb
  maxItems={3}
  items={[
    { label: "Patients", href: "/patients", icon: "profile-2user" },
    { label: "Ramesh Kumar", href: "/patients/123" },
    { label: "Encounters", href: "/patients/123/encounters" },
    { label: "Visit — 24 Jun 2026" }, // current page (no href)
  ]}
/>
```

**Variants**
- **Basic** — simple two-level path (Dashboard › Appointments).
- **WithIcons** — leading `icon` per crumb (home, billing).
- **Collapsed** — long trail folds the middle behind a hover-titled "…" via `maxItems`.
- **Playground** — all props live (separator, size, maxItems).
