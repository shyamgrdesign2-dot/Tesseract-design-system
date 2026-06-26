# Avatar
> A profile mark that renders one of image · initials · icon, with an optional presence dot and brand ring.

**Import**
```jsx
import { Avatar } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — Represent a user or entity in a header, list row, comment, or assignee slot (doctor, patient, staff). Auto-falls back to initials from `name` when there's no `src`, and to an `icon` when neither is given.
**When not** — For a decorative or standalone glyph use `TPIcon`; for a status tag use `Badge`.

**Key props**

| prop | type | default | what it does |
|---|---|---|---|
| `src` | string | — | Image URL. Falls back to initials if it fails to load. |
| `name` | string | — | Initials source **and** image `alt` — always pass it. |
| `icon` | string \| ReactNode | — | Tesseract library icon name or node (used when no `src`). |
| `size` | number (px) | `40` | Diameter. |
| `shape` | `"circle"` \| `"rounded"` \| `"square"` | `"circle"` | Corner shape. |
| `radius` | number \| `"pill"` \| `"sharp"` | — | Overrides `shape`'s radius when set. |
| `color` | `"slate"` \| `"primary"` \| `"success"` \| `"warning"` \| `"error"` \| `"violet"` | `"slate"` | Background (—100) + initials/icon (—600) ramp. |
| `status` | `"online"` \| `"offline"` \| `"away"` \| `"busy"` \| ReactNode | — | Corner presence dot (white halo for legibility). |
| `ring` | boolean \| CSS string | `false` | Brand gradient ring, or a custom ring. |
| `onClick` | fn | — | When set, renders as a `<button>`. |

Content resolution order: `icon` → `src` → initials. Colours, spacing, and the ring gradient all come from `--tesseract-*` tokens — never hardcode.

**Example**
```jsx
<Avatar
  src="https://emr.clinic/u/ramesh.jpg"
  name="Ramesh Kumar"
  size={48}
  status="online"
  ring
/>
```

**Variants**
- **Playground** — all controls (content / shape / color / status / ring / icon).
- **Content** — the three forms: image · initials · icon.
- **Shapes** — circle · rounded · square.
- **Colors** — slate · primary · success · warning · error · violet ramps.
- **Status** — online · offline · away · busy presence dots.
- **Ring** — with vs without the brand gradient ring.
- **Sizes** — 24 → 80px.
