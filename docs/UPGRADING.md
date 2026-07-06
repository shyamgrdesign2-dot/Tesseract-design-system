# Upgrading Tesseract UI

`@dhspl-tatvacare/tesseract-ui` follows [SemVer](https://semver.org) and the
stability contract in [PREREQUISITE.md](./PREREQUISITE.md): within `1.x`, code built
against v1.0 keeps working. Upgrade by bumping the one dependency, reinstalling, and
rebuilding — a published version never changes an already-deployed app, so each
microservice must reinstall + rebuild to pick up a new version.

```bash
npm install @dhspl-tatvacare/tesseract-ui@latest   # or a pinned @1.0.x
# if the range is already ^1.0.x:
npm update @dhspl-tatvacare/tesseract-ui
```

Full history is in [CHANGELOG.md](../CHANGELOG.md). Per-version notes below (newest first).

---

## → 1.0.5  (additive)

Adds **`RadarChart`** (multi-variable profile) and **`GaugeChart`** (value vs a range,
with threshold colouring). Charts category is now 8 components. The `/tesseract` skill +
tesseract MCP now know all charts. Nothing else changed.

```bash
npm install @dhspl-tatvacare/tesseract-ui@1.0.5
```

## → 1.0.4  (additive)

Adds the **Charts** category (6 zero-dependency components): `LineChart`, `BarChart`,
`DonutChart`/`PieChart`, `Sparkline`, `StatCard`, plus formatters `formatCompact` /
`formatIndian` / `formatNumber`. No existing component changed.

```jsx
import { LineChart, StatCard, formatIndian } from "@dhspl-tatvacare/tesseract-ui";
```

## → 1.0.3  (one breaking-ish change)

- **HeroBanner premium surface redesign** (layered gradient + WebGL `LightRays` +
  film grain; bare centred back icon). New `LightRays` atom.
- **⚠️ Breaking-ish:** HeroBanner `tone` reduced to **`violet` + `blue`** — `slate`
  and `dark` were removed and now **fall back to `violet`**. Migrate those usages:
  ```bash
  grep -rns 'tone="slate"\|tone="dark"' src   # → switch to tone="violet" / "blue"
  ```

---

## Agent instruction (paste into a coding agent, per microservice)

```text
TASK: Upgrade @dhspl-tatvacare/tesseract-ui to the latest 1.0.x in this repo.
STEPS:
1. In package.json set "@dhspl-tatvacare/tesseract-ui": "^1.0.5", then run: npm install
   (confirm package-lock.json resolves the new version).
2. If upgrading ACROSS 1.0.3: find and migrate removed HeroBanner tones —
   grep -rns 'tone="slate"\|tone="dark"' src  → replace with tone="violet" (or "blue").
   Everything else (1.0.4/1.0.5 = charts) is purely additive; do not change usages.
3. Rebuild the app and fix any build errors referencing tesseract-ui.
4. Report the resolved version, any tone migrations, and the build result.
CONSTRAINTS: only the dependency bump + the tone migration + resulting build fixes.
Do not publish or deploy.
```

### Rollback
```bash
npm install @dhspl-tatvacare/tesseract-ui@<previous-version>
```
