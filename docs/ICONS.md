# Icons

Every TatvaPractice icon is served from the design-system **CDN** as a static SVG.
Nothing is bundled — the browser fetches each icon on demand.

## CDN URL structure

```
https://pmdoctorportal.tatvacare.in/tp-icons/<corner>/<style>/<family>/<name>.svg
                                    └ base ─┘ └ 1 ──┘ └ 2 ─┘ └ 3 ──┘ └ 4 ─┘
```

| Segment | Values | Notes |
|---|---|---|
| **base** | `https://pmdoctorportal.tatvacare.in/tp-icons` | `setIconBaseUrl()` to self-host |
| **corner** (1) | `rounded` · `straight` | `rounded` is the full set; `straight` is Pro-only (~2.7k glyphs) |
| **style** (2) | `linear` · `bold` · `bulk` · `broken` · `twotone` · `outline` | |
| **family** (3) | `ai`, `arrow`, `essential`, `medical`, … | the icon's category |
| **name** (4) | `ai-3d-box`, `search`, `ambulance`, … | the icon name (`<name>.svg`) |

Examples:

```
https://pmdoctorportal.tatvacare.in/tp-icons/rounded/linear/ai/ai-3d-box.svg
https://pmdoctorportal.tatvacare.in/tp-icons/straight/bold/ai/ai-3d-box.svg
https://pmdoctorportal.tatvacare.in/tp-icons/rounded/bold/medical/ambulance.svg
```

The local source set (mirrors the CDN exactly) lives at
`~/Desktop/TP_Icons/iconsax/<corner>/<style>/<family>/<name>.svg`.

## Using icons in code

Callers pass only a **name** (plus optional style/corner). The **family** segment
is resolved automatically from `icon-manifest.json` (name → family), so you never
hand-write the family.

```jsx
import { TPLibraryIcon, TPIcon, MedicalIcon } from "tp-ui";

<TPLibraryIcon name="search" />                          // rounded / linear / (family auto)
<TPLibraryIcon name="search" variant="bold" />           // rounded / bold
<TPLibraryIcon name="search" variant="bulk" corner="straight" />
<TPLibraryIcon name="calendar" family="health" />        // override family if needed

<TPIcon name="warning" variant="bulk" color="var(--tp-warning-500)" />
<MedicalIcon name="ambulance" variant="bold" />          // always family = medical
```

### Why a CSS mask (not `<img>`)

The CDN SVGs are painted **white**. Rendered with a plain `<img>` they'd be
invisible on light backgrounds. So `TPLibraryIcon` applies the SVG as a CSS
**mask** filled with `currentColor` — every icon tints to the surrounding text
colour (or an explicit `color`), across all six styles. To switch to raw `<img>`,
the SVGs would need to be authored in a real colour instead of white.

### Resolution & aliases (`icon-resolve.js`)

- `iconPath({ name, style, corner, family })` → `"<corner>/<style>/<family>/<name>.svg"` (or `null`)
- `iconFamily(name)`, `hasIcon(name)`
- Style aliases: `line`→`linear`, `solid`→`bold`, `dual-tone`→`bulk`
- Name aliases (curated → catalog): `arrow-down-02`→`arrow-down`, `arrow-right-02`→`arrow-right`,
  `calendar-1`→`calendar`, `chevron-down`→`arrow-down`, `more-horizontal`→`more`,
  `message`→`messages`, `success`→`tick-circle`
- App-specific icons not in the catalog (`appt-type`, `consultation-urgency`,
  `patient-gender`, `reminder-channel`, `sizes`) fall back to vendored inline SVGs
  via `<TPIcon/>`.

## Catalog size

50,305 entries → ~4,727 unique names × up to 6 styles × 2 corners
(rounded 29,892 / straight 20,413; free 7,140 / Pro 43,165), plus the 73-glyph
TatvaPractice **medical** set merged into `rounded/{linear,bold,bulk}/medical/`.
