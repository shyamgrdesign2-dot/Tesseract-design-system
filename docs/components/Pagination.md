# Pagination
> Controlled page navigation for paged result sets — prev/next plus numbered page buttons that collapse long ranges to `first … window … last`.

**Import**
```jsx
import { Pagination } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — navigating paged lists, tables, and audit logs (patient lists, billing, logs); pairs naturally with DataTable.
**When not** — for infinite/lazy scrolling use DataTable's infinite mode; to step a single numeric value use a counter Input.

**Key props**

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `page` | `number` | `0` | Current page, **0-indexed** (controlled). |
| `pageCount` | `number` | `1` | Total number of pages. |
| `onPageChange` | `(page) => void` | — | Fires with the next 0-indexed page on prev / next / page click. |
| `siblingCount` | `number` | `1` | Pages shown on each side of the current page before collapsing. |
| `size` | `"sm" \| "md"` | `"md"` | Compact (`sm`) vs default button sizing. |
| `className` / `style` / `...rest` | — | — | Spread onto the `<nav>`. |

Colours, spacing, and the active-page tonal/primary fill all come from `--tesseract-*` tokens (it composes the Button atom) — don't hardcode. Active page gets `aria-current="page"`; prev/next auto-disable at the ends.

**Example**
```jsx
function PatientListFooter() {
  const [page, setPage] = React.useState(0);
  return (
    <Pagination
      page={page}
      pageCount={12}
      onPageChange={setPage}
    />
  );
}
```

**Variants**
- **Playground** — full controls (pageCount, siblingCount, size).
- **FewPages** — 4 pages, no collapsing / ellipsis.
- **Small** — `size="sm"` compact buttons over a long (20-page) range.
