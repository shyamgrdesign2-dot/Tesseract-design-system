# AnimatedGrid
> A decorative SVG lattice with travelling "comet" pulses, sized to fill any surface behind your content.

**Import**
```jsx
import { AnimatedGrid } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — purely ambient motion behind a hero, splash, empty state, login, or marketing panel. Standalone (HeroBanner just reuses it), so drop it behind any panel.
**When not** — never as a loading state (use `LoadingIndicator` / `Skeleton`); it carries no content.

**Key props**

| prop | type | default | what it does |
|------|------|---------|--------------|
| `lineColor` | string | faint white (`--tesseract-slate-0` @14%) | Lattice stroke; re-theme for light vs dark surfaces. |
| `cometColor` | string | `var(--tesseract-slate-0)` | Travelling pulse color. |
| `edgeFade` | number\|boolean | `true` (→0.6) | Edge-dissolve strength `0–1` so the grid reads as texture, not a cropped box. |
| `speed` | `"slow"`\|`"normal"`\|`"fast"`\|number | `"normal"` | Comet velocity/cycle multiplier (calmer = slower). |
| `density` | number `0–1` | `1` | Fraction of lanes emitting comets; **lower = sparser, calmer, cheaper.** |
| `animated` | boolean | `true` | `false` draws only the static lattice. Upper bound — `prefers-reduced-motion` always wins. |
| `className` / `style` | string / object | — | Position it; render absolutely behind content. |

Colours/spacing come from `--tesseract-*` tokens — don't hardcode; default colours already point at the token ramp.

**Example**
```jsx
// Ambient backdrop behind a clinic login / empty-state panel
<div style={{ position: "relative", overflow: "hidden" }}>
  <AnimatedGrid
    speed="slow"
    density={0.3}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  />
  <YourContent />
</div>
```

Light surface: `<AnimatedGrid lineColor="rgba(75,74,213,0.16)" cometColor="#4b4ad5" />`

**Variants**
- **Playground** — all controls (line/comet color, edgeFade, speed, density, animated).
- **CalmAndSparse** — `speed="slow" density={0.3}` for a quiet backdrop.
- **Static** — `animated={false}` (also the reduced-motion render).
- **OnDark** / **OnLight** / **Backgrounds** — default white theme vs indigo light-surface theme, side by side.
