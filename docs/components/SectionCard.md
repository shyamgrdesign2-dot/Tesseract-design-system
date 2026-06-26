# SectionCard
> The system's container shell — a titled card with an optional header, arbitrary body, and optional footer; collapsible, recolourable, and deeply nestable.

**Import**
```jsx
import { SectionCard } from "tesseract-ui";
```

**When to use** — Any titled, optionally-collapsible block: rxpad sections, multi-section forms (patient: Personal · Additional · Address), plan clusters, examination panels, dashboard blocks. Nest SectionCards in the body (with a tinted `bodyBg`) for the cluster look.

**When not** — For a plain untitled surface or KPI tile, reach for `Card`; for a slide-over panel use `Drawer`.

**Key props**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `title` / `subtitle` | node | — | Header heading + sub-line |
| `icon` | string \| node | — | Icon name (bulk style) or a node; tint with `iconColor` |
| `tone` | `neutral`\|`primary`\|`active`\|`success`\|`violet` | `neutral` | Accents the number chip, icon, and (with a fill) the header |
| `headerFill` | `none`\|`gradient`\|`solid` | `none` | Header background style; `headerColor` overrides the tone colour |
| `collapsible` | boolean | `false` | Accordion; collapsing hides only the body (header + footer stay) |
| `number` / `leading` | node | — | Leading chip (plan-cluster index, or any non-clickable content) |
| `amount` | node | — | Pill under the title (e.g. `₹20,000`) |
| `headerActions` / `tools` | node / `[{icon,title,onClick,danger}]` | — | Header CTAs / the icon-button trio |
| `footer` | node | — | Footer band; align via `footerAlign` (`start`\|`between`\|`end`) |
| `surface` / `headerBg` / `bodyBg` / `footerBg` | colour | — | One background, or per-band |
| `elevation` | `false`\|`sm`\|`md`\|`true` | `false` | Drop shadow |
| `bordered` / `divided` / `radius` / `padding` | bool / bool / radius / num | `true` / `true` | Chrome controls |

All colours/spacing default to `--tesseract-*` tokens; pass token vars (not raw hex) to the `*Bg`/`iconColor` props.

**Example**
```jsx
<SectionCard
  title="Personal details"
  subtitle="Basic information about the patient"
  icon="user"
  iconColor="var(--tesseract-blue-500)"
  collapsible
  headerActions={<Badge variant="soft" color="primary" size="sm">3 fields</Badge>}
  footer={<><Button variant="ghost" theme="neutral" size="sm">Cancel</Button><Button size="sm">Save</Button></>}
>
  <InputBox label="First name" placeholder="Jane" fullWidth />
  <InputBox label="Last name" placeholder="Doe" fullWidth />
</SectionCard>
```

Cluster (nested): an outer tinted shell holding inner cards.
```jsx
<SectionCard title="Plan Estimates" amount="₹20,000" icon="document-text" tone="primary" headerGradient bodyBg="var(--tesseract-slate-50)">
  <SectionCard number={1} title="Wisdom Tooth Removal" amount="₹20,000" tone="primary" collapsible>
    {/* line items */}
  </SectionCard>
</SectionCard>
```

**Variants** — Playground · MultiSectionForm (patient intake) · SegmentedBackgrounds (per-band bg) · WithHeaderSearch (`headerExtra`) · PlanCluster (nested tinted shell) · VisitEntries (card-on-card timeline) · FreeFormBody · MixedNesting · HeaderFills (none/gradient/solid/custom) · PermutationMatrix (tone × fill × chevron) · CollapseInteraction · Plain (borderless on tint).
