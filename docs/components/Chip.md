# Chip
> An interactive pill for selectable, removable, or filter tokens.

**Import**
```jsx
import { Chip } from "tesseract-ui";
```

**When to use** — toggleable choices (symptom picker), active filter tokens with a dismiss ×, or input tags. Wire `onClick` to select and `onDelete` to remove.
**When not** — for a read-only status label use **Badge**; for a primary action use **Button**.

**Key props**

| prop | type | default | what it does |
|---|---|---|---|
| `label` | ReactNode | — | Chip text/content |
| `variant` | `"solid"` \| `"soft"` \| `"outline"` | `"soft"` | Fill style (aliases: `filled`→soft, `outlined`→outline) |
| `color` | `"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"error"` | `"default"` | Accent ramp (all from `--tesseract-*` tokens) |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Density — 20 / 24 / 28px height |
| `selected` | boolean | `false` | First-class active/toggle state (stronger wash + 500 accent border) |
| `onClick` | fn | — | Makes the chip act as a button (button role, `aria-pressed`) |
| `onDelete` | fn | — | Renders a dismiss × button; fires on remove |
| `removePosition` | `"left"` \| `"right"` | `"right"` | Side for the × button |
| `icon` / `rightIcon` | ReactNode | — | Leading / trailing icon slot |
| `radius` | number \| `"pill"` \| `"sharp"` | radius-10 | Corner radius override |

Colours, spacing, and radii all resolve from `--tesseract-*` tokens — don't hardcode hex or px.

**Example**
```jsx
// Toggleable symptom chip during patient intake
<Chip
  label="Fever"
  color="primary"
  variant="soft"
  selected={selected.has("Fever")}
  onClick={() => toggle("Fever")}
/>

// Active filter with dismiss
<Chip label="Dept: Cardiology" color="primary" variant="outline" onDelete={() => remove("dept")} />
```

**Variants**
- **Sizes** — sm / md / lg.
- **Colors** — default · primary · success · warning · error.
- **Variants** — solid · soft · outline.
- **Selected** — active/toggle state across colours.
- **Deletable** — chips with a dismiss ×.
- **Clickable / Disabled** — button-mode and disabled states.
- **Radius** — sharp · numeric · pill overrides.
- **Symptom Selector / Active Filters / Department Tags** — EMR in-context scenarios.
