# Atoms — catalog

> **Scope:** every primitive UI component shipped in `src/components/atoms/`.
> **Audience:** designers (pick the right primitive), frontend devs (compose), PMs (vocabulary check), AI assistants (canonical inventory before suggesting "build a button…").
> **Read when:** designing a new screen, building a new component, or wondering "do we already have an X?".
> **Sibling docs:** [`../molecules/molecules-catalog.md`](../molecules/molecules-catalog.md) · [`../../design-system/design-tokens-and-theme.md`](../../design-system/design-tokens-and-theme.md) (tokens these atoms consume).

Smallest UI primitives. Each atom is **domain-agnostic** — it can be
shipped in a generic UI library without any change.

> **Import rule:** atoms may only consume design tokens (`var(--tesseract-*)`), the shared primitives in [`@/src/hooks/ui/`](../../hooks/ui/), and `@/src/hooks/utils`. Never `molecules/`.

## Quick rules for designers + devs

- **Even-pixel sizes only.** 14, 16, 20, 24, 32, 36, 40… No 11/13/15/17.
- **Touch target ≥ 36 px** desktop, ≥ 44 px iPad.
- **Color via tokens.** `var(--tesseract-blue-500)`, `var(--tesseract-slate-700)`, never raw hex.
- **CTAs use Linear iconsax variant** (Button + similar). Decorative icons may use Bulk/Bold.

## Dependency status

**Zero `@radix-ui/*` packages remain.** Every atom is hand-rolled and
ships zero JS UI deps. The accessibility/positioning machinery lives in
[`@/src/hooks/ui/`](../../hooks/ui/) (Slot, Portal, DialogPrimitive,
use-overlay). New atoms should default to hand-rolled.

Atoms in this folder:
`Badge`, `Button`, `Checkbox`, `Chip`, `Divider`, `Input`, `MedicalIcon`,
`Radio`, `Skeleton`, `Slider`, `Toggle`, plus the decorative helper
`AnimatedGrid`.

`Button` is the single CTA — one component covers text, with-icons,
icon-only, and split (primary + dropdown `menu`) shapes across every
variant × theme × size × surface.

## Catalog

| Atom | Purpose | Variants / props summary |
|---|---|---|
| `Badge` | Small pill that labels status / count. | variant: solid/soft/outline/dot · color: primary/success/warning/error/neutral/violet · size: sm/md/lg · 10px radius. |
| `Button` | The single CTA. Shapes: text, `leftIcon`/`rightIcon`, icon-only (`icon` + `aria-label`), split (`menu`). variant: solid/outline/ghost/tonal/link · theme: primary/neutral/error/success/warning · size: sm/md/lg · surface: light/dark · loading/disabled. |
| `Checkbox` | Single boolean control with optional label. | size: sm/md/lg · states: default, hover, focus, disabled, indeterminate. |
| `Chip` | Removable / selectable label pill (filter chips, multi-select). | color: default/primary/success/warning/error · variant: filled/outlined · size: sm/md/lg · onDelete/icon · 10px radius. |
| `Divider` | Hairline horizontal/vertical rule. | orientation, length, tone. |
| `Input` | Single-line text field. Supports leading/trailing icons. | size sm/md/lg; states default/error/disabled. |
| `MedicalIcon` (`TPMedicalIcon`) | Mask-painted medical glyph (ECG, virus, syringe, etc.). | name, variant: linear/bulk, size, color. |
| `Radio` | Single-select control in a radio group. | size: sm/md/lg · states match Checkbox. |
| `Skeleton` | Pulsing placeholder block while loading. | width, height, radius. |
| `Slider` | Value slider with track + thumb. | size: sm/md/lg · min, max, step, color. |
| `Toggle` | On/off toggle switch. | size: sm/md/lg · shape: rounded/square · checked, disabled. |
| `AnimatedGrid` | Decorative animated SVG lattice with comet pulses (banner/hero background). | className, style. |

## When to use what

| If you need… | Reach for |
|---|---|
| The standard CTA | `Button` |
| Icon-only / primary+menu CTA | `Button` with `icon` (+ `aria-label`) / `Button` with `menu` |
| Status text + color in a small pill | `Badge` |
| Removable filter or multi-select pill | `Chip` |
| A single-line text field | `Input` |
| Boolean toggle | `Toggle` (immediate effect) or `Checkbox` (form field) |
| Single-select in a group | `Radio` |
| Loading: shape | `Skeleton` |
| Medical glyph | `MedicalIcon` (TPMedicalIcon) |

## Adding an atom

1. Create `src/components/atoms/<Name>/`.
2. Add `<Name>.jsx`, optional `<Name>.module.scss`, `index.js` barrel.
3. Read [`../../../design.md`](../../../design.md) — sizing, typography, color tokens, even-pixel rule.
4. Implement.
5. Re-export from [`./index.js`](./index.js).
6. Run `npm run build` and `npm run lint`. Boundary errors mean you're importing something an atom shouldn't.

## Examples

```jsx
// Simple consumption
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms";  // via barrel

<Button variant="solid" theme="primary" size="md" onClick={save}>
  Save
</Button>

<Badge tone="success">Verified</Badge>
```
