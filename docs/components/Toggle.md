# Toggle
> A switch atom for an instant on/off setting that applies immediately — no Save step.

**Import**
```jsx
import { Toggle } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — a single binary preference that takes effect the moment it flips (notifications on/off, feature flags, active/inactive status).
**When not** — if the choice is submitted as part of a form, use **Checkbox**; for one-of-many, use **Radio**.

**Key props**

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `checked` | boolean | — | Controlled on/off; pair with `onCheckedChange`. |
| `onCheckedChange` | `(next, event) => void` | — | Fired with the next boolean state on toggle. |
| `defaultChecked` | boolean | `false` | Uncontrolled initial state (don't mix with `checked`). |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Switch size; `sm` is the dense option. |
| `shape` | `"rounded" \| "square"` | `"rounded"` | Pill track vs squared track/thumb. |
| `color` | `"primary" \| "success" \| "error" \| "warning"` | `"primary"` | Checked-track tone (primary = blue). |
| `label` | string \| ReactNode | — | Adjacent label; clicking it toggles. Blank = bare switch. |
| `labelPosition` | `"right" \| "left"` | `"right"` | Side the label sits on. |
| `ariaLabel` | string | — | Accessible name; required when there's no visible `label`. |
| `disabled` / `required` | boolean | — | Standard control states. |
| `name` / `value` | string | `value: "on"` | Renders a hidden checkbox for native form submission. |

**Example**
```jsx
const [smsOn, setSmsOn] = useState(true);

<Toggle
  label="SMS reminders"
  color="success"
  checked={smsOn}
  onCheckedChange={setSmsOn}
/>
```
Colours, track sizing, and spacing come from `--tesseract-*` tokens — don't hardcode hex or pixel values.

**Variants**
- **Playground** — all controls live.
- **Sizes** — sm · md · lg.
- **Shapes** — rounded pill vs squared.
- **States** — off · on · disabled (off/on).
- **Colors** — primary · success · error · warning checked tracks.
- **WithLabel / LabelPositions** — built-in label, left or right.
- **Notification Settings / Feature Toggles / Inline Toggle Pair** — EMR/clinic in-context patterns.
