# Tesseract Component Catalog

Every atom and molecule in `tesseract-ui`, with its purpose, the props a page author actually sets, and **when to reach for it**. Import everything from the barrels:

```jsx
import { Button, Badge, Chip, InputBox, InputOTP, Avatar, Divider, Toggle, Checkbox, Radio, RadioGroup, SegmentedControl, Slider, Progress, Skeleton, LoadingIndicator, Logo, TPIcon, TPLibraryIcon, TPMedicalIcon, AnimatedGrid } from "@/src/components/atoms";
import { DataTable, DataCell, Filter, Dropdown, Tabs, TabsList, TabsTrigger, TabsContent, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, SectionCard, Drawer, DrawerTrigger, DrawerContent, DrawerClose, Empty, Breadcrumb, Pagination, Command, Header, Sidebar, SecondarySidebar, ConfirmDialog, Toast, Tooltip, DateRangePicker, ClinicalTable, RxPadSection, HeroBanner } from "@/src/components/molecules";

// (Consumer apps import the same names from "@dhspl-tatvacare/tesseract-ui" instead — see design-system-and-brand.md, Case B.)
```

> The exact prop list of any component is in its source: `src/components/{atoms,molecules}/<Name>/<Name>.jsx` and `<Name>.stories.jsx`. This catalog is the decision map; read the story for precise APIs and edge props.

---

## Atoms (leaves)

| Component | Purpose | Key props | Use it when |
|-----------|---------|-----------|-------------|
| **Button** | The single CTA — text, icon, icon-only, and split-menu shapes all in one. | `variant` (solid/outline/ghost/tonal/link), `theme` (primary/neutral/error/success/warning), `size` (sm/md/lg), `surface` (light/dark), `leftIcon`/`rightIcon`/`icon`, `loading`, `disabled`, `menu` + `open`/`onOpenChange` (split), `onClick` | Any action. Primary page action = `variant="solid" theme="primary"`. Icon-only = pass `icon`. Dark surfaces (HeroBanner) = `surface="dark"`. |
| **Badge** | Status / count pill. | `variant` (solid/soft/outline/gradient/dot), `color` (primary/success/warning/error/neutral/violet), `size`, `icon`, `sticky` (left/right) | Status chips in table cells, counts on tabs/nav, "Trial"/"New" markers. `variant="dot"` for a bare signal dot. |
| **Chip** | Removable/selectable label. | `label`, `color`, `variant` (solid/soft/outline), `size`, `icon`, `onDelete`, `onClick` | Active filter tokens under a Filter bar, multi-select tags, "frequently used" suggestions. |
| **InputBox** | Text field with icons, addons, unit, counter, clearable, tags, auto-grow. | `size`, `status` (default/success/error/warning), `variant` (default/seamless), `label`, `helperText`, `leftIcon`/`rightIcon`, `clearable`, `loading`, `allow` (numeric/alpha/…), `value`/`onChange` | Search bars (`leftIcon` search + `clearable`), form fields, table-cell editors (`variant="seamless"`). |
| **InputOTP** | One-time-code / PIN input. | `length`, `value`/`onChange`, `onComplete`, `type` (numeric/text), `mask`, `disabled` | 2FA / OTP entry, e-prescription sign-off, PIN gates. |
| **Dropdown** *(molecule, listed here for forms)* | See molecules. | — | Select / combobox. |
| **Checkbox** | Tri-state checkbox. | `checked`/`defaultChecked`/`onCheckedChange`, `indeterminate`, `size`, `disabled`, `name`/`value` | Form booleans, "select all" header, multi-select rows. |
| **Radio / RadioGroup** | Single-select option(s). | RadioGroup: `value`/`onChange`/`name`/`orientation`; Radio: `value`/`label` | Mutually exclusive form choices. |
| **Toggle** | On/off switch. | `checked`/`onCheckedChange`, `size`, `shape` (rounded/square), `disabled` | Settings, feature flags, inline enable/disable. |
| **SegmentedControl** | Tab-like control with animated indicator. | `options` [{value,label}], `value`/`onValueChange`, `size`, `fullWidth` | In-page view switches (e.g. All / New / Follow-up), small filters that aren't full tabs. |
| **Slider** | Range input. | `value`/`onChange`, `min`/`max`/`step`, `color`, `size` | Numeric ranges, thresholds. |
| **Avatar** | Circular user/profile mark. | `src`, `name` (initials fallback), `icon`, `size`, `ring`, `onClick` | Patient/doctor identity in headers, table name cells, user menu. |
| **Divider** | Hairline rule. | `orientation`, `variant` (solid/gradient), `spacing`, `thickness` | Separating sections, toolbar groups. |
| **Skeleton** | Loading placeholder. | `variant` (text/rectangular/circular), `width`, `height`, `radius` | Loading states before data resolves (rows, cards, avatars). |
| **LoadingIndicator** | Spinner. | `type` (line-simple/line-spinner/dot-circle), `size`, `label` | Inline/async loading where a skeleton doesn't fit (inside buttons use Button `loading`). |
| **Progress** | Determinate/indeterminate bar. | `value` (0–100; omit for indeterminate), `tone`, `size`, `label` | Upload / step / completion progress. Indeterminate sweep = unknown-duration work. |
| **Logo** | Tatva brand mark. | `variant` (wordmark/symbol), `brand` (practice/care), `tone`, `height` | Header/Sidebar branding, print headers, hero. |
| **TPIcon / TPLibraryIcon** | CDN icons. `TPIcon` = curated set; `TPLibraryIcon` = any name. | `name`, `variant` (linear/bulk/bold/…), `size`, `color` | All iconography. Active nav/tab = `bulk`; default = `linear`. Recolour via `color` token. |
| **TPMedicalIcon** | Medical/health icon wrapper. | `name`, `variant`, `size`, `color` | Clinical sections (Symptoms, Vitals, Diagnosis…), RxPad module headers. |
| **AnimatedGrid** | Decorative animated lattice. | `lineColor`, `cometColor`, `edgeFade` | Hero/banner backgrounds only (already inside HeroBanner). |

---

## Molecules (whole regions)

| Component | Purpose | Key props | Use it when |
|-----------|---------|-----------|-------------|
| **Header** | Configurable top bar. | `back`/`onBack`, `logo`, `user` {name,meta,avatar,dropdown}, `title`/`subtitle`, `leading`, `actions` (typed array: cta/avatar/select/info/divider/node, max 8), `height` (default 62), `bordered` | Top of nearly every page. Right-side actions = the `actions` array. Patient/title context = `title`/`leading`. |
| **Sidebar** | Primary left navigation. | `items` [{id,label,icon,badge,children,disabled}], `activeId`, `onSelect`, `collapsed`/`onCollapsedChange`, `search`, `width`, `logoSlot`, `footerSlot` | App-level module nav. Collapsed = 80px icon rail with hover flyouts; expanded = labelled. Nested children supported. |
| **SecondarySidebar** | Blue-gradient context rail. | `items` [{id,label,icon,signal,badge,children}], `activeId`, `onSelect`, `collapsed`, `bottomFade`, `collapsedWidth`/`expandedWidth`, `showCollapseToggle`, `search` | Secondary context nav inside a module — e.g. patient-record tabs (Visit Summary, Vitals, Labs…) or RxPad sections. Often locked collapsed as an 80px rail. |
| **Tabs** | Horizontal tab strip + panels. | `value`/`defaultValue`/`onValueChange`, `size`; `TabsTrigger` {value, leftIcon, tag, tagTone} | In-page section switching (Queue/Finished/Cancelled; profile sub-views). Use `tag` for counts. |
| **Breadcrumb** | Wayfinding crumb trail. | `items` [{label, href, icon}], `separator`, `maxItems` (middle-collapse) | Deep navigation (Patients › Ramesh › Visit). Last item = current page. |
| **Command** | ⌘K command palette. | `open`/`onOpenChange`, `groups`/`items` [{label, icon, shortcut, onSelect}], `placeholder`, `emptyText` | Global quick-nav / quick-actions (⌘K). Searchable, keyboard-driven. |
| **DataTable** | The list/data table. | `columns` [{id, header, minWidth/width/maxWidth, sortable, sortAccessor, sticky:'right', align, cell:(row)=>node}], `data`, `rowKey`, `rowHeight` (xs/sm/md/lg/xl), `stickyHeader`, `sortable`, `defaultSort`/`onSortChange`, `selectable`/`selectionMode`/`selectedKeys`/`onSelectionChange`, `rowState`, `getSubRows`/`expandedKeys` (nesting), `groupBy`/`groupLabel`, `loading`, `hasMore`/`onLoadMore` (pagination), `emptyState` | Every list/index/report surface. Pair with `DataCell` for rich cells and `Filter` for filtering. |
| **DataCell** | Rich two-line table cell. | `primary`, `secondary`, `primaryLeftIcon`, `secondaryLeftIcon` | Name+MRN, label+meta cells inside DataTable columns. |
| **Pagination** | Page navigation. | `page`/`pageCount`/`onPageChange`, `siblingCount`, `showPrevNext` | Paged lists/tables/logs when not using infinite scroll (`DataTable hasMore`/`onLoadMore`). |
| **Filter** | Single entry-point filter panel. | `groups` [{id, label, options:[{value,label}]}], `value`/`defaultValue` ({groupId:[…]}), `onChange`, `label`, `icon` | The "Filter" button next to a DataTable. Selected options render as removable Chips below the bar. |
| **Dropdown** | Select / menu / combobox. | `options` (flat or grouped), `value`/`onChange`, `mode` (single/multi), `optionControl` (checkbox/radio), `chips`, `searchable`, `editable`, `variant` (default/seamless), `status`, footer actions | Form selects, filter selects, header `select` actions, table-cell editors (`variant="seamless"`). Multi-select with `chips`. |
| **DateRangePicker** | Calendar date/time picker. | `value`, `onChange`, `mode` (single/range/month/year/time/datetime), `showPresets`/`presets`, `minDate`/`maxDate`, `label`/`status` | Date filters (registration date, billing period — `mode="range"` with presets), form date fields. |
| **Accordion** | Disclosure sections. | `type` (single/multiple), `collapsible`, `value`/`onValueChange`; items via `AccordionItem`/`AccordionTrigger`/`AccordionContent` | Collapsible form sections, FAQ-style detail, mobile-collapsed groups. |
| **Card** | Default surface container. | compound: `Card` + `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`; `variant` (default/outline/elevated), `padding`, `tone`, `gradient` (+ light text), `interactive`, `radius` | Dashboards, patient/stat tiles, vitals panels, grouped content. Gradient tiles for hero/highlight (texture = an `AnimatedGrid` child — no decorative patterns). |
| **SectionCard** | The container shell — titled, collapsible, nestable. | `title`/`subtitle`/`icon`/`number`/`amount`, `tone`/`headerFill`, `tools`/`headerActions`, `footer`, `collapsible`/`defaultCollapsed`, `sticky`, `maxBodyHeight` (deeply nestable) | Form sections, plan clusters, dashboard blocks — any titled region with header/body/footer. |
| **ConfirmDialog** | Confirmation modal. | `open`/`onOpenChange`, `title`, `description`, `callout`/`calloutTone`, `primaryLabel`/`onPrimary`, `secondaryLabel`/`onSecondary`/`secondaryTone:'destructive'` | Destructive or important confirmations (delete patient, cancel appointment). Safe action = primary (right); destructive = secondary (left). |
| **Toast** | Inline status message. | `status` (info/success/warning/error), `title`, `children`, `action`, `dismissible`, `duration` | Post-action feedback ("Patient added"). Never red banners during a live consultation — see product rules. |
| **Tooltip** | Hover/click hint. | `content`, `side`, `align`, `variant` (dark/light), `trigger` (hover/click), `whenTruncated`, `maxWidth` | Icon-button labels, truncated-text reveals (`whenTruncated`), help hints. |
| **Drawer** | Edge-anchored modal panel. | compound: `Drawer` + `DrawerTrigger` + `DrawerContent` (+ `DrawerClose`); `open`/`onOpenChange`, `side` (right/left/top/bottom), `width`/`height`, `title`/`description`/`action`/`footer`, `showClose` | Slide-in filters, quick-view/edit forms, bill/plan preview, bottom-sheet actions. |
| **Empty** | Empty-state block. | `icon`/`iconSize`, `title`, `description`, `action`/`secondaryAction`, `link` {label,href} | No-results / empty tables, lists, sidebars. (DataTable `emptyState` composes this.) |
| **ClinicalTable** | Editable RxPad table — every cell is an input. | `columns`, `rows`/`defaultRows`/`onChange`, `name` (primary search col), `notes`, `reorderable`, `deletable`, `showRowMenu`, `autoRow` | The editable body of a prescription/clinical section. Usually via `RxPadSection`, not directly. |
| **RxPadSection** | A complete RxPad module container. | `title`, `icon`/`iconColor`, `columns`/`name`/`notes` or `fields`, `search`/`searchPlaceholder`, `frequentlyUsed`, `showRepeat`/`showTemplate`/`showSave`/`showClear` + handlers, `rows`/`onRowsChange` | Building a consultation/RxPad screen section (Symptoms, Medication, Advice…). Wraps ClinicalTable + toolbar + search. |
| **HeroBanner** | Dark gradient page hero with animated lattice. | `size` (sm/md/lg), `title`/`subtitle`, `titleSize`, `showBackButton`/`onBack`, `actions`, `bottomRadius` (max 42), `pattern` | Marketing/landing or module-intro headers. Actions render as dark-surface Buttons. |

---

## Choosing fast — region → component

- **Top bar** → `Header`
- **Left module nav** → `Sidebar`
- **Context rail / record tabs** → `SecondarySidebar` (or `Tabs` if horizontal)
- **Wayfinding crumb trail** → `Breadcrumb`
- **In-page view switch** → `Tabs` (many, with counts) or `SegmentedControl` (few, compact)
- **List / table of records** → `DataTable` (+ `DataCell`, + `Filter`)
- **Paged list** → `Pagination` (or DataTable `hasMore`/`onLoadMore` for infinite scroll)
- **Filter button** → `Filter`; **filter tokens** → `Chip`
- **Search field** → `InputBox` (`leftIcon` search, `clearable`)
- **OTP / PIN entry** → `InputOTP`
- **Date filter** → `DateRangePicker` (`mode="range"`, `showPresets`)
- **Select / combobox** → `Dropdown`
- **Primary/secondary action** → `Button`
- **Status in a cell** → `Badge`
- **Surface / tile** → `Card` (standalone tile) · **titled, nestable region** → `SectionCard`
- **Slide-in panel / quick-view** → `Drawer`
- **Command palette (⌘K)** → `Command`
- **Confirm destructive action** → `ConfirmDialog`
- **Post-action feedback** → `Toast`
- **Progress bar** → `Progress`
- **Editable clinical rows** → `RxPadSection` / `ClinicalTable`
- **Loading** → `Skeleton` (layout) / `LoadingIndicator` (inline) / Button `loading`
- **Empty state** → `Empty` (or DataTable `emptyState`, which composes it)
