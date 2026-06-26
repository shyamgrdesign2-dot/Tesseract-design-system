# SegmentedControl
> A horizontal (or vertical) row of mutually-exclusive options with a sliding indicator marking the active one.

**Import**
```jsx
import { SegmentedControl } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — Switching between a small set (2–5) of views/modes that share the same space: a Queue/Finished/Cancelled filter, a List/Grid toggle, a billing-period picker.
**When not** — More than ~5 options or per-option menu content → use `Tabs`; on/off → `Switch`; a form-field choice → `Radio`.

**Key props**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `options` | `{ value, label, icon?, disabled? }[]` | `[]` | The segments. `icon` and per-option `disabled` live here, not on the root. |
| `value` / `onValueChange` | `string` / `(value, e) => void` | — | Controlled selection + change handler. |
| `defaultValue` | `string` | first option | Uncontrolled initial selection. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Segment height / text size — use `sm` for dense toolbars. |
| `variant` | `"pill" \| "block"` | `"pill"` | Rounded pill track vs squared block track. |
| `theme` | `"neutral" \| "primary" \| "success" \| "error" \| "warning"` | `"neutral"` | Indicator colour; non-neutral uses brand colour + white text. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Row vs stacked column. |
| `fullWidth` | `boolean` | `false` | Stretch segments to fill the container width. |
| `disabled` | `boolean` | `false` | Disable the whole control. |
| `radius` / `indicatorColor` | `number \| "pill" \| "sharp"` / CSS color | — | Override corner radius / indicator colour. |

All colours, spacing and radii come from `--tesseract-*` tokens — don't hardcode.

**Example**
```jsx
const [view, setView] = useState("queue");

<SegmentedControl
  size="sm"
  options={[
    { value: "queue", label: "Queue" },
    { value: "finished", label: "Finished" },
    { value: "cancelled", label: "Cancelled" },
  ]}
  value={view}
  onValueChange={setView}
/>
```

**Variants**
- Two / Three / Four Options — common option counts.
- Sizes — `sm` / `md` / `lg`.
- Variants — `pill` vs `block` track.
- Themes — neutral, primary, success, error, warning indicators.
- Orientation — horizontal vs vertical.
- Corner Radius — default / sharp / px / pill.
- Full Width — segments stretch to fill.
- With Icons — leading icon per option.
- Disabled Option — single segment disabled.
- Appointment View Switcher / Billing Period Selector — EMR usage patterns.
