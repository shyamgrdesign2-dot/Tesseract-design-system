# Dropdown
> The single select/menu molecule — single- or multi-select, searchable, editable combobox, grouped, or embedded in a table cell.

**Import**
```jsx
import { Dropdown } from "tesseract-ui";
```

**When to use** — Any selection surface: a single picker, a multi-select with chips/checkboxes, a searchable list, a typeahead combobox, or a borderless select inside a table cell.
**When not** — For a free-text field with no option list, use `InputBox`.

**Key props**

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `options` | `[{value,label,subtitle?,icon?,shortcut?,disabled?}]` or grouped `[{heading,options}]` | `[]` | Flat list or sections with headings |
| `value` / `defaultValue` | `string \| string[]` | — | Controlled / uncontrolled selection (array in multi) |
| `onChange` / `onCommit` | `(next) => void` | — | `onChange` = every change incl. typing; `onCommit` = deliberate pick |
| `mode` | `"single" \| "multi"` | `"single"` | Single value or multiple |
| `optionControl` | `"none" \| "checkbox" \| "radio"` | `"none"` | Per-row indicator |
| `searchable` | `boolean` | `false` | In-popover search box |
| `editable` | `boolean` (+ `allowCustom`) | `false` | Trigger is a typeahead input; allowCustom offers an "Add ‹q›" row |
| `chips` | `boolean` | `false` | Multi: selected shown as removable chips in the trigger |
| `variant` | `"default" \| "seamless"` | `"default"` | `seamless` = borderless, fills a table cell (+ `status`, `chevron={false}`) |
| `clearable` | `boolean` | `false` | Single-select clear (×) affordance |
| `width` | `"trigger" \| "auto" \| number` | `"trigger"` | Menu width |

Footer extras: `footerHint` (keyboard bar), `primary/secondary/tertiaryAction` (up to 3 Button CTAs), `loading`, `renderOption`. Colours/spacing come from `--tesseract-*` tokens — never hardcode.

**Example**
```jsx
<Dropdown
  label="Frequency"
  mode="single"
  clearable
  options={[
    { value: "od",  label: "Once daily" },
    { value: "bid", label: "Twice daily" },
    { value: "tid", label: "Three times daily" },
    { value: "prn", label: "As needed", subtitle: "pro re nata" },
  ]}
  value={freq}
  onCommit={setFreq}
/>
```

**Variants** — Single-select · Uncontrolled · Multi-select (checkmarks) · Multi + checkboxes · Single + radio · Multi → chips in trigger · Searchable · Keyboard shortcuts · Title + subtitle · Left + right item icons · Footer shortcut bar + CTAs · Three footer CTAs · CTA alignment · Sections with headings · Editable combobox (+ add custom) · Clearable · Placement (auto/bottom/top) · renderOption avatar rows · Async loading · Adjustable width.
