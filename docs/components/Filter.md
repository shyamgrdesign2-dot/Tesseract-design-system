# Filter
> One trigger that opens a single panel of grouped, multi-select sections; chosen options surface as removable chips in an active bar below.

**Import**
```jsx
import { Filter } from "tesseract-ui";
```

**When to use** — Narrowing a `DataTable` by several facets at once (status, doctor, type); pass a different `groups` config per table. **When not** — A single binary or one-axis choice (use a Checkbox / segmented control); date ranges go to `DateRangePicker`.

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `groups` | `[{ id, label, type?, options: [{ value, label }] }]` | `[]` | Section config. `type`: `"multi"` (default, checkboxes) or `"single"` (radio, one value). |
| `value` | `{ [groupId]: string[] }` | — | Controlled selection map, keyed by group `id`. |
| `defaultValue` | `{ [groupId]: string[] }` | `{}` | Uncontrolled initial selection. |
| `onChange` | `(selection) => void` | — | Fires with the full selection map on change. |
| `mode` | `"live" \| "apply"` | `"live"` | `live` = immediate `onChange`; `apply` = stage a draft, fire on Done. |
| `label` | `string` | `"Filter"` | Trigger text (also prefixes the active bar). |
| `icon` | `ReactNode` | funnel glyph | Trigger icon. |
| `width` / `maxHeight` | CSS length | 240px min / 360px | Panel sizing. |
| `clearLabel` / `doneLabel` | `string` | `"Clear all"` / `"Done"` | Reset + confirm labels. |

Colours and spacing come from `--tesseract-*` tokens — don't hardcode.

**Example**
```jsx
const GROUPS = [
  { id: "status", label: "Status", options: [
    { value: "Confirmed", label: "Confirmed" }, { value: "Waiting", label: "Waiting" },
  ] },
  { id: "doctor", label: "Doctor", options: [
    { value: "Dr. Mehra", label: "Dr. Mehra" }, { value: "Dr. Sharma", label: "Dr. Sharma" },
  ] },
];

function AppointmentsFilter() {
  const [sel, setSel] = React.useState({ status: ["Waiting"] });
  const rows = DATA.filter((r) =>
    GROUPS.every((g) => !sel[g.id]?.length || sel[g.id].includes(r[g.id])),
  );
  return (
    <>
      <Filter groups={GROUPS} value={sel} onChange={setSel} />
      <DataTable columns={columns} data={rows} />
    </>
  );
}
```

**Variants**
- **Playground** — multi-select sections (Status · Doctor · Type), live mode.
- **Single-select section** — a `type: "single"` (radio) section above multi-select ones.
- **Apply mode (staged)** — toggles stage a draft; `onChange` fires only on Apply/Done.
- **Filter + DataTable** — selection filters the table rows; empty state when no match.
