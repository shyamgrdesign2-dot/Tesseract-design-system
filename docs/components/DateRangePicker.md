# DateRangePicker
> One Tesseract date/time picker — a real form field that opens a popover for single date, date range, month, year, time, or date+time, with quick-select presets and keyboard navigation.

**Import**
```jsx
// Canonical name is DatePicker; DateRangePicker is a kept back-compat alias.
import { DatePicker } from "@dhspl-tatvacare/tesseract-ui";
// or: import { DateRangePicker } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — Any date/time entry in a form or filter bar: DOB, appointment slot, billing month, financial year, or a start–end reporting range (the `mode="range"` story drives EMR analytics filters).
**When not** — For free typing of a known date without a calendar, use a plain text `Input` with a date mask instead.

**Key props**

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `mode` | `"single" \| "range" \| "month" \| "year" \| "time" \| "datetime"` | `"single"` | Which picker chrome opens. |
| `value` / `onChange` | mode-dependent / `(result) => void` | — | `result` carries `mode`, the parsed value, and a display `label`. |
| `months` | `1 \| 2` | `2` for range | Calendars shown side by side (range only). |
| `showPresets` | `boolean` | `true` for range | Quick-select rail (Today, Past 7 days, This month…). |
| `minDate` / `maxDate` / `isDateDisabled` | `Date` / `Date` / `(day) => boolean` | — | Constrain or per-day disable. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Field density — use `"sm"` in compact toolbars. |
| `label` / `helperText` / `status` / `required` | `string` / `string` / `"error"\|"success"\|"warning"` / `boolean` | — | Form-field chrome. |
| `commitMode` | `"outside-click" \| "apply"` | `"outside-click"` | Whether clicking away commits the staged selection. |
| `locale` / `weekStartsOn` | BCP-47 string / `0 \| 1` | `"en-IN"` / `1` (Mon) | i18n formatting and week start. |

**Example**
```jsx
function ReportFilter() {
  const [range, setRange] = useState("last-30"); // a preset id, or { start, end }
  return (
    <DatePicker
      mode="range"
      label="Report period"
      value={range}
      onChange={(r) => setRange(r.presetId || r.range)}
    />
  );
}
```

**Variants**
- Single date — basic DOB / appointment date field.
- Range — single month (no presets) and two months + presets.
- Month picker / Year picker — billing month, financial year.
- Time / Date + Time — appointment time, "Starts at".
- Field states — label · helper · required · error status.
- Sizes — sm · md · lg.
- Constraints — min/max plus weekday-only disabling.
- Week starts on Sunday, Relabeled footer + locale (fr-FR), Controlled.

> Colours, spacing, radii and the popover chrome all come from `--tesseract-*` tokens (the footer reuses the Tesseract `Button`); consumers never hardcode hex or px.
