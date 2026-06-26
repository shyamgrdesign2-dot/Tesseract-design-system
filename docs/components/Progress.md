# Progress
> A horizontal progress bar for determinate task progress (0–100) or an indeterminate animated sweep.

**Import**
```jsx
import { Progress } from "tesseract-ui";
```

**When to use** — Show how far a task has gotten: file upload, import, sync, or treatment-plan completion. Omit `value` for an indeterminate sweep when the duration is unknown.
**When not** — For a spinner use `LoadingIndicator`; for placeholder loading blocks use `Skeleton`.

**Key props**
| prop | type | default | what it does |
| --- | --- | --- | --- |
| `value` | `number \| null` | `null` | 0–`max`; omit/null renders the indeterminate sweep |
| `max` | `number` | `100` | Value scale; fill width = `value / max` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Track height (use `sm` for dense rows) |
| `tone` | `"primary" \| "success" \| "warning" \| "error"` | `"primary"` | Fill colour, all from `--tesseract-*` tokens |
| `label` | `string` | — | Accessible name (`aria-label`) for the bar |
| `className` / `style` | — | — | Spread to the root track element |

Colours, track height, and spacing come from `--tesseract-*` tokens — don't hardcode. Renders `role="progressbar"` with `aria-valuenow/min/max`; the indeterminate sweep honors `prefers-reduced-motion`.

**Example**
```jsx
<Progress value={64} max={100} tone="primary" label="Uploading lab report" />

{/* Indeterminate while the import runs */}
<Progress label="Importing patient records…" />
```

**Variants**
- **Playground** — single configurable bar.
- **Tones** — primary, success (complete), warning, error fills.
- **Sizes** — sm · md · lg track heights.
- **Indeterminate** — animated sweep for unknown duration.
