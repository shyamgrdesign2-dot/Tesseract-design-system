# LineChart
> A multi-series trend/time chart — zero-dependency (pure SVG + own scales/curves).

**Import**
```jsx
import { LineChart } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — a value that moves over time or an ordered category: visits/walk-ins per day, a vital trend, revenue by day. For category comparison use **BarChart**; for a tiny inline trend use **Sparkline**.

**Data** — an array of row objects; name the x key and the value series:
```jsx
<LineChart
  data={[{ day: "Mon", visits: 42, walkins: 12 }, /* … */]}
  xKey="day"
  series={[{ key: "visits", label: "Visits" }, { key: "walkins", label: "Walk-ins" }]}
/>
```

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `data` | `object[]` | `[]` | Rows. |
| `xKey` | `string` | `"x"` | The category/time key on each row. |
| `series` | `(string \| {key,label?,color?})[]` | `[]` | Value series to plot. |
| `height` | `number` | `260` | Chart height (width is responsive). |
| `curve` | `"smooth" \| "linear" \| "step"` | `"smooth"` | Line interpolation. |
| `area` / `areaOpacity` | `boolean` / `number` | `false` / `0.14` | Fill under the line. |
| `markers` / `markerSize` | `boolean` / `number` | `false` / `2.5` | Dots at each point. |
| `strokeWidth` | `number` | `2` | Line thickness. |
| `yMin` / `yMax` / `yTickCount` | `number` | auto / auto / `5` | Value-axis domain + ticks. |
| `yFormat` / `xFormat` | `(v)=>string` | compact / identity | Tick + tooltip formatters (`formatIndian` for ₹). |
| `showYAxis` / `yAxisLabel` | `boolean` / `string` | `true` / — | Value-axis labels + title. |
| `showXAxis` / `xAxisLabel` / `xTickCount` | `boolean` / `string` / `number` | `true` / — / `6` | Category axis. |
| `showGrid` / `gridStyle` / `showVerticalGrid` | `boolean` / `"solid"\|"dashed"` / `boolean` | `true` / `solid` / `false` | Gridlines. |
| `showLegend` / `legendPosition` / `legendAlign` | `boolean` / `"top"\|"bottom"` / `"start"\|"center"\|"end"` | `true` / `bottom` / `start` | Click-to-toggle legend. |
| `showTooltip` / `showCrosshair` | `boolean` | `true` / `true` | Hover readout + crosshair. |
| `zoomable` / `showToolbar` | `boolean` | `false` | Wheel-zoom + drag-pan; toolbar (zoom + CSV export). |
| `colors` | `string[]` | brand ramp | Override the series palette (tokens). |

Colours resolve from `--tesseract-*` tokens. Responsive width; reduced-motion safe.
