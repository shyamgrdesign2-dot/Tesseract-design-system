# LoadingIndicator
> An indeterminate spinner for waits with no measurable progress, in three glyph styles.

**Import**
```jsx
import { LoadingIndicator } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — Short or open-ended waits where you can't show how much is left: a button in flight, a lazy-loading table, an inline "fetching…" next to a label.
**When not** — When the loading content has a known shape use `Skeleton` (no layout jump); for measurable progress use a progress bar.

**Key props**

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `type` | `"line-simple" \| "line-spinner" \| "dot-circle"` | `"line-simple"` | Spinner glyph style. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| number` | `"md"` | Glyph size (px); compact `xs`/`sm` for inline use. |
| `label` | `string` | — | Caption beside the glyph; also the a11y status text. |
| `labelPosition` | `"end" \| "bottom"` | `"end"` | Where the label sits relative to the glyph. |
| `speed` | `"slow" \| "normal" \| "fast" \| number` | `"normal"` | Spin speed; a number sets duration in seconds. |
| `color` | token / CSS color | `"inherit"` | Recolours the glyph (it paints in `currentColor`). |

Colours, spacing and motion come from `--tesseract-*` tokens — don't hardcode. The glyph inherits the parent's text colour by default (set `color` only to override), so it auto-tints inside a Button. Motion respects `prefers-reduced-motion`. Omitting `label` still emits a hidden "Loading" for screen readers.

**Example**
```jsx
<LoadingIndicator type="line-simple" size="sm" label="Fetching patient records…" />
```

**Variants**
- Default — the three glyphs (`line-simple`, `line-spinner`, `dot-circle`) side by side.
- Sizes — `xs` / `sm` / `md` / `lg`.
- Colors — glyph follows `currentColor` (blue / error / slate).
- Playground — interactive controls with copy-paste snippet.
