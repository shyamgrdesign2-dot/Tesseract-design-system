# Tesseract UI — component catalog (v1.0)

The complete public surface of `tesseract-ui`: **17 atoms + 23 molecules + 8 charts = 48 components** (charts added in v1.0.4; RadarChart + GaugeChart in v1.0.5).
Every name links to its concise usage doc. All are imported from the package root:

```jsx
import { Button, DataTable, Drawer /* … */ } from "@dhspl-tatvacare/tesseract-ui";
import "@dhspl-tatvacare/tesseract-ui/styles.css"; // once, at app root
```

New to the system? Read [USING-TESSERACT.md](./USING-TESSERACT.md) (install + setup) and
[PREREQUISITE.md](./PREREQUISITE.md) (the v1.0 stability contract) first.

> **One component per job.** Tesseract deliberately ships *one* configurable component per
> role rather than many near-duplicates: **Button** is the only button (text / icon-only / split),
> **Dropdown** is the only select/menu, **DataTable** is the only list table, **DateRangePicker**
> is the only date/time picker, **SectionCard** is the container shell. Configure via props — don't fork.

---

## Atoms (17)

The smallest building blocks. Atoms compose only foundations (tokens) and other atoms.

| Component | What it is |
|---|---|
| [AnimatedGrid](./components/AnimatedGrid.md) | Decorative, themeable SVG lattice background with travelling comet pulses; reduced-motion-aware. |
| [Avatar](./components/Avatar.md) | Profile mark — image, initials, or icon — with optional presence dot and brand ring. |
| [Badge](./components/Badge.md) | Small non-interactive status pill — label, count, or dot annotating another element. |
| [Button](./components/Button.md) | The single button — text, icon-only, and split (primary + dropdown) via variant/theme/size. |
| [Checkbox](./components/Checkbox.md) | Tri-state checkbox (checked / unchecked / indeterminate) with optional built-in label. |
| [Chip](./components/Chip.md) | Interactive pill for selectable / removable / filter tokens (onClick toggle, onDelete dismiss). |
| [Divider](./components/Divider.md) | Thin rule between sections — horizontal/vertical, solid/gradient/dashed, optional inset + label. |
| [InputBox](./components/InputBox.md) | The single text-input — labels, icons, add-ons, tags, steppers, clear, validation, counter, auto-grow. |
| [InputOTP](./components/InputOTP.md) | One-time-code / PIN input with auto-advance, arrow-key nav, paste-to-fill (2FA, e-Rx sign-off). |
| [LoadingIndicator](./components/LoadingIndicator.md) | Indeterminate spinner for waits with no measurable progress (three glyph styles). |
| [Logo](./components/Logo.md) | Tatva brand marks (wordmark / symbol), masked SVG so one asset recolours per surface. |
| [Progress](./components/Progress.md) | Horizontal progress bar — determinate (0–100) or indeterminate sweep, full a11y. |
| [Radio](./components/Radio.md) | Single-select group — RadioGroup owns the value, each Radio is one option. |
| [SegmentedControl](./components/SegmentedControl.md) | Row of mutually-exclusive options with a sliding indicator (2–5 views/modes). |
| [Skeleton](./components/Skeleton.md) | Shimmering placeholder holding content shape while data loads (text/circular/rectangular). |
| [Slider](./components/Slider.md) | Single-thumb range input with optional label, live readout, ticks, tonal colours. |
| [Toggle](./components/Toggle.md) | Switch for an instant on/off setting that applies immediately — no Save step. |

## Molecules (23)

Composed surfaces and patterns. Molecules compose foundations, atoms, and other molecules.

### Inputs & forms
| Component | What it is |
|---|---|
| [DateRangePicker](./components/DateRangePicker.md) | The single date/time picker — single / range / month / year / time / date+time. Alias of DatePicker. |
| [Dropdown](./components/Dropdown.md) | The single select/menu — single/multi, searchable, combobox, grouped, footer CTAs, table-cell embed. |

### Data display
| Component | What it is |
|---|---|
| [DataTable](./components/DataTable.md) | The single list table — sort, paginate, select, sticky rows/columns, nesting, grouping, rich cells. |
| [ClinicalTable](./components/ClinicalTable.md) | Editable per-cell clinical grid for RxPad — inputs/dropdowns/search, drag-reorder, auto-growing draft row. |
| [Card](./components/Card.md) | Default surface container (Header/Title/Description/Content/Footer) with gradient/tone/interactive treatments. |
| [SectionCard](./components/SectionCard.md) | The container shell — titled, collapsible, recolourable, deeply nestable (forms, plan clusters, blocks). |
| [Pagination](./components/Pagination.md) | Controlled page navigation — prev/next + collapsing numbered pages. |

### Navigation
| Component | What it is |
|---|---|
| [Header](./components/Header.md) | The single top app bar — left cluster (back/logo/user/title) + right cluster of typed actions. |
| [Sidebar](./components/Sidebar.md) | Collapsible vertical nav rail — nested items, icon-rail flyouts, search, badges, active tracking. |
| [SecondarySidebar](./components/SecondarySidebar.md) | Gradient secondary rail (RxPad) of icon pills, collapsible 80px↔200px, for per-record context nav. |
| [Breadcrumb](./components/Breadcrumb.md) | Items-driven crumb trail for deep navigation, with icons, custom separator, middle-collapse. |
| [Tabs](./components/Tabs.md) | Tab navigation between peer panels — line/pill/segment variants, sizes, icons, count tags. |
| [Command](./components/Command.md) | ⌘K command palette — searchable, keyboard-navigable action list for global nav/quick actions. |

### Feedback & overlays
| Component | What it is |
|---|---|
| [Alert](./components/Alert.md) | Inline persistent status banner (allergy / interaction warnings, page notices). |
| [Toast](./components/Toast.md) | Transient status message — status icon, title, subtext, action, dismiss/auto-dismiss. |
| [Tooltip](./components/Tooltip.md) | Collision-aware hover/click tooltip — dark/light, arrow, dismiss, truncation-only mode. |
| [ConfirmDialog](./components/ConfirmDialog.md) | Header·Body·Footer modal for short blocking yes/no confirmations. |
| [Drawer](./components/Drawer.md) | Edge-anchored modal panel (filters, quick-views, forms, bottom sheets) with header/body/footer chrome. |
| [Empty](./components/Empty.md) | Centered empty-state — icon + title + description + optional actions/link (tables, lists, no-results). |

### Composition & motion
| Component | What it is |
|---|---|
| [Accordion](./components/Accordion.md) | Disclosure stack for skimmable sections — single/multiple open, comfortable/compact, configurable icon. |
| [Filter](./components/Filter.md) | One trigger → panel of grouped multi/single-select sections → removable chips, to narrow a DataTable. |
| [HeroBanner](./components/HeroBanner.md) | Dark gradient page-header band — eyebrow/title/subtitle, back button, up to three dark-surface CTAs. |
| [RxPadSection](./components/RxPadSection.md) | RxPad prescription-form section — icon/title header, action quartet, swappable table/text/fields body. |

---

## Charts (8)

Analytical / data-viz components — **zero-dependency** (pure SVG + own scales, geometry, and formatting; no chart library), token-only, responsive, deeply configurable. Added in **v1.0.4** (RadarChart + GaugeChart in **v1.0.5**).

| Component | What it is |
|---|---|
| [LineChart](./components/LineChart.md) | Multi-series trend/time chart — smooth/linear/step, area, markers, crosshair tooltip, legend toggle, zoom + pan, toolbar (CSV). |
| [BarChart](./components/BarChart.md) | Categorical comparison — grouped/stacked, vertical/horizontal, rounded value ends, value labels, tooltip, legend. |
| [DonutChart](./components/DonutChart.md) | Part-to-whole ring — center total, pad-angle, slice sort/stroke, hover-expand, legend value + %. |
| [PieChart](./components/DonutChart.md) | Full pie — `DonutChart` with no hole (`innerRadius=0`). |
| [Sparkline](./components/Sparkline.md) | Tiny axis-less inline trend for table cells / KPI tiles. |
| [StatCard](./components/StatCard.md) | KPI tile — value, tinted delta pill, inline sparkline; variant/size/icon controls. |
| [RadarChart](./components/RadarChart.md) | Multi-variable profile across 3+ axes — overlaid series polygons, grid rings, per-axis tooltip. |
| [GaugeChart](./components/GaugeChart.md) | Single value vs a range — rounded arc, threshold colouring, center readout (occupancy, utilisation). |

Convenience formatters are exported too: `formatCompact` (k/M/B), `formatIndian` (k/L/Cr), `formatNumber` — pass as `yFormat` / `valueFormat` / `format`.

---

## What v1.0 deliberately does NOT ship

These were consolidated away so there's one obvious choice per job. If you reach for one, use the replacement:

| You might want… | Use instead |
|---|---|
| `Field` | [InputBox](./components/InputBox.md) (label + helperText + status are built in) |
| `Menu` | [Dropdown](./components/Dropdown.md) |
| `Popover` | [Tooltip](./components/Tooltip.md) (click mode) or [Drawer](./components/Drawer.md) |
| `Timeline` | [SectionCard](./components/SectionCard.md) (nested, with leading slot) |
| `Kbd` | a styled `<kbd>` / [Badge](./components/Badge.md) |
| `Sheet` | [Drawer](./components/Drawer.md) (Sheet is a deprecated alias) |

## Foundations (not components, but part of the contract)

- **`TesseractThemeProvider`** — wraps the app; sets `colorScheme` (light/dark) and propagates the token ramp to portals.
- **Design tokens** — `--tesseract-*` (colour ramps, spacing, radius, typography). Theme by swapping the ramp, never by editing components.
- **Icons** — `TPIcon` / `TPLibraryIcon`; see [ICONS.md](./ICONS.md).
