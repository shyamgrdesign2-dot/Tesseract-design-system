# Sparkline
> A tiny, axis-less trend line for inline use — zero-dependency.

**Import**
```jsx
import { Sparkline } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — a compact trend next to a value: a vital’s 7-day line in a table cell, per-row activity, inside a **StatCard**. For a full chart with axes use **LineChart**.

**Data** — an array of numbers, or objects + `valueKey`:
```jsx
<Sparkline data={[8, 10, 9, 12, 11, 14]} color="var(--tesseract-blue-500)" area />
<Sparkline data={rows} valueKey="bp" />
```

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `data` | `number[] \| object[]` | `[]` | Values. |
| `valueKey` | `string` | — | Field to read when `data` is objects. |
| `width` / `height` | `number` | `96` / `28` | Size. |
| `color` / `strokeWidth` | `string` / `number` | brand / `1.5` | Line. |
| `curve` | `"smooth" \| "linear" \| "step"` | `"smooth"` | Interpolation. |
| `area` / `fillOpacity` | `boolean` / `number` | `false` / `0.15` | Fill under the line. |
| `showLastDot` / `markers` | `boolean` | `true` / `false` | Last-point dot / all-point dots. |
| `dotColor` / `dotRadius` | `string` / `number` | line / auto | Dot styling. |
| `min` / `max` | `number` | auto | Override the value domain. |

Token-only; renders `display: inline-block` so it sits inline with text.
