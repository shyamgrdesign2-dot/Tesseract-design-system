# Badge
> A small, non-interactive status pill — a label, count, or dot that annotates another element.

**Import**
```jsx
import { Badge } from "tesseract-ui";
```

**When to use** — a read-only state tag (`Confirmed`, `Critical`), a notification count on a nav item, or a dot indicator. Pair `color` with meaning (`success` / `warning` / `error` / `neutral`).
**When not** — if it can be toggled, selected, or dismissed use **Chip**; for a clickable action use **Button**.

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `variant` | `"solid" \| "soft" \| "outline" \| "gradient" \| "dot"` | `"soft"` | Visual treatment. `gradient` = white text on a colour ramp; `dot` drops the label. |
| `color` | `"primary" \| "success" \| "warning" \| "error" \| "neutral" \| "violet"` | `"primary"` | Semantic tone — map to meaning. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Density of the pill (`xs` also supported in stories). |
| `children` | `ReactNode` | — | The label, usually data-bound. Omit for an icon-only badge. |
| `icon` | `ReactNode` | — | Leading icon node; inherits badge colour via `currentColor`. |
| `rightIcon` | `ReactNode` | — | Trailing icon node. |
| `sticky` | `"left" \| "right"` | — | Squares the corners on that edge so the badge sits flush against a container edge. |
| `radius` | `number \| string` | pill | Override corner radius (`0` = sharp, large = pill). |

Colours, spacing, and radius all resolve from `--tesseract-*` tokens — don't hardcode hex or px in consumers.

**Example**
```jsx
<Badge variant="soft" color="success" icon={<TPIcon name="tick-circle" size={14} />}>
  Confirmed
</Badge>
```

**Variants**
- **Variants** — solid · soft · outline · gradient · dot.
- **Colors / Matrix** — the six semantic tones across solid/soft/outline.
- **WithIcons** — leading / trailing icons that tint to the badge colour.
- **Sizes** — xs → lg density steps.
- **Counts** — numeric badges (`1`, `12`, `99+`).
- **Sticky** — pill flush against a nav item or card edge.
- **Dot** — label-less status dot.
- **🏥 Patient Status Badges / 🔔 Notification Counts** — EMR in-context usage.
