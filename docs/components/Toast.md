# Toast
> A compact, transient status message — coloured status icon, title, optional subtext, optional action button, and dismiss control.

**Import**
```jsx
import { Toast } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — brief feedback on a result or system event (saved, sync failed, license expiring). Pass `duration` to auto-dismiss, or leave it persistent.
**When not** — a blocking decision the user must answer → use `ConfirmDialog`; inline form errors stay next to the field.

**Key props**

| prop | type | default | what it does |
|---|---|---|---|
| `status` | `"info" \| "success" \| "warning" \| "error"` | `"info"` | semantic tone — colours the icon only |
| `surface` | `"dark" \| "light"` | `"dark"` | surface variant (light = light bg + dark text) |
| `title` | ReactNode | — | primary message line |
| `children` | ReactNode | — | optional supporting subtext line |
| `action` | ReactNode | — | e.g. a `<Button>` whose `surface` matches the toast |
| `dismissible` | boolean | `false` | shows the square × button |
| `duration` | number (ms) | `0` | auto-dismiss after this long; `0` = persist (pauses on hover) |
| `progress` | boolean | `false` | depleting progress bar (needs `duration` > 0) |
| `showIcon` / `icon` | boolean / ReactNode | `true` / — | toggle or override the leading status glyph |
| `maxWidth` | number \| string | `60%` | cap toast width (number → px) |

Colours, spacing, and the status ramp all come from `--tesseract-*` tokens — consumers don't hardcode.

**Example**
```jsx
<Toast
  status="warning"
  title="License expiring soon"
  dismissible
  duration={6000}
  action={<Button surface="dark" variant="solid" size="sm">Renew</Button>}
>
  Your TatvaPractice Enterprise license expires on 15 June 2026.
</Toast>
```

**Variants**
- `Playground` — all controls live
- `Statuses` — info / success / warning / error
- `Light surface` — token-driven light bg + dark text
- `Single line` — title only, compact 24px icon
- `Sizing & Truncation` — line-clamp rules keep height predictable
- `With progress bar` — bar depletes over `duration`
- `Auto-dismiss (duration)` — timer pauses on hover
- `With action` / `Without action` / `System alerts` — clinic scenarios
