# DonutChart / PieChart
> Part-to-whole composition — zero-dependency (own arc geometry).

**Import**
```jsx
import { DonutChart, PieChart } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — a single composition: payer/payment mix, case-type split, discharge-type mix. A few slices (≤ ~6) read best. For comparison across categories use **BarChart**.

**Data**
```jsx
<DonutChart
  data={[{ label: "Cash", value: 480 }, { label: "Insurance", value: 320 }, /* … */]}
  centerLabel="Collections"
/>
// full pie (no hole):
<PieChart data={/* … */} />
```

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `data` | `{label,value,color?}[]` | `[]` | Slices. |
| `height` / `size` | `number` | `240` | Ring diameter (square). |
| `innerRadius` | `0..0.9` | `0.62` | Hole fraction. `0` → full pie (or use `<PieChart>`). |
| `padAngle` | `number` (deg) | `0` | Gap between slices. |
| `startAngle` | `number` (deg) | `0` | Rotate the ring. |
| `sort` | `"none" \| "desc" \| "asc"` | `"none"` | Slice order. |
| `sliceStroke` / `sliceStrokeColor` | `number` / `string` | `2` / surface | Separator between slices. |
| `hoverExpand` | `number` | `4` | Px a slice grows on hover. |
| `showCenter` / `centerLabel` / `centerValueFormat` | `boolean` / `string` / `(v)=>string` | `true` / `"Total"` / compact | Center total (donut only). |
| `legend` | `"right" \| "bottom" \| "none"` | `"right"` | Legend position. |
| `showValue` / `showPercent` | `boolean` | `true` | Legend columns. |
| `showTooltip` | `boolean` | `true` | Slice tooltip (pie). |
| `colors` / `valueFormat` | `string[]` / `(v)=>string` | brand / compact | Palette + number format (`formatIndian` for ₹). |

Token-only. Hovering a slice or legend row highlights the pair.
