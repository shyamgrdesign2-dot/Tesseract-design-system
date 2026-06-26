# ConfirmDialog
> A Header · Body · Footer modal for short, blocking yes/no confirmations before a destructive or consequential action runs.

**Import**
```jsx
import { ConfirmDialog } from "tesseract-ui";
```

**When to use** — confirming a destructive/irreversible action (delete, discard, archive, log out) or a consequential one (send summary, end consultation) before it executes.
**When not** — for non-blocking feedback *after* an action use `Toast`; for a full editing surface use a panel/Drawer, not a dialog.

**Key props**

| prop | type | default | what it does |
|---|---|---|---|
| `open` / `onOpenChange` | `bool` / `fn` | — | Controls visibility (required pair). |
| `title` | `node` | — | Headline question in the header. |
| `size` | `"sm"\|"md"\|"lg"` | `"md"` | Dialog width — sm ~400 · md 480 · lg ~640. |
| `description` | `node` | — | Supporting body text explaining the consequence. |
| `callout` | `node` | — | Tinted box; pair with `calloutTone` `"neutral"\|"warning"\|"error"` and `calloutPlacement` `"above"\|"below"`. |
| `icon` | `name\|node` | — | Leading header glyph (CDN icon name or node). |
| `primaryLabel` + `primaryTheme` + `primaryLoading` | `string`/`theme`/`bool` | `"primary"` | Primary CTA — the **safe** action by convention; `primaryLoading` shows a spinner + disables for async confirms (pair with `primaryAutoClose={false}`). |
| `secondaryLabel` + `secondaryTheme` | `string`/`theme` | `"neutral"` | Secondary CTA — the **destructive** action by convention (theme it `error`). |
| `tertiaryLabel` | `string` | — | Auxiliary CTA, pinned left. |
| `checkboxLabel` | `node` | — | Optional "Don't show again" checkbox in the body. |
| `actionsAlign` / `actionsFullWidth` | `"left"\|"right"` / `bool` | `"right"` / `false` | Footer CTA layout. |

Each CTA slot also takes `<slot>Variant` (`solid\|outline\|ghost\|tonal\|link`). Colours/spacing come from `--tesseract-*` tokens via the Button/Checkbox atoms — never hardcode.

**Example**
```jsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete patient record?"
  description="Aarav Sharma's record and all linked visits will be permanently removed."
  callout="This action cannot be undone."
  calloutTone="error"
  primaryLabel="Keep record"
  secondaryLabel="Delete"
  secondaryVariant="solid"
  secondaryTheme="error"
  onSecondary={deletePatient}
/>
```

**Variants**
- **Playground** — every section + all three CTA triples in Controls.
- **DestructiveFlow** — safe action primary, destructive secondary (error).
- **CalloutTones** — neutral (info) · warning · error boxes.
- **ThreeCtas** — tertiary (left) + secondary + primary.
- **CalloutLineScaling** — callout icon grows 24→42px with line count.
- **ActionLayout** — right / left / full-width equal CTAs.
- **Sizes** — sm · md · lg frame widths.
- **DestructiveWithIcon** — header icon + async primary loading (`primaryAutoClose={false}`).
- **BodyVariants** — text-only vs callout-box-only bodies.
