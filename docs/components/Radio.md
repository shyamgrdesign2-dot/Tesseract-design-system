# Radio
> A single-select control group — `RadioGroup` owns the value and each `Radio` is one mutually-exclusive option.

**Import**
```jsx
import { Radio, RadioGroup } from "@dhspl-tatvacare/tesseract-ui";
// FormControlLabel is also exported for pairing a custom control with a label.
```

**When to use** — Pick exactly one from a small, visible set (appointment type, gender, reminder channel, urgency).
**When not** — Multiple selections → use **Checkbox**; instant on/off → use **Toggle**; many options → a select/dropdown scales better.

**Key props**

`RadioGroup` (owns selection):

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `value` | string | — | Selected option's value (controlled). |
| `onChange` | `(value) => void` | — | Called with the newly selected value. |
| `name` | string | — | Shared input name; set on the group, not each radio. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Stack or lay out in a row. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control size; inherited by children. |
| `color` | `"primary" \| "success" \| "error" \| "warning"` | `"primary"` | Accent ramp (primary = blue). |
| `gap` | number (px) | token default | Override spacing between options. |
| `error` | boolean | `false` | Invalid styling — accent + labels shift to the error ramp. |

`Radio` (one option):

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `value` | string | — | This option's value. |
| `label` | node | — | Inline label text. |
| `description` | node | — | Smaller helper text stacked under the label. |
| `disabled` | boolean | `false` | Disable this single option. |
| `color` | semantic | inherits group | Override the group accent for this radio. |

Sizing, colours, and spacing all resolve from `--tesseract-*` tokens — don't hardcode hex or pixel values.

**Example**
```jsx
const [type, setType] = useState("in-person");

<RadioGroup name="appt-type" value={type} onChange={setType}>
  <Radio value="in-person" label="In-person" />
  <Radio value="teleconsult" label="Teleconsult (Video)" />
  <Radio value="phone" label="Phone call" />
  <Radio value="home-visit" label="Home visit" />
</RadioGroup>
```

**Variants**
- **Playground** — all group controls (size/orientation/color/gap/error/disabled).
- **Sizes** — sm · md · lg.
- **HorizontalLayout** — row orientation.
- **Colors** — primary / success / error / warning accents.
- **WithDescription** — helper text under each label.
- **WithDisabledOption** — disable a single option.
- **ErrorState** — group `error` flag + helper message.
- **AppointmentType / PatientGender / ConsultationUrgency / FollowupReminder** — EMR/clinic patterns.
