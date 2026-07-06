# BarChart
> Categorical comparison — zero-dependency (pure SVG + own scales). Grouped/stacked, vertical/horizontal.

**Import**
```jsx
import { BarChart } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — compare a value across categories: visits by department, revenue by service, top diagnoses (horizontal). For trends over time use **LineChart**; for a single part-to-whole use **DonutChart**.

**Data**
```jsx
<BarChart
  data={[{ dept: "OPD", visits: 120, walkins: 30 }, /* … */]}
  xKey="dept"
  series={[{ key: "visits", label: "Visits" }, { key: "walkins", label: "Walk-ins" }]}
/>
```

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `data` / `xKey` / `series` | — | — | Rows, category key, value series (see LineChart). |
| `height` | `number` | `280` | Chart height (responsive width). |
| `stacked` | `boolean` | `false` | Stack series instead of grouping. |
| `horizontal` | `boolean` | `false` | Bars run left→right (category axis on the left). |
| `barRadius` | `number` | `3` | Corner radius on the **value end** only (top / right). |
| `barPadding` / `groupPadding` | `number` | `0.3` / `0.18` | Gap between categories / within a group. |
| `barOpacity` / `dimOnHover` | `number` / `boolean` | `1` / `true` | Bar opacity; fade non-hovered category. |
| `valueLabels` | `boolean` | `false` | Draw the value on each bar. |
| `yMin` / `yMax` / `yTickCount` | `number` | `0` / auto / `5` | Value-axis domain + ticks. |
| `valueFormat` | `(v)=>string` | compact | Value formatter (`formatIndian` for ₹). |
| `showValueAxis` / `valueAxisLabel` | `boolean` / `string` | `true` / — | Value axis + title. |
| `showCategoryAxis` / `categoryAxisLabel` | `boolean` / `string` | `true` / — | Category axis + title. |
| `showGrid` / `gridStyle` | `boolean` / `"solid"\|"dashed"` | `true` / `solid` | Gridlines. |
| `showLegend` / `legendPosition` / `legendAlign` | — | `true` / `bottom` / `start` | Legend (click to toggle). |
| `showTooltip` / `showToolbar` | `boolean` | `true` / `false` | Category tooltip; toolbar (CSV export). |
| `colors` | `string[]` | brand ramp | Palette override (tokens). |

Token-only, responsive. Stacked bars round only the outermost segment.
