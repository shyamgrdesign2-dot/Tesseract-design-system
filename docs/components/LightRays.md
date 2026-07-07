# LightRays
> A self-contained WebGL fan of soft, drifting volumetric light beams — screen-blended over a dark surface for a premium hero glow.

**Import**
```jsx
import { LightRays } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — ambient premium light over a dark panel (the HeroBanner violet field, a splash / marketing surface). Zero runtime dependency (raw WebGL — no three/ogl), SSR-safe, reduced-motion-aware (freezes on a still frame), and renders nothing if WebGL is unavailable — so the host surface always stands on its own.
**When not** — over light surfaces (it's built to `screen`-blend over dark); never as a loading state (use `LoadingIndicator` / `Skeleton`).

**Key props**

| prop | type | default | what it does |
|------|------|---------|--------------|
| `color1` / `color2` | CSS color | violet-200 / blue-200 tokens | Beam tints blended across the fan; pass any `var(--tesseract-*)`. |
| `origin` | `[x, y]` | `[-0.04, -0.04]` | Source in normalized coords (0 = top-left); negative pushes it off-canvas for a wider fan. |
| `direction` | `[dx, dy]` | `[1, 0.6]` | Sweep direction in screen space (x right, y down). |
| `spread` | number | `1.35` | Angular spread — higher = wider / softer. |
| `length` | number | `2.1` | Reach as a multiple of width. |
| `fade` | number | `1.15` | Fade distance as a multiple of width. |
| `intensity` | number | `0.36` | Overall brightness. |
| `speed` | number | `0.35` | Drift speed. |
| `blur` | number | `16` | CSS blur (px) for a soft glow. |
| `noise` / `distortion` | number | `0.08` / `0.05` | Grain breakup / beam wobble. |
| `className` / `style` | string / object | — | Position it; renders absolutely, `pointer-events: none`, `aria-hidden`. |

Colours are token-driven — the defaults point at the `--tesseract-*` ramp; don't hardcode.

**Example**
```jsx
// Premium glow over a dark hero field
<div style={{ position: "relative", overflow: "hidden", background: "var(--tesseract-violet-900)" }}>
  <LightRays />
  <YourHeroContent />
</div>
```

**Notes**
- Degrades gracefully: no WebGL context → renders nothing, host surface stands alone.
- `prefers-reduced-motion` → freezes on a representative still frame instead of animating.
