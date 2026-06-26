# Slider
> A single-thumb range input for picking one number along a continuous or stepped scale.

**Import**
```jsx
import { Slider } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — choosing a magnitude where the slider position itself is meaningful: a pain score, a dosage, a volume/threshold filter. Add `showValue` when the exact figure matters.
**When not** — a small fixed set of choices → `SegmentedControl`/`Radio`; a free-form number → `InputBox type="number"`.

**Key props**

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `value` / `defaultValue` | number | — | Controlled value (with `onChange`) or uncontrolled initial value |
| `onChange` | `(event, value) => void` | — | Fires on drag/keys — **value is the 2nd arg** |
| `min` / `max` / `step` | number | `0` / `100` / `1` | Bound and quantise the scale (use a fraction for decimals) |
| `color` | `primary \| success \| warning \| error` | `primary` | Track + thumb tone |
| `size` | `sm \| md \| lg` | `md` | Track thickness / thumb size |
| `label` | node | — | Caption above the track (also the a11y name) |
| `showValue` / `formatValue` | bool / `(v) => node` | `false` / `(v)=>v` | Live readout and its formatter |
| `marks` | `true \| {value,label}[]` | `false` | `true` = min & max ticks, or an explicit array |
| `error` | bool | `false` | Error styling, e.g. value past a safe limit |
| `disabled` | bool | `false` | Non-interactive, dimmed |

Colours (`--tesseract-blue/success/warning/error-500`) and spacing come from `--tesseract-*` tokens — never hardcode. Always pass `label` (or `ariaLabel` if no visible label) since the thumb is keyboard-driven.

**Example**
```jsx
const [pain, setPain] = useState(3);
const tone = pain <= 3 ? "success" : pain <= 6 ? "warning" : "error";

<Slider
  label="Pain intensity"
  color={tone}
  min={0}
  max={10}
  step={1}
  value={pain}
  onChange={(_e, v) => setPain(v)}
  showValue
  formatValue={(v) => `${v} / 10`}
  marks={[{ value: 0, label: "No pain" }, { value: 10, label: "Worst" }]}
/>
```

**Variants** — Sizes (sm/md/lg) · Colors · WithLabelAndValue · WithMarks (boolean or array) · Steps · Disabled · 🩺 Pain Scale (0–10) · 💊 Dosage Adjustment (error past safe max) · ⚖️ BMI Range Filter.
