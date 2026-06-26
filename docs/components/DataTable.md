# DataTable
> The single configurable table molecule for list surfaces — column-config driven, with sorting, pagination, selection, sticky rows/columns, nesting, grouping, and rich cells. First-party, no external deps.

**Import**
```jsx
import { DataTable, DataCell, CellTag, TableActions } from "tesseract-ui";
```

**When to use** — Any tabular list surface (patient lists, appointments, billing rows, lab results). Drive it with a `columns` config + `data`; use the `type`-based columns so backend data maps straight in.
**When not** — For a few key/value pairs or a non-list detail layout, use `SectionCard` / a description list, not a table.

**Key props**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `columns` | `Column[]` | — | Column config (see below). |
| `data` | `object[]` | — | Row data. |
| `rowHeight` | `"xs"\|"sm"\|"md"\|"lg"\|"xl"` | `"lg"` | Row **density** (compact → roomy). |
| `sortable` | `boolean` | `false` | Show sort affordances; columns opt in with their own `sortable`. |
| `pageSize` | `number` | — | Enables pagination + rows-per-page selector when set. |
| `selectionMode` | `"none"\|"single"\|"multiple"` | `"none"` | Leading radio / checkbox + select-all column. |
| `selectionToolbar` | `(keys, clear) => node` | — | Bulk-action bar shown above the table when ≥1 row selected. |
| `stickyHeader` | `boolean` | `false` | Pin header while body scrolls (auto-applies a maxHeight). |
| `stickyFirst` / `stickyLast` | `boolean\|1\|2` | `0` | Auto-pin the first/last N columns to the edge. |
| `getSubRows` | `(row) => row[]` | — | Expandable nested tree rows. |
| `groupBy` | `(row, i) => value` | — | Collapsible group headers. |
| `loading` + `loadingVariant` | `boolean`, `"skeleton"\|"overlay"` | `false`, `"skeleton"` | Shimmer rows (default) or centered spinner over dimmed rows. |
| `error` / `onRetry` | `boolean\|node`, `()=>void` | `false` | Distinct error row with optional Retry. |

**Column object** — `{ id, header, type?: "text"|"tag"|"action", width?, minWidth?, maxWidth?, expand?, align?, sticky?: "left"|"right", sortable?, sortAccessor?, primary?, secondary?, tag?, actions?, cell? }`. `type` drives declarative rendering; `cell(row, i)` is the escape hatch. `expand: true` lets a column soak up leftover width (use for the free-text column). Sticky columns need a `width`.

**Example**
```jsx
const columns = [
  { id: "name", header: "Patient", sortable: true,
    primary: (r) => r.name, secondary: (r) => r.mrn },
  { id: "appt", header: "Appointment", type: "text", primary: (r) => r.appt },
  { id: "status", header: "Status", type: "tag",
    tag: (r) => ({ label: r.status, tone: r.status === "No-show" ? "error" : "success" }) },
  { id: "actions", header: "", type: "action", sticky: "right", width: 96,
    actions: (r) => (
      <TableActions
        actions={[{ icon: "edit", label: "Edit", onClick: () => edit(r) }]}
      />
    ) },
];

<DataTable
  columns={columns}
  data={appointments}
  rowHeight="md"
  sortable
  pageSize={10}
  selectionMode="multiple"
  selectionToolbar={(keys, clear) => <BulkBar count={keys.length} onClear={clear} />}
  stickyHeader
/>
```
Colours, spacing, tints and tones (tag tones, row states, zebra, hover) all resolve from `--tesseract-*` tokens — never hardcode hex or px in column configs.

**Variants**
- Playground / Column Configurator / Single Column Configurator — live knob-driven builders.
- Declarative Columns (type-driven), Truncation Rule (subtext vs none).
- Row Selection, Selection (single · multiple · disabled), Selection Toolbar (bulk actions).
- Sticky Header + Lazy Load, Scroll + Sticky Shadow, Sticky Columns (left+right), Sticky Columns (stickyFirst/stickyLast).
- Nested Rows (expandable tree), Grouped Rows (collapsible), Spanning Rows (merged cells).
- Row States (info · success · warning · error · reference).
- Loading (overlay variant), Error State (with Retry), Action Tracking (analytics).
