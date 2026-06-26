# Command
> A ⌘K command palette — a dialog-hosted, searchable, keyboard-navigable action list for fast global navigation and quick actions.

**Import**
```jsx
import { Command } from "tesseract-ui";
```

**When to use** — Power-user fast access across the whole app: jump to a patient, fire a quick action, navigate anywhere. Wire it to a global ⌘K shortcut.
**When not** — For a per-trigger contextual action list use **Menu**; for a value picker use **Dropdown**.

**Key props**
| prop | type | default | what it does |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controlled palette state — wire to your ⌘K shortcut |
| `onOpenChange` | `(open) => void` | — | Fires when the palette opens/closes |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial state (demos) |
| `groups` | `[{ heading?, items }]` | — | Grouped items; each item `{ id, label, icon?, shortcut?, keywords?, onSelect, disabled? }` |
| `items` | `[{ … }]` | — | Flat-list convenience (one unlabeled group) |
| `placeholder` | `string` | `"Type a command or search…"` | Search-input placeholder |
| `emptyText` | `string` | `"No results found."` | Shown when nothing matches |
| `label` | `string` | `"Command palette"` | Accessible name (aria-label) for the dialog |

Filters live as you type (matches `label` + `keywords`); ↑/↓ move, Enter runs the item's `onSelect`. Hosted in the shared DialogPrimitive (focus trap, scroll lock, Escape, scrim); input auto-focuses on open. Colours and spacing come from `--tesseract-*` tokens — don't hardcode.

**Example**
```jsx
function Palette() {
  const [open, setOpen] = React.useState(false);
  // wire ⌘K elsewhere: setOpen(true)
  return (
    <Command
      open={open}
      onOpenChange={setOpen}
      placeholder="Search patients or actions…"
      groups={[
        { heading: "Patients", items: [
          { id: "p1", label: "Ramesh Kumar — MRN 10231", icon: "profile-2user",
            keywords: ["patient"], onSelect: () => openPatient("10231") },
        ]},
        { heading: "Actions", items: [
          { id: "a1", label: "New appointment", icon: "calendar-1", shortcut: "⌘N", onSelect: bookAppt },
          { id: "a2", label: "New prescription", icon: "document-text", shortcut: "⌘R", onSelect: writeRx },
        ]},
      ]}
    />
  );
}
```
`icon` accepts a TPLibraryIcon name string or a node.

**Variants**
- **Playground** — controlled, opened from a trigger Button; toggles for group headings / icons / shortcuts.
- **Open** — `defaultOpen` for previewing the palette without a trigger.
