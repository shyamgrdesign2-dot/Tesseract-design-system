# Tabs
> Compound tab navigation (Radix-shaped) for switching between panels of related content in one view.

**Import**
```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — Segment a single screen's content into peer sections the user toggles between (patient Overview / Vitals / History, billing Pending / Paid). Keeps everything on one route.
**When not** — For navigating between distinct pages/routes, use a nav/menu, not Tabs.

**Key props**

| Prop | Type | Default | What it does |
|---|---|---|---|
| `value` / `defaultValue` | string | — | Active tab (controlled / uncontrolled). |
| `onValueChange` | (value) => void | — | Fires when the active tab changes. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Density of triggers; also drives icon size. Use `sm` for compact toolbars. |
| `variant` | `"line" \| "pill" \| "segment"` | `"line"` | Underline (default), pill, or segmented control look. |
| `accent` (alias `color`) | token name | `tesseract-blue-600` | Token driving active text + indicator, e.g. `"tesseract-violet-600"`. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Vertical rail uses Up/Down arrows. |
| `activationMode` | `"automatic" \| "manual"` | `"automatic"` | Auto selects on focus; manual waits for Enter/Space/click. |
| `TabsList fullWidth` | boolean | `false` | Triggers grow to fill the row equally. |
| `TabsTrigger leftIcon` / `rightIcon` | ReactNode | — | Icon before label / far right; active tab renders it `bulk`, inactive `linear`. |
| `TabsTrigger tag` + `tagTone` | ReactNode + `"neutral"\|"primary"\|"success"\|"warning"\|"error"` | `neutral` | Count/status pill (reuses Badge). |
| `TabsTrigger disabled` / `asChild` | boolean | — | Disable a tab, or render it as your own element (e.g. a router `<Link>`). |

Colours, spacing and the active indicator all come from `--tesseract-*` tokens — pass an accent token name, never a hardcoded hex.

**Example**
```jsx
<Tabs defaultValue="overview" size="sm">
  <TabsList>
    <TabsTrigger value="overview" leftIcon={<TPIcon name="user" />}>Overview</TabsTrigger>
    <TabsTrigger value="vitals">Vitals</TabsTrigger>
    <TabsTrigger value="orders" tag="3" tagTone="warning">Orders</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">Patient summary…</TabsContent>
  <TabsContent value="vitals">BP, HR, SpO₂…</TabsContent>
  <TabsContent value="orders">Pending orders…</TabsContent>
</Tabs>
```

**Variants**
- Playground · CustomTabs — full arg-driven config / bring-your-own tabs.
- Sizes — sm / md / lg density.
- Icons · Left, Icons · Left + Right, Tags · Right — content slots.
- Variant · Line / Pill / Segment, Variant · Pill (accent) — visual styles + accent token.
- Orientation · Vertical — vertical rail.
- Behavior · Manual Activation, Controlled, WithDisabledTab.
- Full Width, Horizontal Scroll (small screens).
- PatientProfile — realistic EMR composition.
