/**
 * Button — the single Tesseract CTA.
 *
 * One component, every shape: text · with icons · icon-only · split (primary+menu).
 * Styling is data-attribute driven (Button.module.scss); the split menu is the
 * only stateful path.
 *
 * Coverage:
 *  • 5 variants × 3 themes × 3 sizes
 *  • Icons: none | left | right | both | icon-only
 *  • Split button (menu) across variants, sizes, states, dark surface
 *  • States: default, disabled, loading · Surface: light | dark
 */

import { fn, within, userEvent, expect } from 'storybook/test';
import { Button } from './Button';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

// ─── Shared helpers ────────────────────────────────────────────────────────────

const VARIANTS = ['solid', 'outline', 'ghost', 'tonal', 'link'];
const THEMES   = ['primary', 'neutral', 'error', 'success', 'warning'];
const SIZES    = ['sm', 'md', 'lg'];
const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];

// Button maps size → icon px the same way (see ICON_FOR below); reuse that sizing.
const ICON_FOR = (size) => (size === 'sm' ? 16 : size === 'lg' ? 20 : 18);

// Resolve an icon node for a slot, sized to the button, in the chosen style + family.
const glyphFor = (name, size, variant = 'linear', family) =>
  name ? <TPIcon name={name} variant={variant} family={family || undefined} size={ICON_FOR(size)} /> : undefined;

const Row = ({ children, gap = 12 }) => (
  <div style={{ display: 'flex', gap, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

const Section = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--tesseract-slate-500, #717179)' }}>
      {label}
    </span>
    {children}
  </div>
);

function iconForSize(size) {
  const px = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;
  return <TPLibraryIcon name="add" size={px} />;
}

function chevronForSize(size) {
  const px = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;
  return <TPLibraryIcon name="arrow-right" size={px} />;
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

// Demo menu for the split shape in the Playground.
const DEMO_MENU = [
  { id: 'view',     label: 'View details',  icon: <TPLibraryIcon name="document-text" size={16} /> },
  { id: 'download', label: 'Download PDF',  icon: <TPLibraryIcon name="import" size={16} /> },
  { id: 'delete',   label: 'Delete record', icon: <TPLibraryIcon name="trash" size={16} />, danger: true },
];

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    docs: {
      description: {
        component: [
          'The single Tesseract CTA — one component for every button shape: text, with icons, icon-only, and split (primary + menu).',
          '',
          '**When to use** — any clickable action: submit, navigate, trigger a menu. Reach for the split shape (`menu`) when a primary action has secondary variants.',
          '**When not** — for a selectable/removable token use **Chip**; for a read-only state use **Badge**; for navigation that should be a real link, set `href` rather than handling clicks.',
          '',
          '**Key props** — `variant` (solid · outline · ghost · tonal · link), `theme` (primary · neutral · error · success · warning), `size`, `surface` (light · dark), `loading` / `disabled`, `href` (renders a real `<a>`), `menu` (split-button items).',
          '',
          '**Good to know** — icon-only buttons have no text, so pass `aria-label`. `href` (or `as="a"`) makes the text and icon-only shapes render an anchor with identical styling; the split shape stays a native button group. `loading` shows a spinner and blocks clicks.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    // Real Button props
    variant:  { control: 'select',       options: VARIANTS,            description: 'solid · outline · ghost · tonal · link', table: { category: 'Style' } },
    theme:    { control: 'select',       options: THEMES,              description: 'Colour theme — primary · neutral · error · success · warning', table: { category: 'Style' } },
    size:     { control: 'inline-radio', options: SIZES,               description: 'sm · md · lg', table: { category: 'Style' } },
    surface:  { control: 'inline-radio', options: ['light', 'dark'],   description: 'Tune contrast for a light or dark background', table: { category: 'Style' } },
    radius:   { control: 'select', options: ['default', 'sharp', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', 'pill'], name: 'corner radius', description: "Restricted radius — a px step, or 'pill' / 'sharp'. 'default' keeps the size default.", table: { category: 'Style' } },
    fullWidth:{ control: 'boolean', name: 'full width', description: 'Stretch to width:100% (default is inline width)', table: { category: 'Style' } },
    href:     { control: 'text', description: 'When set, renders a real <a href> with identical styling (great for the link variant). Blank = native <button>', table: { category: 'Polymorphic' } },
    loading:  { control: 'boolean', description: 'Show a spinner and block clicks',     table: { category: 'State' } },
    disabled: { control: 'boolean', description: 'Non-interactive, dimmed',             table: { category: 'State' } },
    children: { control: 'text', name: 'label', description: 'Button label (omit for icon-only)', table: { category: 'Content' } },
    // Playground-only synthetic controls (icon/menu are React nodes, so they
    // can't be plain controls — these drive them via the render below).
    shape: {
      control: 'inline-radio',
      options: ['text', 'icon-only', 'split'],
      description: 'Demo only — which Button shape to render',
      table: { category: 'Shape (demo)' },
    },
    // Icon controls — name a CDN icon per slot; the text shape uses left + right,
    // the icon-only / split shapes use the left slot as their single glyph.
    leftIcon:    { control: 'text', tpIcon: true, name: 'left icon',  description: 'CDN icon name for the leading slot (also the icon-only / split glyph). Blank = none', table: { category: 'Icons' } },
    rightIcon:   { control: 'text', tpIcon: true, name: 'right icon', description: 'CDN icon name for the trailing slot (text shape only). Blank = none', table: { category: 'Icons' } },
    iconVariant: { control: 'select', options: ICON_VARIANTS, name: 'icon style', description: 'Icon style applied to both slots', table: { category: 'Icons' } },
    iconFamily:  { control: 'text', name: 'icon family', description: 'Override the auto-resolved CDN family (blank = auto)', table: { category: 'Icons' } },
  },
  args: {
    children: 'Button',
    variant:  'solid',
    theme:    'primary',
    size:     'md',
    surface:  'light',
    radius:    'default',
    fullWidth: false,
    href:     '',
    loading:  false,
    disabled: false,
    shape:       'text',
    leftIcon:    'add',
    rightIcon:   '',
    iconVariant: 'linear',
    iconFamily:  '',
  },
};

export default meta;

// ─── 1. Playground ─────────────────────────────────────────────────────────────

// A radius control comes in as a string. Coerce a pure-number string to a number;
// pass keywords ("pill"/"sharp") / tokens through; blank → undefined (default look).
const radiusValue = (r) => {
  const s = String(r ?? '').trim();
  if (!s || s === 'default') return undefined;
  return /^-?\d+$/.test(s) ? Number(s) : s;
};

// Build an accurate, copy-paste code snippet from the controls (what "Show code" shows).
const iconJsx = (name, variant, family) =>
  `<TPIcon name="${name}"${variant && variant !== 'linear' ? ` variant="${variant}"` : ''}${family ? ` family="${family}"` : ''} />`;

const buildCode = ({ shape = 'text', variant = 'solid', theme = 'primary', size = 'md', surface = 'light', radius, fullWidth, href, loading, disabled, children = '', leftIcon, rightIcon, iconVariant, iconFamily }) => {
  const lines = [`  variant="${variant}"`, `  theme="${theme}"`, `  size="${size}"`];
  if (surface && surface !== 'light') lines.push(`  surface="${surface}"`);
  const rv = radiusValue(radius);
  if (rv != null) lines.push(typeof rv === 'number' ? `  radius={${rv}}` : `  radius="${rv}"`);
  if (fullWidth) lines.push('  fullWidth');
  // href makes the standard / icon-only shapes render a real <a> (split stays a button).
  if (href && shape !== 'split') lines.push(`  href="${href}"`);
  if (loading) lines.push('  loading');
  if (disabled) lines.push('  disabled');

  if (shape === 'icon-only') {
    const glyph = leftIcon || 'add';
    lines.push(`  aria-label="${children || 'Action'}"`);
    lines.push(`  icon={${iconJsx(glyph, iconVariant, iconFamily)}}`);
    return `<Button\n${lines.join('\n')}\n/>`;
  }

  if (shape === 'split') {
    if (leftIcon) lines.push(`  icon={${iconJsx(leftIcon, iconVariant, iconFamily)}}`);
    lines.push('  menu={menu}');
    return `<Button\n${lines.join('\n')}\n>\n  ${children}\n</Button>`;
  }

  // text
  if (leftIcon)  lines.push(`  leftIcon={${iconJsx(leftIcon, iconVariant, iconFamily)}}`);
  if (rightIcon) lines.push(`  rightIcon={${iconJsx(rightIcon, iconVariant, iconFamily)}}`);
  return `<Button\n${lines.join('\n')}\n>\n  ${children}\n</Button>`;
};

export const Playground = {
  args: {
    leftIcon: "check-mark---tick"
  },
  name:'🎛 Playground',

  // For surface="dark", switch the canvas background via the Storybook
  // toolbar (Backgrounds → Dark) rather than a hardcoded backdrop.
  render: ({ shape, leftIcon, rightIcon, iconVariant, iconFamily, radius, href, children, ...args }) => {
    // radius is a real Button prop now (sets --tesseract-btn-radius via resolveRadius).
    const radiusProp = radiusValue(radius);
    const glyph = (name) => glyphFor(name, args.size, iconVariant, iconFamily);
    // href only applies to the non-split shapes (split stays a native button group).
    const linkHref = href || undefined;

    if (shape === 'icon-only') {
      return <Button {...args} radius={radiusProp} href={linkHref} aria-label={children || 'Action'} icon={glyph(leftIcon) || glyphFor('add', args.size, iconVariant, iconFamily)} />;
    }

    if (shape === 'split') {
      return (
        <Button {...args} radius={radiusProp} icon={glyph(leftIcon)} menu={DEMO_MENU}>
          {children}
        </Button>
      );
    }

    // text
    return (
      <Button {...args} radius={radiusProp} href={linkHref} leftIcon={glyph(leftIcon)} rightIcon={glyph(rightIcon)}>
        {children}
      </Button>
    );
  },
  parameters:{ docs: { source: { transform: (_code, ctx) => buildCode(ctx.args) } } }
};

/** Interaction test — the button is clickable and fires onClick. */
export const ClickInteraction = {
  args: { onClick: fn(), href: undefined },
  render: ({ href, shape, leftIcon, rightIcon, iconVariant, iconFamily, radius, ...a }) => <Button {...a}>Click me</Button>,
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: /click me/i }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};

// ─── 2. Variants ────────────────────────────────────────────────────────────────

export const Variants = {
  name: '📦 All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {THEMES.map((theme) => (
        <Section key={theme} label={`Theme: ${theme}`}>
          <Row>
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} theme={theme}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </Row>
        </Section>
      ))}

      {/* Other shapes — same variants, as icon-only and split */}
      <Section label="Shape: icon-only (per variant)">
        <Row>
          {VARIANTS.filter((v) => v !== 'link').map((variant) => (
            <Button key={variant} variant={variant} aria-label="Add" icon={<TPLibraryIcon name="add" size={20} />} />
          ))}
        </Row>
      </Section>
      <Section label="Shape: split (per variant)">
        <Row gap={16}>
          {['solid', 'outline', 'tonal'].map((variant) => (
            <Button key={variant} variant={variant} icon={<TPLibraryIcon name="add" size={16} />} menu={DEMO_MENU}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </Row>
      </Section>
    </div>
  ),
};

// ─── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes = {
  name: '📐 Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {THEMES.map((theme) => (
        <Section key={theme} label={`Theme: ${theme}`}>
          <Row gap={16}>
            {SIZES.map((size) => (
              <Button key={size} theme={theme} size={size}>
                {size.toUpperCase()}
              </Button>
            ))}
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 4. Icon Positions ─────────────────────────────────────────────────────────

export const IconPositions = {
  name: '🔘 Icon Positions',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {VARIANTS.map((variant) => (
        <Section key={variant} label={`Variant: ${variant}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SIZES.map((size) => (
              <Row key={size} gap={12}>
                <Button variant={variant} size={size}>Label</Button>
                <Button variant={variant} size={size} leftIcon={iconForSize(size)}>Add item</Button>
                <Button variant={variant} size={size} rightIcon={chevronForSize(size)}>Continue</Button>
                <Button variant={variant} size={size} leftIcon={iconForSize(size)} rightIcon={chevronForSize(size)}>Action</Button>
              </Row>
            ))}
          </div>
        </Section>
      ))}
    </div>
  ),
};

// ─── 5. Icon-only ────────────────────────────────────────────────────────────────

export const IconOnly = {
  name: '⬛ Icon-only',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section label="Variants (md)">
        <Row>
          {VARIANTS.filter((v) => v !== 'link').map((variant) => (
            <Button key={variant} variant={variant} aria-label="Search" icon={<TPLibraryIcon name="search-normal" size={20} />} />
          ))}
        </Row>
      </Section>
      <Section label="Sizes (tonal / neutral)">
        <Row gap={16}>
          {SIZES.map((size) => (
            <Button key={size} variant="tonal" theme="neutral" size={size} aria-label="Edit" icon={<TPLibraryIcon name="edit-2" size={size === 'sm' ? 18 : size === 'lg' ? 22 : 20} />} />
          ))}
        </Row>
      </Section>
      <Section label="Common actions">
        <Row>
          <Button variant="ghost" theme="neutral" aria-label="More" icon={<TPLibraryIcon name="3-dots-more" size={20} />} />
          <Button variant="ghost" theme="neutral" aria-label="Print" icon={<TPLibraryIcon name="printer" size={20} />} />
          <Button variant="ghost" theme="error" aria-label="Delete" icon={<TPLibraryIcon name="trash" size={20} />} />
          <Button variant="solid" aria-label="Add" icon={<TPLibraryIcon name="add" size={20} />} />
        </Row>
      </Section>
    </div>
  ),
};

// ─── 6. States ─────────────────────────────────────────────────────────────────

export const States = {
  name: '⚡ States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {VARIANTS.map((variant) => (
        <Section key={variant} label={`Variant: ${variant}`}>
          <Row>
            <Button variant={variant}>Default</Button>
            <Button variant={variant} disabled>Disabled</Button>
            <Button variant={variant} loading>Loading</Button>
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 7. Dark Surface — All Variants ────────────────────────────────────────────

export const DarkSurface = {
  name: '🌑 Dark Surface — All Variants',
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {VARIANTS.map((variant) => (
        <Section key={variant} label={<span style={{ color: 'rgba(255,255,255,0.45)' }}>{`${variant}`}</span>}>
          <Row>
            {THEMES.map((theme) => (
              <Button key={theme} variant={variant} theme={theme} surface="dark">
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Button>
            ))}
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 8. Full Matrix (light) ────────────────────────────────────────────────────

export const FullMatrix = {
  name: '📊 Full Matrix',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, marginBottom: 8 }}>
        <div />
        {VARIANTS.map((v) => (
          <span key={v} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--tesseract-slate-500, #717179)', textAlign: 'center' }}>
            {v}
          </span>
        ))}
      </div>
      {THEMES.map((theme) => (
        <div key={theme} style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tesseract-slate-600, #54545C)' }}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </span>
          {VARIANTS.map((variant) => (
            <div key={variant} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant={variant} theme={theme}>Label</Button>
            </div>
          ))}
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, alignItems: 'center', marginTop: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tesseract-slate-500, #717179)' }}>Disabled</span>
        {VARIANTS.map((variant) => (
          <div key={variant} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant={variant} disabled>Label</Button>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tesseract-slate-500, #717179)' }}>Loading</span>
        {VARIANTS.map((variant) => (
          <div key={variant} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant={variant} loading>Label</Button>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ─── 9. With Icons ───────────────────────────────────────────────────────────────

export const WithIcons = {
  name: '🔷 With Icons — All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {VARIANTS.map((variant) => (
        <Section key={variant} label={`${variant}`}>
          <Row>
            <Button variant={variant} leftIcon={<TPLibraryIcon name="add" size={16} />}>Add Patient</Button>
            <Button variant={variant} rightIcon={<TPLibraryIcon name="arrow-right" size={16} />}>View Details</Button>
            <Button variant={variant} leftIcon={<TPLibraryIcon name="import" size={16} />} rightIcon={<TPLibraryIcon name="arrow-right" size={16} />}>Export Report</Button>
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 10. Destructive / Error theme ─────────────────────────────────────────────

export const Destructive = {
  name: '🔴 Destructive (Error Theme)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Section label="Error theme — all variants">
        <Row>
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} theme="error" leftIcon={<TPLibraryIcon name="trash" size={16} />}>Delete</Button>
          ))}
        </Row>
      </Section>
    </div>
  ),
};

// ─── 11. Split Button — All Variants ──────────────────────────────────────────

const splitMenu = [
  { id: 'view',     label: 'View details',  icon: <TPLibraryIcon name="document-text" size={16} /> },
  { id: 'download', label: 'Download PDF',  icon: <TPLibraryIcon name="import" size={16} /> },
  { id: 'copy',     label: 'Duplicate',     icon: <TPLibraryIcon name="add" size={16} /> },
  { id: 'delete',   label: 'Delete record', icon: <TPLibraryIcon name="trash" size={16} />, danger: true },
];

export const SplitVariants = {
  name: '✂️ Split — All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {THEMES.map((theme) => (
        <Section key={theme} label={`${theme} theme`}>
          <Row gap={16}>
            {['solid', 'outline', 'tonal'].map((variant) => (
              <Button key={variant} variant={variant} theme={theme} menu={splitMenu}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 12. Split Button — Sizes ─────────────────────────────────────────────────

export const SplitSizes = {
  name: '✂️ Split — Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {SIZES.map((size) => (
        <Section key={size} label={`Size: ${size.toUpperCase()}`}>
          <Row gap={16}>
            <Button size={size} menu={splitMenu}>Save</Button>
            <Button size={size} variant="outline" icon={iconForSize(size)} menu={splitMenu}>Export</Button>
            <Button size={size} variant="tonal" menu={splitMenu}>Schedule</Button>
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 13. Split Button — States ────────────────────────────────────────────────

export const SplitStates = {
  name: '✂️ Split — States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section label="Default">
        <Row gap={16}>
          {['solid', 'outline', 'tonal'].map((variant) => (
            <Button key={variant} variant={variant} menu={splitMenu}>Submit</Button>
          ))}
        </Row>
      </Section>
      <Section label="Loading / Disabled">
        <Row gap={16}>
          <Button variant="solid" loading menu={splitMenu}>Saving…</Button>
          <Button variant="outline" disabled menu={splitMenu}>Submit</Button>
          <Button variant="tonal" disabled menu={splitMenu}>Submit</Button>
        </Row>
      </Section>
    </div>
  ),
};

// ─── 14. Split Button — Dark Surface ─────────────────────────────────────────

export const SplitDark = {
  name: '✂️ Split — Dark Surface',
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {['solid', 'outline', 'tonal'].map((variant) => (
        <Section key={variant} label={<span style={{ color: 'rgba(255,255,255,0.45)' }}>{variant}</span>}>
          <Row gap={16}>
            <Button variant={variant} surface="dark" icon={<TPLibraryIcon name="add" size={16} />} menu={splitMenu}>Save Report</Button>
            <Button variant={variant} surface="dark" theme="neutral" menu={splitMenu}>Neutral</Button>
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 15. Use cases ─────────────────────────────────────────────────────────────

export const UseCases = {
  name: '🏥 Use Cases — Healthcare CTAs',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section label="Patient actions">
        <Row>
          <Button leftIcon={<TPLibraryIcon name="add" size={16} />}>New Patient</Button>
          <Button variant="outline" leftIcon={<TPLibraryIcon name="edit-2" size={16} />}>Edit Profile</Button>
          <Button variant="ghost" leftIcon={<TPLibraryIcon name="search-normal" size={16} />}>Search Records</Button>
          <Button variant="tonal" leftIcon={<TPLibraryIcon name="tick-square" size={16} />}>Mark Complete</Button>
          <Button variant="link" rightIcon={<TPLibraryIcon name="arrow-right" size={16} />}>View All Patients</Button>
        </Row>
      </Section>
      <Section label="Report actions (split + icon-only)">
        <Row>
          <Button
            leftIcon={<TPLibraryIcon name="import" size={16} />}
            menu={[
              { id: 'pdf', label: 'Export as PDF', icon: <TPLibraryIcon name="document-text" size={16} /> },
              { id: 'csv', label: 'Export as CSV', icon: <TPLibraryIcon name="import" size={16} /> },
            ]}
          >
            Export Report
          </Button>
          <Button variant="outline" theme="error" leftIcon={<TPLibraryIcon name="trash" size={16} />}>Delete Report</Button>
          <Button variant="ghost" leftIcon={<TPLibraryIcon name="magic-star" size={16} />}>AI Summary</Button>
          <Button variant="ghost" theme="neutral" aria-label="More" icon={<TPLibraryIcon name="3-dots-more" size={20} />} />
        </Row>
      </Section>
    </div>
  ),
};

// ─── 16. Corner radius ───────────────────────────────────────────────────────────

export const Radius = {
  name: '⌗ Corner Radius',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section label="radius prop — number · pill · sharp">
        <Row gap={16}>
          <Button radius="sharp">Sharp</Button>
          <Button radius={4}>4px</Button>
          <Button>Default (10px)</Button>
          <Button radius={16}>16px</Button>
          <Button radius="pill">Pill</Button>
        </Row>
      </Section>
      <Section label="Per variant (pill)">
        <Row gap={16}>
          {['solid', 'outline', 'tonal'].map((variant) => (
            <Button key={variant} variant={variant} radius="pill" leftIcon={<TPLibraryIcon name="add" size={16} />}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </Row>
      </Section>
    </div>
  ),
};

// ─── 17. Full width ──────────────────────────────────────────────────────────────

export const FullWidth = {
  name: '↔ Full Width',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Button fullWidth leftIcon={<TPLibraryIcon name="add" size={18} />}>New Appointment</Button>
      <Button fullWidth variant="outline">Cancel</Button>
      <Button fullWidth variant="tonal" menu={splitMenu}>Save &amp; Continue</Button>
    </div>
  ),
};

// ─── 18. Polymorphic (as / href) ────────────────────────────────────────────────

export const Polymorphic = {
  name: '🔗 Polymorphic (anchor)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section label="href → renders a real <a> (identical styling)">
        <Row gap={16}>
          <Button href="#patients" variant="link" rightIcon={<TPLibraryIcon name="arrow-right" size={16} />}>
            View all patients
          </Button>
          <Button href="#export" variant="solid" leftIcon={<TPLibraryIcon name="import" size={16} />}>
            Download as link
          </Button>
          <Button href="#search" variant="ghost" aria-label="Search" icon={<TPLibraryIcon name="search-normal" size={20} />} />
        </Row>
      </Section>
      <Section label="as → render any element (e.g. an external anchor)">
        <Row gap={16}>
          <Button as="a" href="https://tatvacare.in" variant="outline" rightIcon={<TPLibraryIcon name="arrow-right" size={16} />}>
            Open site
          </Button>
        </Row>
      </Section>
      <Section label="asChild → merge the button look onto your own element (router Link / SSR)">
        <Row gap={16}>
          <Button asChild variant="solid">
            <a href="#go">As a solid link</a>
          </Button>
          <Button asChild variant="outline">
            <a href="#go">As an outline link</a>
          </Button>
          <Button asChild variant="tonal" theme="neutral">
            <a href="#go"><TPLibraryIcon name="add-square" size={20} />New (icon inside child)</a>
          </Button>
        </Row>
      </Section>
    </div>
  ),
};
