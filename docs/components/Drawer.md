# Drawer
> An edge-anchored modal panel with a standard header / body / footer, for slide-in filters, quick-views, forms, and previews.

**Import**
```jsx
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@dhspl-tatvacare/tesseract-ui";
// also available: DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter
```

**When to use** — Any slide-in surface over the current page: filter panels, record quick-view/edit forms, bill/plan preview, bottom-sheet quick actions. It's the single overlay panel for the whole system.
**When not** — For a small centered confirmation or alert, use `Dialog`/`Modal`; for inline expandable content use `SectionCard`.

**Key props** (on `DrawerContent`)

| prop | type | default | what it does |
|---|---|---|---|
| `side` | `"right"`/`"left"`/`"top"`/`"bottom"` | `"right"` | Edge it anchors to. Top/bottom = bottom-sheet style. |
| `width` | `"full"` · `"50%"` · number(px) · CSS len | `min(440px,100vw)` | Panel width for left/right drawers (capped at viewport). |
| `height` | same forms (`vh`) | `85vh` | Panel height for top/bottom drawers. |
| `title` | node | — | Header title (rendered as `DrawerTitle`). |
| `description` | node | — | Sub-line under the title. |
| `action` | node | — | Right-aligned header slot for CTAs/badges. |
| `footer` | node | — | Pinned footer band (totals, primary actions). |
| `header` | node | — | Replace the entire default header chrome. |
| `showClose` | bool | `true` | Show the left close button + divider. |
| `closeIcon` | string | `"close-square"` | Iconsax name for the close button. |
| `bodyPadding` | number/string | token default | Override body padding. |

Open state lives on the root `Drawer` (`open`, `onOpenChange`) — it wraps the shared dialog primitive (focus trap, scroll lock, Escape, focus restore). Colours/spacing come from `--tesseract-*` tokens; don't hardcode.

**Example**
```jsx
const [open, setOpen] = useState(false);

<Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>
    <Button>Edit patient</Button>
  </DrawerTrigger>

  <DrawerContent
    width="50%"
    title="Edit patient"
    description="MRN-0042"
    action={<Badge variant="soft" color="primary" size="sm">Draft</Badge>}
    footer={
      <>
        <DrawerClose asChild>
          <Button variant="ghost" theme="neutral" size="sm">Cancel</Button>
        </DrawerClose>
        <Button size="sm">Save</Button>
      </>
    }
  >
    {/* any content — reuse SectionCard, forms, tables */}
  </DrawerContent>
</Drawer>
```

**Variants**
- **Playground** — default right drawer with title, action, and footer.
- **WidthPresets** — `full` / `90%` … `20%` width options.
- **WithAppHeader** — custom `header` slot (app-style title + subtitle).
- **FooterVariants** — footer alignment (`start` / `between` / cta layouts).
- **RichContent** — body composed of nested `SectionCard`s.
- **NoHeader** — `showClose={false}` / fully custom inline header.
- **BottomSheet** — `side="bottom"` with `height` (mobile-style quick actions).
