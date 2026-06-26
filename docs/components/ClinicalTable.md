# ClinicalTable
> An editable, row-by-row clinical data grid for RxPad modules (symptoms, vitals, meds…) where every cell is its own input, dropdown, or search combobox.

**Import**
```jsx
import { ClinicalTable } from "tesseract-ui";
```

**When to use** — Capturing structured clinical entries the clinician types/picks inline (Name → configurable columns → Notes), with drag-reorder, per-cell validation, and an auto-growing draft row.
**When not** — For read-only / sortable / paginated data display, use `DataTable` (or `Table`) instead.

**Key props**

| prop | type | default | what it does |
|---|---|---|---|
| `columns` | `Column[]` | `[]` | Configurable middle columns between Name and Notes. Each: `{ id, header, type, options, validate, ... }`. `type` ∈ `text\|number\|date\|select\|search\|multiselect\|combo`. |
| `rows` / `defaultRows` | `Row[]` | `[]` | Controlled / uncontrolled row data: `{ id, [colId]: value }`. |
| `onChange` | `(rows) => void` | — | Fires on any cell edit, add, delete, or reorder. |
| `name` / `notes` | `Column` / `Column\|false` | sensible defaults | Override the mandatory Name (primary search) and Notes columns; `notes={false}` drops Notes. |
| `primaryKey` | `string` | Name col id | Column id that gates a row and opens the next draft row. |
| `density` | `"comfortable"\|"compact"` | `"comfortable"` | Row/header height + padding — use `"compact"` for dense tables. |
| `reorderable` / `deletable` / `showRowMenu` | `boolean` | `true` | Drag handle, delete button, and `⋯` row-actions menu. |
| `autoRow` | `boolean` | `true` | Keep one empty draft row to type into. |
| `loading` / `loadingRows` | `boolean` / `number` | `false` / `4` | Render skeleton rows instead of data. |
| `stickyHeader` / `stickyFirst` / `stickyLast` / `maxHeight` | `boolean` / `number\|string` | `false` | Pin header / first / last column on scroll; cap height for vertical scroll. |

Per-column `validate(value, row) => "success"\|"error"\|"warning"` rings a cell; `render(value, row)` is a read-only escape hatch. All colours/spacing come from `--tesseract-*` tokens — never hardcode.

**Example**
```jsx
<ClinicalTable
  defaultRows={[{ id: "s1", name: "Chest pain", since: "2 days", status: "Moderate" }]}
  columns={[
    { id: "since", header: "Since", type: "combo", options: ["1 day", "2 days", "1 week"], allowCustom: true },
    { id: "status", header: "Status", type: "select", options: ["Mild", "Moderate", "Severe"] },
  ]}
  density="compact"
  onChange={(rows) => save(rows)}
/>
```

**Variants** (Storybook → Molecules/ClinicalTable)
- **Playground** / **Column Configurator** / **Configuring Columns** — live-build columns and cell types.
- **All Cell Types** — text, number, date, select, search, multiselect, combo in one table.
- **Compact** — dense density. **Sticky Actions** / **Sticky Header** — pinned action column / header.
- **Loading** — skeleton rows. **Empty** / **Empty State** — no-data fallbacks.
- **Custom Render And Config** — read-only `render` cells. **Flagged Custom Entry** — ring non-listed Name entries.
