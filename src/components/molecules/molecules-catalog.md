# Molecules — catalog

> **Scope:** every composed-but-still-generic component in `src/components/molecules/`.
> **Audience:** designers (which composed pattern fits this layout?), frontend devs (compose features without reinventing dialogs/tables/etc.), PMs (vocabulary), AI assistants (avoid recreating existing patterns).
> **Read when:** you need a dialog, table, drawer, banner, calendar, command palette, etc. — check here before building one.
> **Sibling docs:** [`../atoms/atoms-catalog.md`](../atoms/atoms-catalog.md) · [`../../design-system/design-tokens-and-theme.md`](../../design-system/design-tokens-and-theme.md).

Composed UI patterns built from atoms. **Still domain-agnostic** — a
molecule could ship in a generic UI library.

> **Import rule:** molecules may import atoms + sibling molecules + the shared overlay primitives in [`@/src/hooks/ui/`](../../hooks/ui/) + `@/src/hooks/utils` + design tokens. **No `@radix-ui/*` or other third-party UI lib** — every molecule is hand-rolled.

> **Zero Radix:** `Dialog`, `ConfirmDialog`, `Tabs`, `Accordion` all hand-rolled on top of [`DialogPrimitive`](../../hooks/ui/DialogPrimitive.jsx) / [`use-overlay`](../../hooks/ui/use-overlay.js) / [`Slot`](../../hooks/ui/Slot.jsx) / [`Portal`](../../hooks/ui/Portal.jsx).

## Catalog

### Surfaces

| Molecule | Purpose |
|---|---|
| `ConfirmDialog` | Specialized "Are you sure?" dialog with title + warning callout + primary/secondary CTAs. **Pattern:** primary CTA (right, blue) is the safe action; secondary CTA (left) is destructive — use `secondaryTone="destructive"` to render it red. |

### Navigation

| Molecule | Purpose |
|---|---|
| `Tabs` | Horizontal tab strip + content panels. |
| `Accordion` | Collapsible disclosure. |

### Feedback

| Molecule | Purpose |
|---|---|
| `Toast` | Solid dark inline status message (info/success/warning/error). Only the icon is colored; white/lighter-white text; optional action + square dismiss. |

### Data

| Molecule | Purpose |
|---|---|
| `DataTable` | The single configurable table. Column-config driven; options: `rowHeight` xs/sm/md/lg/xl, `stickyHeader`, `zebra`, `hoverable`, sticky-right columns. |
| `DateRangePicker` | Calendar-driven date range picker with preset chips ("Today", "This Week", "Till Date"…). |

### Product-specific

| Molecule | Purpose |
|---|---|
| `TPBanner` | The page hero banner. Dark radial gradient + animated lattice (`AnimatedGrid`), optional back button, title/subtitle, chips, and a flexible `actions` slot that takes dark-surface `Button`s in any shape (text / icon-only / split). |

## Patterns to know

### Confirm dialogs (destructive flows)

The recording-confirm and back-confirm dialogs follow a fixed pattern:

- **Primary CTA (right, blue solid)** = the SAFE action. Examples: "Keep recording", "No, Stay Here", "Save as Draft".
- **Secondary CTA (left, link)** = the destructive action, painted RED via `secondaryTone="destructive"`. Examples: "Discard & Go Back", "Yes, Edit Rx".

```jsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Are you sure?"
  warning="Going back loses your current session."
  primaryLabel="Save as Draft"
  onPrimary={handleSave}
  secondaryLabel="Discard & Go Back"
  secondaryTone="destructive"
  onSecondary={handleDiscard}
/>
```

## When to use what

| If you need… | Reach for |
|---|---|
| Modal "are you sure?" with destructive flow | `ConfirmDialog` |
| Inline status message (dark toast) | `Toast` |
| Page hero with CTAs | `TPBanner` |
| Tabbed content | `Tabs` |
| Collapsible disclosure | `Accordion` |
| Any data / list table | `DataTable` |
| Date range filter | `DateRangePicker` |

## Adding a molecule

Same shape as adding an atom (folder + `<Name>.jsx` + module SCSS +
index barrel). Re-export from [`./index.js`](./index.js).

Keep molecules domain-agnostic: they compose atoms and sibling
molecules, and never depend on app state or feature data.
