# Button
> The single Tesseract button atom — one component for text, icon-only, and split (primary + dropdown) buttons.

**Import**
```jsx
import { Button } from "tesseract-ui";
```

**When to use** — Any clickable action/CTA: form submits, row actions, toolbar buttons, dropdown menus. One `<Button>` covers text, icons, icon-only, and split shapes.
**When not** — For navigation that's really a styled link with no button affordance, prefer the `link` variant or `asChild` with your router's Link; for non-action toggles use a dedicated control.

**Key props**

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `variant` | `solid` \| `outline` \| `ghost` \| `tonal` \| `link` | `solid` | Visual emphasis. |
| `theme` | `primary` \| `neutral` \| `error` \| `success` \| `warning` | `primary` | Colour intent (use `error` for destructive). |
| `size` | `sm` \| `md` \| `lg` | `md` | Density — `sm` for dense tables/toolbars. |
| `leftIcon` / `rightIcon` | ReactNode | — | Icons flanking the label. |
| `icon` | ReactNode | — | Icon-only mode (no children); pass `aria-label`. |
| `menu` | `Array<{ id, label, icon?, onClick?, disabled?, shortcut?, danger? }>` | — | Renders a split button (primary + dropdown). |
| `loading` | boolean | `false` | Spinner overlay, interaction disabled. |
| `disabled` | boolean | `false` | Disabled state. |
| `fullWidth` | boolean | `false` | Stretch to `width:100%`. |
| `href` / `as` / `asChild` | string / ElementType / boolean | — | Polymorphic: render as `<a>`, another element, or merge styling onto a router Link. |
| `radius` | number \| `pill` \| `sharp` | — | Override corner radius; omit to keep token default. |
| `track` | string \| object | — | Opt-in analytics; emits to nearest `<TPAnalyticsProvider>`. |

Colours, spacing, and corner radius all come from `--tesseract-*` tokens (dark mode flips via the token ramp). Don't hardcode hex/px — use `variant`/`theme`/`size`/`radius` instead.

**Example**
```jsx
// Primary submit in a prescription form
<Button theme="primary" leftIcon={<SaveIcon />} loading={saving}>
  Save Prescription
</Button>

// Split action button (clinic toolbar)
<Button
  variant="solid"
  icon={<PlusIcon />}
  menu={[
    { id: "rx",    label: "New Prescription", onClick: createRx },
    { id: "visit", label: "New Visit",        onClick: createVisit },
    { id: "del",   label: "Discard",          danger: true, onClick: discard },
  ]}
>
  New
</Button>
```

**Variants**
- All Variants — solid / outline / ghost / tonal / link
- Sizes — sm / md / lg
- Icon Positions, Icon-only, With Icons
- States — loading / disabled
- Destructive (error theme), Dark Surface
- Split — variants / sizes / states / dark
- Corner Radius, Full Width, Polymorphic (anchor)
- Use Cases — Healthcare CTAs
