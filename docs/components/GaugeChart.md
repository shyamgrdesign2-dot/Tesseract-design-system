# GaugeChart
> A single value against a range (KPI vs target) — zero-dependency (own arc geometry).

**Import**
```jsx
import { GaugeChart } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — one number that lives on a scale: bed occupancy %, OT utilisation, goal completion, stock level. For a trend use **LineChart**; for a headline number + delta use **StatCard**.

**Example**
```jsx
<GaugeChart value={72} label="Bed occupancy" unit="%" />

// threshold colouring (green → amber → red):
<GaugeChart value={88} label="Occupancy" unit="%" segments={[
  { upTo: 60, color: "var(--tesseract-success-500)" },
  { upTo: 85, color: "var(--tesseract-amber-500)" },
  { upTo: 100, color: "var(--tesseract-error-500)" },
]} />
```

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `value` | `number` | `0` | The measured value. |
| `min` / `max` | `number` | `0` / `100` | The range. |
| `label` / `unit` | `node` / `string` | — | Caption / value suffix (e.g. `"%"`). |
| `valueFormat` | `(v)=>string` | compact | Center + range formatter. |
| `showValue` / `showRange` | `boolean` | `true` | Center readout / min-max labels. |
| `height` | `number` | `180` | Size. |
| `arcDegrees` | `number` | `240` | Total sweep (opening at the bottom). |
| `thickness` | `number` | auto | Arc stroke width. |
| `rounded` | `boolean` | `true` | Rounded arc caps. |
| `color` / `trackColor` | `string` | brand / slate-100 | Value arc / track colour. |
| `segments` | `{upTo,color}[]` | — | Threshold colours — the value arc takes the first zone whose `upTo ≥ value`. |

Token-only. The arc value clamps to `[min, max]`.
