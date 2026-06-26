# Skeleton
> A shimmering placeholder that holds a content shape while its data loads.

**Import**
```jsx
import { Skeleton } from "tesseract-ui";
```

**When to use** — Fill the layout during an initial fetch so the page doesn't jump on swap-in: table rows, a profile hero, card lists. Mirror the real content with `variant` + sizing so nothing reflows.

**When not** — A brief, shapeless or indeterminate wait is `LoadingIndicator`; an empty result (not loading) is an empty-state, not a skeleton.

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `variant` | `"text" \| "circular" \| "rectangular"` | `"text"` | Shape to mimic — line of text, avatar, or block. |
| `width` | `number \| string` | per variant | px or any CSS length (e.g. `"60%"`). |
| `height` | `number \| string` | per variant | px or any CSS length; `text` infers from font. |
| `count` | `number` | `1` | Stack N skeletons. For `variant="text"` the last line auto-shortens (~60%). |
| `animation` | `"pulse" \| "wave" \| "none"` | `"pulse"` | Pulse · wave shimmer · static. Auto-disabled under `prefers-reduced-motion`. |
| `radius` | `number \| string` | per variant | Corner radius override (px or `"pill"` / `"50%"`). |
| `speed` | `number \| string` | `~1.5s` | Animation duration — seconds number or CSS time (e.g. `"2s"`). |

Colours and spacing come from `--tesseract-*` tokens — don't hardcode greys; size to match the element being replaced.

**Example**
```jsx
{/* Patient row loading state — avatar + two text lines */}
<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
  <Skeleton variant="circular" width={32} />
  <div style={{ flex: 1 }}>
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="50%" />
  </div>
</div>
```

**Variants**
- **Variants** — `text`, `circular`, `rectangular` side by side.
- **Text Lines** / **Count (multi-line text)** — stacked lines; last auto-shortens.
- **Animations** — pulse · wave · none.
- **Circular** — avatar sizes.
- **Card Placeholder** — image + avatar + text composition.
- **Patient Table Rows** / **Patient Profile Hero** / **Appointment Cards Loading** — EMR in-context loading states.
