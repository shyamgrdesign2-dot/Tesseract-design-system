# RadarChart
> Multi-variable comparison across 3+ axes — zero-dependency (own polar geometry).

**Import**
```jsx
import { RadarChart } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — compare several metrics on one shape: symptom/quality scores pre vs post, an assessment profile, capability spread. Reads best with 3–8 axes and ≤3 series. For a single value vs target use **GaugeChart**.

**Data** — one row per axis; name the axis key and the value series:
```jsx
<RadarChart
  data={[{ axis: "Mobility", pre: 40, post: 78 }, { axis: "Pain", pre: 30, post: 70 }, /* … */]}
  axisKey="axis"
  series={[{ key: "pre", label: "Admission" }, { key: "post", label: "Discharge" }]}
  max={100}
/>
```

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `data` | `object[]` | `[]` | One row per axis. |
| `axisKey` | `string` | `"axis"` | The axis-label key on each row. |
| `series` | `(string \| {key,label?,color?})[]` | `[]` | Series to overlay. |
| `height` | `number` | `300` | Square size. |
| `max` | `number` | auto | Value at the outer ring (shared scale). |
| `levels` | `number` | `4` | Concentric grid rings. |
| `fillOpacity` / `strokeWidth` / `dot` | `number` / `number` / `boolean` | `0.15` / `2` / `true` | Polygon fill, outline, vertex dots. |
| `showGrid` / `showAxisLabels` | `boolean` | `true` | Rings + spokes / axis labels. |
| `showLegend` / `legendAlign` | `boolean` / `"start"\|"center"\|"end"` | `true` / `center` | Click-to-toggle legend. |
| `showTooltip` | `boolean` | `true` | Hover an axis → values for all series. |
| `colors` / `valueFormat` | `string[]` / `(v)=>string` | brand / compact | Palette + number format. |

Token-only. All series share one radial scale so shapes are comparable.
