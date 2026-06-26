# Logo
> The Tatva brand marks — full `wordmark` or standalone `symbol` — rendered from shared SVGs via CSS mask so a single asset recolours per surface.

**Import**
```jsx
import { Logo } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — branding a header, splash, sidebar, or print surface; `wordmark` where the name can be read, `symbol` in tight/square slots (favicon, collapsed nav).
**When not** — generic UI glyphs are `MedicalIcon` / `TPIcon`, not Logo; never recombine wordmark + symbol into a custom lockup.

**Key props**

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `variant` | `"wordmark" \| "symbol"` | `"wordmark"` | Full lockup vs. the standalone monochrome symbol. |
| `brand` | `"practice" \| "care"` | `"practice"` | Which wordmark — TatvaPractice or TatvaCare (symbol is shared). |
| `tone` | `"gradient" \| "dark" \| "light" \| "violet" \| "blue"` | `"gradient"` | Preset paint from `--tesseract-*` tokens. Use `light` (white) on dark surfaces. |
| `color` | string | — | Arbitrary brand colour/gradient; overrides `tone`. |
| `height` | px | `32` | Height; width derives from the artwork aspect ratio. |
| `width` / `maxWidth` | px | — | Width-based sizing (`width` wins over `height`); `maxWidth` only caps. |
| `basePath` | string | `"/brand"` | Prefix for the SVG asset paths (CDN / alt root). |
| `title` | string | brand name | Accessible label (`aria-label`). |

Colours and the gradient ramp come from `--tesseract-*` tokens — don't hardcode hex; set `tone`/`height` and let the artwork scale.

**Example**
```jsx
// App header for the EMR — sized by height, white on a dark top bar
<Logo variant="wordmark" brand="practice" tone="light" height={28} />
```

**Variants**
- **Playground** — live controls over every prop, on auto light/dark backdrop.
- **Tones** — gradient / dark / violet / blue on light, white on dark.
- **Variants** — wordmark vs. monochrome symbol (shared).
- **Brands** — TatvaPractice vs. TatvaCare wordmarks, light + dark.
