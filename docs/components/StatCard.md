# StatCard
> A KPI tile — value, a tinted delta pill, and an optional inline Sparkline. Zero-dependency.

**Import**
```jsx
import { StatCard } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — a dashboard headline metric: appointments today, collections, occupancy, no-show rate. Set `invertDelta` when *down* is good (no-shows, dues).

**Example**
```jsx
<StatCard
  label="Appointments today"
  value={128}
  delta={12.5}
  spark={[12, 14, 13, 16, 15, 19, 22]}
  footer="vs. last week"
/>
// reference KPI layout — icon top-right, delta below, ₹ grouping:
<StatCard label="Total billed" value={2850000} format={(v)=>`₹${v.toLocaleString("en-IN")}`}
  icon={icon} iconPosition="right" delta={-4} showSparkline={false} footer="vs previous period" />
```

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `label` / `value` | `node` / `any` | — | Caption + metric. |
| `format` | `(v)=>string` | compact | Value formatter (`formatIndian` for ₹). |
| `delta` | `number` | — | Change; sign drives the pill’s arrow + colour. |
| `deltaSuffix` | `string` | `"%"` | Unit after the delta. |
| `invertDelta` | `boolean` | `false` | Treat *down* as good (green). |
| `trend` | `"up" \| "down" \| "flat"` | auto | Force the direction. |
| `deltaPlacement` | `"header" \| "below"` | `"header"` | Delta pill in the header or under the value. |
| `spark` / `sparkColor` | `number[]` / `string` | — / brand | Inline sparkline + colour. |
| `sparkArea` / `sparkCurve` | `boolean` / `"smooth"\|"linear"\|"step"` | `true` / `smooth` | Sparkline style. |
| `showSparkline` / `sparkPosition` | `boolean` / `"bottom"\|"side"\|"none"` | `true` / `bottom` | Sparkline visibility + placement. |
| `icon` / `iconPosition` | `node` / `"left"\|"right"` | — / `left` | Icon chip; `right` drops the delta below (reference layout). |
| `footer` | `node` | — | Muted line at the bottom. |
| `variant` | `"surface" \| "soft" \| "outline"` | `"surface"` | Card treatment. |
| `size` | `"sm" \| "md"` | `"md"` | Density. |
| `align` | `"left" \| "center"` | `"left"` | Content alignment. |
| `bordered` | `boolean` | `true` | Card border. |

Token-only; the delta pill uses the success/error soft ramps.
