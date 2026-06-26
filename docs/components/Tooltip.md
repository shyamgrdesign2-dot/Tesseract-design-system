# Tooltip
> A first-party, collision-aware hover/click bubble for short hints, labels, or click-dismissible info — flips to stay on-screen, dark/light surface, optional arrow.

**Import**
```jsx
import { Tooltip } from "tesseract-ui";
// compound parts, only when you need full control:
import { TooltipProvider, TooltipTrigger, TooltipContent } from "tesseract-ui";
```

**When to use** — a short hint or label on hover, a click-dismissible info bubble, or revealing the full value of clipped text (`whenTruncated`).
**When not** — anything the user must read or act on → `ConfirmDialog`/`Toast`; a menu of actions → `Dropdown`.

**Key props**

| prop | type | default | what it does |
|---|---|---|---|
| `content` | ReactNode | — | bubble body (wrapper mode); omit to use compound parts |
| `trigger` | `"hover" \| "click"` | `"hover"` | hover opens on enter/focus; click toggles + stays open until outside-click/Esc/× |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | preferred side; auto-flips to stay on-screen |
| `align` | `"start" \| "center" \| "end"` | `"center"` | alignment along that side |
| `variant` | `"dark" \| "light"` | `"dark"` | surface colour; the arrow tracks it |
| `dismissible` | boolean | `false` | show a square × close button (pairs with `trigger="click"`) |
| `icon` | ReactNode | — | leading icon inside the bubble |
| `interactive` | boolean | `false` | hover-only — keep open while the pointer moves into the bubble |
| `whenTruncated` | boolean | `false` | hover-only — only show when the trigger text overflows |
| `maxWidth` | number (px) | `280` | width before the body wraps |
| `disabled` | boolean | `false` | suppress the tooltip entirely |

Other: `sideOffset` (6), `arrow` (true), `arrowSize` (5), `delayDuration` (200ms), `closeDelay` (60ms), `closeIcon`, `portalContainer`, and `open`/`defaultOpen`/`onOpenChange`. Colours/spacing come from `--tesseract-*` tokens — don't hardcode.

**Example**
```jsx
<Tooltip content="Email verified" side="bottom" icon={<TPLibraryIcon name="verify" size={16} />}>
  <Button variant="outline">Patient summary</Button>
</Tooltip>
```

Compound form (full control over trigger + content):
```jsx
<TooltipProvider delayDuration={150}>
  <Tooltip>
    <TooltipTrigger asChild><Button variant="ghost">Info</Button></TooltipTrigger>
    <TooltipContent side="bottom" sideOffset={8}>Built from parts</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Variants** (Storybook: Molecules/Tooltip)
- **Playground** — all controls live.
- **Triggers** — hover vs click.
- **WithIcon** — leading icon vs none.
- **Dismissible** — click bubble with the square ×.
- **Sides** — top/right/bottom/left placement.
- **Variants** — dark vs light surface.
- **RichContent** — long body wrapping within `maxWidth`.
- **OnlyWhenTruncated** — tooltip only on clipped text.
- **Interactive** — hover bubble you can move into (e.g. click a link inside).
- **CustomArrow** — bigger arrow + custom dismiss glyph.
- **CompoundParts** — `TooltipProvider`/`TooltipTrigger`/`TooltipContent`.
