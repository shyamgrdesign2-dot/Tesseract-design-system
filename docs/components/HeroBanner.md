# HeroBanner
> The dark, gradient page-header band — eyebrow + title + subtitle, an optional back button, an animated lattice accent, and a slot for up to three dark-surface Button CTAs.

**Import**
```jsx
import { HeroBanner } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — the top band of a primary page (Appointments, Patient Details) that needs the page title plus its main actions in one place. This is the only banner.
**When not** — an inline section heading (use a plain heading) or a modal/confirmation surface (use `ConfirmDialog`).

**Key props**

| prop | type | default | what it does |
|---|---|---|---|
| `title` | string | — | Required page heading. Truncates with a tooltip when clipped. |
| `subtitle` | string | — | Optional supporting line under the title. |
| `eyebrow` | string \| node | — | Small uppercase kicker above the title. |
| `size` | `"sm"`\|`"md"`\|`"lg"` | `"md"` | Banner height (80 / 120 / 160). `height` is a numeric escape hatch. |
| `titleSize` / `subtitleSize` | `"sm"`\|`"md"` | `"md"` / `"sm"` | 18px/24px title, 13px/16px subtitle. |
| `tone` | `"violet"`\|`"blue"`\|`"slate"`\|`"dark"` | `"violet"` | Token-only gradient reskin per page/specialty. |
| `background` | string | — | Full CSS background override; wins over `tone`. |
| `actions` | ReactNode | — | CTA slot — up to 3 `Button`s, all `surface="dark"` (text / icon-only / split). |
| `showBackButton` / `onBack` | bool / fn | `false` | Back button centered on the heading line (`backIcon` / `backIconVariant` configurable). |
| `align` | `"center"`\|`"top"` | `"center"` | Vertical alignment of the content block. |
| `bottomRadius` / `pattern` | number / bool | size-based / `true` | Bottom corner radius (max 42); toggle the lattice accent. |

Colours, spacing, radii and typography all resolve from `--tesseract-*` tokens — consumers never hardcode hex or px for theming. The banner is dark-only, so every CTA must be `surface="dark"`.

**Example**
```jsx
<HeroBanner
  eyebrow="Today · OPD Block B"
  title="Outpatient Appointments"
  subtitle="Cardiology · 32 scheduled today · 4 awaiting confirmation"
  showBackButton
  onBack={() => router.back()}
  actions={
    <>
      <Button surface="dark" variant="outline" size="sm" leftIcon={<TPIcon name="filter" size={16} />}>
        Filter
      </Button>
      <Button surface="dark" variant="solid" size="sm" leftIcon={<TPIcon name="add" size={16} />}>
        New appointment
      </Button>
    </>
  }
/>
```

**Variants**
- **Sizes** — `sm` / `md` / `lg` (80 / 120 / 160px).
- **Tones** — `violet` (default) / `blue` / `slate` / `dark` token-only reskins.
- **WithSubtitle / WithBackButton** — title plus subtitle, optional back button.
- **CTAs · Text / Icon-only / Split / Three / All Shapes** — the `actions` slot in every Button shape, up to three CTAs (the kebab is just another icon-only CTA).
- **TitleSizes (18/24)**, **BottomRadius (0–42)**, **Eyebrow + align="top"**, **FullFeatured** — eyebrow, back button, pattern, and a split-button CTA together.
