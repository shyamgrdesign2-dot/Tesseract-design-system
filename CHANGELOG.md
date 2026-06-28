# Changelog

All notable changes to `tesseract-ui`. This project follows [SemVer](https://semver.org)
and the stability contract in [`docs/PREREQUISITE.md`](docs/PREREQUISITE.md): within a
major line (`1.x`), code built against v1.0 keeps working.

## [1.0.2]

### Changed
- **Header — back affordance.** The back button now sits in a fixed **80px** left
  column (aligned with the 80px secondary-sidebar rail), rendered as a **ghost** icon
  CTA (transparent until hover, no tonal fill), closed by a **solid** full-height
  divider at the 80px mark. New `backDivider` prop (default `true`) draws the divider
  whenever the left cluster has following content; a lone back button renders plain.

### Tooling & AI grounding (not shipped in the npm package)
- The deployed Storybook is now gated by a password login screen — see
  [`docs/DEPLOY-AUTH.md`](docs/DEPLOY-AUTH.md).
- The `/tesseract` skill catalog and the MCP manifest were reconciled to all **40**
  components (added Card, SectionCard, Drawer, Empty, Breadcrumb, Pagination, Command,
  InputOTP, Progress) and the scoped `@dhspl-tatvacare/tesseract-ui` install path.

## [1.0.1] — first published registry release

The first version published to the private **GitHub Packages** registry as
`@dhspl-tatvacare/tesseract-ui`. (v1.0.0 was the announced milestone but predated
the registry + scoped-name setup, so it was never published; install `1.0.1`.)

### Changed
- **Distribution:** published to GitHub Packages — `npm install @dhspl-tatvacare/tesseract-ui`,
  versioned + immutable. The git `#v1.0.1` / `#build` install remains a no-token fallback.
- **Card:** removed the decorative dot/grid patterns from gradient cards. Gradients stay;
  for texture, compose an `<AnimatedGrid />` child (the only sanctioned overlay).
- **Repo slimmed:** icons are served 100% from the CDN — removed the 61 MB local icon copy
  and 2.3 MB of unused assets. `public/` is now just brand marks + favicon.

### Fixed
- **Tooltip (light variant):** removed the outer `1px` stroke; the white surface is now
  defined by layered shadows (also removes the arrow seam).
- **SegmentedControl:** now exported from the package root. It was documented in 1.0.0 but
  missing from the atoms barrel, so `import { SegmentedControl }` failed — fixed.

## [1.0.0] — first stable release

The first stable, public-to-the-org version. 40 components (17 atoms + 23 molecules),
all token-driven, zero runtime dependencies (react/react-dom peers only). See the full
list in [`docs/CATALOG.md`](docs/CATALOG.md).

### Catalog consolidation — one component per job
- Removed the redundant `Field`, `Menu`, `Popover`, `Timeline`, `Kbd`, and `Sheet`
  components. Each role now has a single configurable component: `InputBox` (field),
  `Dropdown` (menu/select), `Tooltip`/`Drawer` (popover), `SectionCard` (timeline),
  `Drawer` (sheet — `Sheet` remains a deprecated alias). See the migration table in
  `docs/CATALOG.md`.

### New & expanded
- **Drawer** (renamed from Sheet): `side` (left/right/top/bottom), reuses the **Header**
  component as a compact drawer header, configurable footer (text / info / info+CTAs),
  scrollable body with sticky header + footer, adjustable width/height.
- **Header**: adjustable height + compact density (for in-drawer use).
- **Card**: gradient/tone hero fills with dot/grid patterns, icon and avatar/profile
  layouts, interactive hover-lift, custom background.
- **Empty**: two-action and hyperlink-text CTAs, adjustable icon size.
- **DateRangePicker / DatePicker**: 1–2 month range, quick-select presets sidebar,
  time selection, and combined date+time modes.
- **DataTable / ClinicalTable**: sticky first/last edge columns.
- **SectionCard**: tone headers, leading/number/amount slots, tools, deep nesting,
  sticky header + scrollable body.

### Fixed
- Correct search icon (`search-normal`) used across all molecules.
- Dark-mode CTA legibility; `surface="dark"` CTAs render theme-independent white.
- Soft-variant contrast (success/warning/error text steps) across Button, Chip,
  Avatar, Toast for WCAG AA.
- Root-cause CSS reset clobbering fixed via zero-specificity `:where()` resets.

### Quality
- 0 axe WCAG A/AA violations across all components.
- Interaction + render test harness: 418 tests passing (`npm run test-storybook`).
- CI quality gate (lint + build + tests) on every push.

### Distribution
- Published as a private, versioned npm package to **GitHub Packages**:
  `@dhspl-tatvacare/tesseract-ui` (`npm install @dhspl-tatvacare/tesseract-ui`).
  Immutable versions + semver ranges. No-token fallback: git tag install
  `github:DHSPL-Tatvacare/tesseract-design-system#v1.0.0`. No public npm. See
  [`docs/USING-TESSERACT.md`](docs/USING-TESSERACT.md).

[1.0.2]: https://github.com/DHSPL-Tatvacare/tesseract-design-system/releases/tag/v1.0.2
[1.0.1]: https://github.com/DHSPL-Tatvacare/tesseract-design-system/releases/tag/v1.0.1
[1.0.0]: https://github.com/DHSPL-Tatvacare/tesseract-design-system/releases/tag/v1.0.0
