# Divider
> A thin rule that separates content — horizontal between stacked sections, or vertical between inline items.

**Import**
```jsx
import { Divider } from "tesseract-ui";
```

**When to use** — Splitting a list/card into labelled sections, separating inline meta (`Left | Mid | Right`), or an "OR" break between two choices via `label`.
**When not** — If whitespace alone reads as a boundary, use spacing; a heavy structural edge is a container `border`, not a Divider.

**Key props**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Rule direction. Vertical needs a sized parent (e.g. a flex row with a height) to stretch into. |
| `variant` | `"solid" \| "gradient"` | `"solid"` | Flat bar, or a line that fades to transparent at both ends. |
| `lineStyle` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | Rule rendering — filled bar vs. dashed/dotted border. |
| `color` | string | `--tesseract-slate-200` | Line colour — any `--tesseract-*` token or CSS value. Don't hardcode hex. |
| `thickness` | number | `1` | Line weight in px. |
| `spacing` | number | `0` | Margin before & after the rule (px). |
| `inset` | `number \| {start,end}` | `0` | Indents the line from its ends (px). `0` = full-bleed. |
| `label` | node | — | Caption rendered between two line segments (horizontal only; ignored on vertical). |
| `labelPosition` | `"center" \| "start" \| "end"` | `"center"` | Where the label sits along the line. |

Colours and spacing resolve from `--tesseract-*` tokens — consumers pass tokens, not raw values.

**Example**
```jsx
// Patient summary card split into sections
<div style={{ border: "1px solid var(--tesseract-slate-200)", borderRadius: "var(--tesseract-radius-12)" }}>
  <Section title="Vitals">…</Section>
  <Divider variant="gradient" />
  <Section title="Medications">…</Section>
  <Divider inset={{ start: 48, end: 0 }} />
  <Section title="Allergies">…</Section>
</div>
```

**Variants**
- **Line styles** — solid (default), dashed, dotted.
- **Labelled** — `label` with center / start / end position (e.g. "OR", "Recent", "Older"); works with dashed lines too.
- **Inset** — full-bleed vs. inset both ends vs. start-only (align to list text).
- **Solid** — token/brand/error colours and thicker (2px) rules.
- **Gradient** — fades at ends; horizontal & vertical, brand/error colours, on dark backgrounds.
- **Vertical** — inline separators inside a sized flex row.
- **In Context** — gradient dividers separating sections of an EMR record card.
