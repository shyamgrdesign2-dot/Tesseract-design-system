# Alert
> An inline, persistent status banner for in-flow messaging — allergy/drug-interaction warnings, page notices.

**Import**
```jsx
import { Alert } from "tesseract-ui";
```

**When to use** — Important context that should stay visible on the page (e.g. allergy on file, drug interaction). Persistent and in-flow.
**When not** — Transient feedback → `Toast`; blocking decision → `ConfirmDialog`; field-level errors → `Field` / InputBox `status`.

**Key props**

| prop | type | default | what it does |
|---|---|---|---|
| `status` | `"info" \| "success" \| "warning" \| "error"` | `"info"` | Colour ramp + auto glyph; warning/error are assertive (`role="alert"`). |
| `title` | ReactNode | — | Bold lead line. |
| `children` | ReactNode | — | Body text. |
| `variant` | `"soft" \| "outline"` | `"soft"` | Tinted fill vs. bordered low-emphasis. |
| `icon` | icon name \| node \| `false` | auto | Override the auto status glyph; `false` hides it. |
| `action` | ReactNode | — | Trailing action(s) — compose the `Button` atom. |
| `onDismiss` | `() => void` | — | When set, shows a × close button. |

Colours and spacing come from `--tesseract-*` tokens — no hardcoded values.

**Example**
```jsx
<Alert
  status="error"
  title="Drug interaction detected"
  onDismiss={() => setShow(false)}
  action={<Button size="sm" variant="solid" theme="error">Review</Button>}
>
  Warfarin and ibuprofen together raise bleeding risk.
</Alert>
```

**Variants**
- **Playground** — single configurable alert.
- **Statuses** — all four (info · success · warning · error).
- **WithActionAndDismiss** — trailing `Button` action plus × close.
- **Outline** — bordered, lower-emphasis surface.
