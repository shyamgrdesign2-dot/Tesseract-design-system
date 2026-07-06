# Upgrading Tesseract UI — `1.0.3` → `1.0.4`

`@dhspl-tatvacare/tesseract-ui@1.0.4` is **purely additive** — a new **Charts**
category. No existing component changed; nothing breaks. Upgrade by bumping the one
dependency, reinstalling, and rebuilding.

> A published version never changes an already-deployed app — each microservice must
> reinstall + rebuild to pick up `1.0.4`.

---

## What's new in 1.0.4

- **Charts — 6 zero-dependency analytics components** (pure SVG + our own scales /
  geometry / formatting; no chart library):
  - `LineChart` — multi-series trend; smooth/linear/step, area, markers, crosshair
    tooltip, legend toggle, zoom + pan, toolbar (CSV export).
  - `BarChart` — grouped/stacked, vertical/horizontal, rounded value ends, value labels.
  - `DonutChart` / `PieChart` — center total, pad-angle, slice sort/stroke, legend value + %.
  - `Sparkline` — tiny inline trend for table cells / KPI tiles.
  - `StatCard` — KPI tile with a tinted delta pill + inline sparkline.
- **Formatters** exported: `formatCompact` (k/M/B), `formatIndian` (k/L/Cr), `formatNumber`.

All token-only and responsive. See [CATALOG.md](./CATALOG.md#charts-6) and the
per-component docs.

---

## Upgrade (per microservice)

```bash
npm install @dhspl-tatvacare/tesseract-ui@1.0.4
# (or, if the range is already ^1.0.x):
npm update @dhspl-tatvacare/tesseract-ui
```

Then rebuild/redeploy. Nothing else to do — no API changed.

### Use the charts

```jsx
import { LineChart, BarChart, DonutChart, StatCard, formatIndian } from "@dhspl-tatvacare/tesseract-ui";
import "@dhspl-tatvacare/tesseract-ui/styles.css"; // once, at app root

<LineChart data={rows} xKey="day" series={["collected", "refunded"]} yFormat={formatIndian} area />
```

### Rollback

```bash
npm install @dhspl-tatvacare/tesseract-ui@1.0.3
```

---

## Agent instruction (paste into a coding agent per microservice)

```text
TASK: Upgrade @dhspl-tatvacare/tesseract-ui to 1.0.4 in this repository.
CONTEXT: 1.0.4 is purely additive — it adds a Charts category (LineChart, BarChart,
DonutChart, PieChart, Sparkline, StatCard) + formatters (formatCompact, formatIndian,
formatNumber). No existing component or prop changed; nothing breaks.
STEPS:
1. In package.json set "@dhspl-tatvacare/tesseract-ui": "^1.0.4", then run: npm install
   (confirm package-lock.json resolves 1.0.4).
2. Do NOT change any component usage — this is additive only.
3. Rebuild the app (this repo's build script) and confirm it builds clean.
4. Report the resolved version and the build result.
CONSTRAINTS: only the dependency bump + resulting build fixes. Do not publish/deploy.
```
