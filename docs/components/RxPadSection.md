# RxPadSection
> One section of an RxPad prescription form — header (icon + title + action quartet) over a swappable body (table / free-text / labelled fields), with search and "frequently used" quick-add chips.

**Import**
```jsx
import { RxPadSection } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — building a prescription / clinical-note section (Symptoms, Diagnosis, Advice, Follow-up); stack several to compose a full pad.
**When not** — a generic editable grid with no RxPad chrome — use `ClinicalTable` (or `DataTable`) directly.

**Key props**

| prop | type | default | what it does |
| --- | --- | --- | --- |
| `title` | string | `"Symptoms"` | Section heading. |
| `icon` / `iconColor` | string / color | `"virus"` / violet token | Header icon (`"variant/name"`, e.g. `"bulk/virus"`) and its colour. |
| `bodyType` | `"table"` \| `"text"` \| `"fields"` | `"table"` | Body renderer: `ClinicalTable` · free-text · labelled inputs. |
| `mode` | `"table-first"` \| `"search-first"` | `"table-first"` | Body above search, or search above body. |
| `columns` / `fields` / `defaultRows` | array | `[]` | Table columns / field defs / initial rows. |
| `frequentlyUsed` | string[] | `[]` | Quick-add chip labels (hidden once already added). |
| `showRepeat`/`showTemplate`/`showSave`/`showClear` | bool | `true` | Toggle the default header action quartet. |
| `headerActions` | array \| node | — | Replace the quartet (array of `{ icon, tip, variant, onClick }`). |
| `headerMeta` | node | — | Right-aligned slot (e.g. a status `Badge`). |
| `loading` | bool | `false` | Skeleton rows instead of body. |
| `collapsible` / `defaultCollapsed` | bool | `false` | Chevron hides the body; header stays. |
| `rows` / `onRowsChange` | array / fn | uncontrolled | Controlled table rows. |

Colours, spacing, and the icon chip all come from `--tesseract-*` tokens — don't hardcode. Every glyph (header, repeat, template, save, clear, search, drag, more, delete, duplicate) is an individually configurable icon slot.

**Example**
```jsx
<RxPadSection
  title="Symptoms"
  icon="bulk/virus"
  columns={[
    { id: "since",  header: "Since",  type: "text",   placeholder: "e.g. 2 days" },
    { id: "status", header: "Status", type: "select", options: ["Mild", "Moderate", "Severe"] },
  ]}
  frequentlyUsed={["Fever", "Headache", "Vomiting"]}
  defaultRows={[{ id: "r1", name: "Diarrhea", since: "2 days", status: "Moderate" }]}
  onSave={() => saveTemplate()}
/>
```

**Variants**
- **Playground** — default table body, table-first.
- **EmptyState** — no rows, shows the auto-row affordance.
- **SearchFirst** — search box above the body (`mode="search-first"`).
- **FreeText** — `bodyType="text"` clinical-notes textarea.
- **CustomFields** — `bodyType="fields"` labelled inputs (e.g. Follow-up).
- **CustomHeaderActions** — `headerActions` array + `headerMeta` Badge replacing the quartet.
- **LoadingAndEmpty** — skeleton rows + custom `emptyState`.
- **Collapsible** — body hides behind a chevron, header stays.
