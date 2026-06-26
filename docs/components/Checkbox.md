# Checkbox
> A tri-state checkbox atom (checked / unchecked / indeterminate) for multi-select choices and consent, with an optional built-in label.

**Import**
```jsx
import { Checkbox } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — any number of independent selections (symptom lists, consent items), or a parent "select all" using the `indeterminate` state.
**When not** — for one-of-many use **Radio**; for an instant-apply setting with no submit use **Toggle**.

**Key props**

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `checked` | `boolean \| "indeterminate"` | — | Controlled value. `"indeterminate"` shows a dash (display-only). |
| `onCheckedChange` | `(next, event) => void` | — | Fires with the resolved next boolean. |
| `defaultChecked` | `boolean` | `false` | Uncontrolled initial value. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Box size; `sm` is the compact option. |
| `color` | `"primary" \| "success" \| "error" \| "warning"` | `"primary"` | Checked fill + border + focus ring. |
| `error` | `boolean` | `false` | Red invalid styling (independent of `color`). |
| `label` | `string \| ReactNode` | — | Built-in label beside the box; clicking it toggles. |
| `description` | `string \| ReactNode` | — | Smaller helper text below the label. |
| `labelPosition` | `"right" \| "left"` | `"right"` | Side the label sits on. |
| `disabled` / `required` / `name` / `value` | — | — | Standard form behavior; `name` adds a hidden native input. |

Colours, spacing, and focus rings all come from `--tesseract-*` tokens — never hardcode.

**Example**
```jsx
<Checkbox
  label="I consent to data sharing with treating physicians"
  description="This field is required to continue."
  checked={agreed}
  onCheckedChange={setAgreed}
  required
/>
```

**Variants**
- **Playground** — full controls (state, size, color, error, label slot).
- **Sizes** — `sm` / `md` / `lg`.
- **States** — unchecked / checked / indeterminate.
- **Colors** — primary / success / error / warning checked fills.
- **WithBuiltInLabel** — label + optional description, left/right position.
- **Error** — red invalid border + focus ring.
- **CheckboxList** / **ConsentForm** — EMR symptom selection and patient consent patterns.
- **IndeterminateGroup** — parent "select all" with mixed-state child items.
- **Disabled** / **Uncontrolled** — non-interactive and `defaultChecked` usage.
