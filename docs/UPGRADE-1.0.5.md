# Upgrading Tesseract UI — `1.0.4` → `1.0.5`

`@dhspl-tatvacare/tesseract-ui@1.0.5` is **purely additive** — two more charts.
Nothing else changed; nothing breaks.

## What's new in 1.0.5

- **`RadarChart`** — multi-variable profile across 3+ axes (overlaid series polygons,
  grid rings, per-axis hover tooltip, legend toggle).
- **`GaugeChart`** — a single value vs a range (rounded arc, threshold colouring,
  center readout + range labels). E.g. bed occupancy, utilisation.

Both zero-dependency, token-only, deeply configurable. The Charts category is now
**8 components**. Also: the **`/tesseract` skill + MCP** now know all charts
(regenerated manifest / inventory), so an agent building a page can `get_component`
and `validate_usage` them.

## Upgrade (per microservice)

```bash
npm install @dhspl-tatvacare/tesseract-ui@1.0.5
# (or, if the range is already ^1.0.x): npm update @dhspl-tatvacare/tesseract-ui
```

Then rebuild/redeploy. No API changed.

```jsx
import { RadarChart, GaugeChart } from "@dhspl-tatvacare/tesseract-ui";

<GaugeChart value={72} label="Bed occupancy" unit="%" segments={[
  { upTo: 60, color: "var(--tesseract-success-500)" },
  { upTo: 85, color: "var(--tesseract-amber-500)" },
  { upTo: 100, color: "var(--tesseract-error-500)" },
]} />
```

### Rollback
```bash
npm install @dhspl-tatvacare/tesseract-ui@1.0.4
```
