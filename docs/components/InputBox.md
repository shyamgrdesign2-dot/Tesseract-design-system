# InputBox
> The single, comprehensive text-input atom — one field covering labels, icons, add-ons, tags, steppers, clear, validation, counters, and auto-grow.

**Import**
```jsx
import { InputBox } from "tesseract-ui";
```

**When to use** — any single-line (or auto-growing) text/number entry: search fields, form inputs, table-cell editors, phone/URL fields with affixes. **When not** — for one-time codes use [InputOTP](./InputOTP.md); for a list/menu selection use [Dropdown](./Dropdown.md).

**Key props**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Field height/density. Use `sm` for dense SaaS screens. |
| `status` | `"default" \| "success" \| "error" \| "warning"` | `"default"` | Validation state + auto trailing glyph; `error` sets `aria-invalid`. |
| `variant` | `"default" \| "seamless"` | `"default"` | `seamless` is borderless with an inset ring — for table-cell editing. |
| `surface` | `"default" \| "muted"` | `"default"` | `muted` gives a filled slate background (inline search). |
| `label` / `helperText` | `string` | — | Associated label and hint/status message (wired for screen readers). |
| `leftIcon` / `rightIcon` | `ReactNode` | — | Icons inside the field edges. |
| `leftAddon` / `rightAddon` | string · `{type:"text"\|"select"\|"button", …}` · node | — | Pinned, tokenised affix on either side ("+91", unit dropdown, CTA). |
| `allow` | `"any" \| "numeric" \| "alpha" \| "alphanumeric"` | `"any"` | Live character filter + mobile keyboard hint. |
| `clearable` / `loading` | `boolean` | `false` | Show an × to clear / a trailing spinner. |
| `counter` | `boolean` | `false` | +/- stepper buttons (pair with `type="number"`). |
| `showCount` | `boolean` | `false` | Character counter (pairs with `maxLength`). |
| `tags` / `onRemoveTag` | `Array<{label,…}>` / `(id)=>void` | — | Render removable [Chip](./Chip.md) tokens inside the field. |
| `autoGrow` / `maxHeight` | `boolean` / `number` | `false` | Render a textarea that grows with content up to `maxHeight`. |
| `radius` / `height` | `number \| "pill" \| "sharp"` / `number` | size token | Per-field corner radius / height override. |
| `readOnly` / `disabled` / `fullWidth` | `boolean` | `false` | Standard field modifiers. All native `<input>` props forward. |

Colours, spacing, radius and the status glyphs all come from `--tesseract-*` tokens — consumers never hardcode.

**Example**
```jsx
<InputBox
  label="Patient phone"
  leftAddon={{ type: "select", options: ["+91", "+1"], defaultValue: "+91", ariaLabel: "Country code" }}
  allow="numeric"
  maxLength={10}
  showCount
  placeholder="98765 43210"
  clearable
/>
```

**Variants** — sizes (sm/md/lg) · statuses (success/error/warning) · seamless (table cell) · muted search · add-ons (text/select/button, left & right) · numeric stepper · tags · auto-grow textarea · clearable · loading · unit suffix.
