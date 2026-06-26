# Empty
> A centered empty-state (icon/illustration + title + description + optional actions) for tables, lists, sidebars, and search no-results.

**Import**
```jsx
import { Empty } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — "no records yet", "no matches", "nothing scheduled": orient the user and offer a next step.
**When not** — transient feedback → Toast; loading state → Skeleton / LoadingIndicator.

**Key props**

| prop | type | default | what it does |
|------|------|---------|--------------|
| `icon` | string (name) \| node | — | Leading glyph in a soft tinted disc; ignored when `media` is set |
| `media` | ReactNode | — | Custom illustration; overrides `icon` |
| `title` | ReactNode | — | Heading |
| `description` | ReactNode | — | Supporting copy under the title |
| `action` | ReactNode | — | Primary CTA (compose a `Button`) |
| `secondaryAction` | ReactNode | — | Second CTA shown beside `action` |
| `link` | `{ label, href?, onClick? }` | — | Text hyperlink CTA under the actions |
| `size` | `"sm"` \| `"md"` | `"md"` | Compact (sidebar/card) vs default scale |
| `iconSize` | number (px) | by `size` | Glyph size; the disc scales with it |

Colours and spacing come from `--tesseract-*` tokens — don't hardcode. Root has `role="status"` so assistive tech announces the state.

**Example**
```jsx
<Empty
  icon="profile-2user"
  title="No patients yet"
  description="Add your first patient to start managing appointments and records."
  action={<Button leftIcon={<TPLibraryIcon name="add-square" size={18} />}>Add patient</Button>}
  secondaryAction={<Button variant="outline" theme="neutral">Import CSV</Button>}
/>
```

**Variants**
- Playground — icon + title + description + primary action.
- NoResults — search "no matches", no action.
- Small — `size="sm"` for inside a card or sidebar.
- TwoActions — primary + secondary CTA.
- WithLink — action plus a text hyperlink (`link` prop).
- IconSizes — disc scales with `iconSize` (20 / 28 / 40 px).
