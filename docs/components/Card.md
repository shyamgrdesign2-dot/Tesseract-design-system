# Card
> The default surface container for grouping related content — dashboards, patient tiles, vitals panels, settings sections.

**Import**
```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "tesseract-ui";
```

**When to use** — group related content on a raised/bordered surface; compose the optional parts (`CardHeader` + `CardTitle`/`CardDescription`, `CardContent`, `CardFooter`) freely.
**When not** — for a transient message use **Toast**; for a blocking prompt use **ConfirmDialog**.

**Key props** (on `Card`)

| prop | type | default | what it does |
|---|---|---|---|
| `variant` | `"default" \| "outline" \| "elevated"` | `"default"` | surface treatment (flat / bordered / raised) |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | inner padding scale (use `sm`/`none` for dense tiles) |
| `tone` | `"neutral" \| "primary" \| "success" \| "warning" \| "error" \| "violet"` | `"neutral"` | accent for gradient / accent treatments |
| `gradient` | `boolean` | `false` | branded gradient fill in `tone` + light text (hero/highlight tiles) |
| `pattern` | `"dots" \| "grid" \| "none"` | `"dots"` | texture over a gradient |
| `interactive` | `boolean` | `false` | hover-lift + pointer for clickable cards |
| `radius` | `number \| "pill" \| "sharp" \| string` | token | corner override (else design token) |
| `background` | CSS background | — | custom surface override (token/colour/gradient) |

Colours, spacing, and radii all come from `--tesseract-*` tokens — don't hardcode hex/px. All compound parts forward refs and spread props. `CardTitle` accepts `as` to set the heading tag (default `h3`).

**Example**
```jsx
<Card variant="elevated" padding="md" style={{ maxWidth: 360 }}>
  <CardHeader>
    <CardTitle>Patient summary</CardTitle>
    <CardDescription>MRN-10231 · last updated 2h ago</CardDescription>
  </CardHeader>
  <CardContent>3 active prescriptions · 1 pending lab result awaiting review.</CardContent>
  <CardFooter>
    <Button size="sm" variant="solid" theme="primary">Open record</Button>
    <Button size="sm" variant="ghost" theme="neutral">Dismiss</Button>
  </CardFooter>
</Card>
```

**Variants**
- **Playground** — full patient-summary card with header/content/footer.
- **Variants** — the three surfaces: default, outline, elevated.
- **GradientCards** — branded gradient hero tiles per tone with dots/grid pattern + light text.
- **IconAndProfile** — icon-disc tile and an interactive profile card (Avatar + Badge).
- **StatTile** — compact KPI tile (label + value + trend Badge).
