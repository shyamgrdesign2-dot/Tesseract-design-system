# InputOTP
> One-time-code / PIN input: `length` single-char boxes with auto-advance, backspace-to-previous, arrow-key nav, and paste-to-fill across all boxes.

**Import**
```jsx
import { InputOTP } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — 2FA / OTP verification and e-prescription sign-off, where a short code is entered digit-by-digit (with paste support).
**When not** — For a normal free-text or numeric field, use `Input`.

**Key props**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `length` | number | `6` | Number of boxes. |
| `value` / `onChange` | string / `(code) => void` | — | Controlled value + change handler. |
| `defaultValue` | string | `""` | Initial value (uncontrolled). |
| `onComplete` | `(code) => void` | — | Fires once every box is filled. |
| `allow` | `"numeric" \| "alphanumeric" \| "any"` | `"numeric"` | Allowed chars; also sets the keyboard `inputMode`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Box density/scale. |
| `status` | `"default" \| "error" \| "success"` | `"default"` | Validation styling. |
| `mask` | boolean | `false` | Render as password dots for sensitive PINs. |
| `groupSize` + `separator` | number + ReactNode | — / `"-"` | Insert a separator every N boxes (e.g. `3` → `123 – 456`). |
| `radius` | number \| `"pill"` \| `"sharp"` | — | Per-box corner radius. |

Colours, spacing, and radius resolve from `--tesseract-*` tokens — consumers don't hardcode any values.

**Example**
```jsx
function PrescriptionSignOff({ onVerified }) {
  return (
    <InputOTP
      length={6}
      allow="numeric"
      ariaLabel="E-prescription sign-off code"
      onComplete={(code) => onVerified(code)}
    />
  );
}
```

**Variants**
- **Playground** — all props live.
- **Controlled** — reads back the live code and fires `onComplete`.
- **Grouped** — `groupSize={3}` with a separator (3 + 3).
- **Masked** — password dots for sign-off PINs.
- **Sizes** — sm · md · lg.
- **Status** — error / success states.
- **Alphanumeric** — `allow="alphanumeric"` for backup codes.
