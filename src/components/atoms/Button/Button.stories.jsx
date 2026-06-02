/**
 * Button — the single TatvaPractice CTA.
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

import { Button } from './Button';
import {
  Plus, ChevronRight, Download, Trash2, Check, Pencil, Search, Sparkles,
  FileText, MoreVertical, Printer,
} from '@/src/components/atoms/icons/lucide';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

// ─── Shared helpers ────────────────────────────────────────────────────────────

const VARIANTS = ['solid', 'outline', 'ghost', 'tonal', 'link'];
const THEMES   = ['primary', 'neutral', 'error', 'success', 'warning'];
const SIZES    = ['sm', 'md', 'lg'];

const Row = ({ children, gap = 12 }) => (
  <div style={{ display: 'flex', gap, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

const Section = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--tp-slate-400, #54545C)' }}>
      {label}
    </span>
    {children}
  </div>
);

function iconForSize(size) {
  const px = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;
  return <Plus size={px} strokeWidth={2} />;
}

function chevronForSize(size) {
  const px = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;
  return <ChevronRight size={px} strokeWidth={2} />;
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

// Demo menu for the split shape in the Playground.
const DEMO_MENU = [
  { id: 'view',     label: 'View details',  icon: <FileText size={16} strokeWidth={1.75} /> },
  { id: 'download', label: 'Download PDF',  icon: <Download size={16} strokeWidth={1.75} /> },
  { id: 'delete',   label: 'Delete record', icon: <Trash2 size={16} strokeWidth={1.75} />, danger: true },
];

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    // Real Button props
    variant:  { control: 'select',       options: VARIANTS,            table: { category: 'Style' } },
    theme:    { control: 'select',       options: THEMES,              table: { category: 'Style' } },
    size:     { control: 'inline-radio', options: SIZES,               table: { category: 'Style' } },
    surface:  { control: 'inline-radio', options: ['light', 'dark'],   table: { category: 'Style' } },
    radius:   { control: { type: 'range', min: 0, max: 24, step: 1 }, name: 'corner radius (px)', table: { category: 'Style' } },
    loading:  { control: 'boolean',                                    table: { category: 'State' } },
    disabled: { control: 'boolean',                                    table: { category: 'State' } },
    children: { control: 'text', name: 'label',                        table: { category: 'Content' } },
    // Playground-only synthetic controls (icon/menu are React nodes, so they
    // can't be plain controls — these drive them via the render below).
    shape: {
      control: 'inline-radio',
      options: ['text', 'icon-only', 'split'],
      description: 'Demo only — which Button shape to render',
      table: { category: 'Shape (demo)' },
    },
    leftIconName:  { control: 'text', tpIcon: true, name: 'left icon',  description: 'TP icon ("" = none)', table: { category: 'Icons' } },
    rightIconName: { control: 'text', tpIcon: true, name: 'right icon', description: 'TP icon ("" = none)', table: { category: 'Icons' } },
    iconName:      { control: 'text', tpIcon: true, name: 'icon (icon-only / split)', table: { category: 'Icons' } },
  },
  args: {
    children: 'Button',
    variant:  'solid',
    theme:    'primary',
    size:     'md',
    surface:  'light',
    radius:    10,
    loading:  false,
    disabled: false,
    shape:     'text',
    leftIconName:  '',
    rightIconName: '',
    iconName:      'plus',
  },
};

export default meta;

// ─── 1. Playground ─────────────────────────────────────────────────────────────

const ICON_FOR = (size) => (size === 'sm' ? 16 : size === 'lg' ? 20 : 18);

export const Playground = {
  name: '🎛 Playground',
  // For surface="dark", switch the canvas background via the Storybook
  // toolbar (Backgrounds → Dark) rather than a hardcoded backdrop.
  render: ({ shape, leftIconName, rightIconName, iconName, radius, children, ...args }) => {
    const px = ICON_FOR(args.size);
    const style = { '--tp-btn-radius': `${radius}px` };
    const lib = (name) => (name ? <TPLibraryIcon name={name} size={px} /> : undefined);

    if (shape === 'icon-only') {
      return <Button {...args} style={style} aria-label={children || 'Action'} icon={lib(iconName) || <TPLibraryIcon name="plus" size={px} />} />;
    }

    if (shape === 'split') {
      return (
        <Button {...args} style={style} icon={lib(iconName)} menu={DEMO_MENU}>
          {children}
        </Button>
      );
    }

    // text
    return (
      <Button {...args} style={style} leftIcon={lib(leftIconName)} rightIcon={lib(rightIconName)}>
        {children}
      </Button>
    );
  }
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
            <Button key={variant} variant={variant} aria-label="Add" icon={<Plus size={20} />} />
          ))}
        </Row>
      </Section>
      <Section label="Shape: split (per variant)">
        <Row gap={16}>
          {['solid', 'outline', 'tonal'].map((variant) => (
            <Button key={variant} variant={variant} icon={<Plus size={16} />} menu={DEMO_MENU}>
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
            <Button key={variant} variant={variant} aria-label="Search" icon={<Search size={20} />} />
          ))}
        </Row>
      </Section>
      <Section label="Sizes (tonal / neutral)">
        <Row gap={16}>
          {SIZES.map((size) => (
            <Button key={size} variant="tonal" theme="neutral" size={size} aria-label="Edit" icon={<Pencil size={size === 'sm' ? 18 : size === 'lg' ? 22 : 20} />} />
          ))}
        </Row>
      </Section>
      <Section label="Common actions">
        <Row>
          <Button variant="ghost" theme="neutral" aria-label="More" icon={<MoreVertical size={20} />} />
          <Button variant="ghost" theme="neutral" aria-label="Print" icon={<Printer size={20} />} />
          <Button variant="ghost" theme="error" aria-label="Delete" icon={<Trash2 size={20} />} />
          <Button variant="solid" aria-label="Add" icon={<Plus size={20} />} />
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
          <span key={v} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--tp-slate-400, #54545C)', textAlign: 'center' }}>
            {v}
          </span>
        ))}
      </div>
      {THEMES.map((theme) => (
        <div key={theme} style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tp-slate-600, #54545C)' }}>
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
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tp-slate-400, #54545C)' }}>Disabled</span>
        {VARIANTS.map((variant) => (
          <div key={variant} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant={variant} disabled>Label</Button>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tp-slate-400, #54545C)' }}>Loading</span>
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
            <Button variant={variant} leftIcon={<Plus size={16} strokeWidth={2} />}>Add Patient</Button>
            <Button variant={variant} rightIcon={<ChevronRight size={16} strokeWidth={2} />}>View Details</Button>
            <Button variant={variant} leftIcon={<Download size={16} strokeWidth={2} />} rightIcon={<ChevronRight size={16} strokeWidth={2} />}>Export Report</Button>
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
            <Button key={variant} variant={variant} theme="error" leftIcon={<Trash2 size={16} strokeWidth={2} />}>Delete</Button>
          ))}
        </Row>
      </Section>
    </div>
  ),
};

// ─── 11. Split Button — All Variants ──────────────────────────────────────────

const splitMenu = [
  { id: 'view',     label: 'View details',  icon: <FileText size={16} strokeWidth={1.75} /> },
  { id: 'download', label: 'Download PDF',  icon: <Download size={16} strokeWidth={1.75} /> },
  { id: 'copy',     label: 'Duplicate',     icon: <Plus size={16} strokeWidth={1.75} /> },
  { id: 'delete',   label: 'Delete record', icon: <Trash2 size={16} strokeWidth={1.75} />, danger: true },
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
            <Button variant={variant} surface="dark" icon={<Plus size={16} strokeWidth={1.75} />} menu={splitMenu}>Save Report</Button>
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
          <Button leftIcon={<Plus size={16} strokeWidth={2} />}>New Patient</Button>
          <Button variant="outline" leftIcon={<Pencil size={16} strokeWidth={2} />}>Edit Profile</Button>
          <Button variant="ghost" leftIcon={<Search size={16} strokeWidth={2} />}>Search Records</Button>
          <Button variant="tonal" leftIcon={<Check size={16} strokeWidth={2} />}>Mark Complete</Button>
          <Button variant="link" rightIcon={<ChevronRight size={16} strokeWidth={2} />}>View All Patients</Button>
        </Row>
      </Section>
      <Section label="Report actions (split + icon-only)">
        <Row>
          <Button
            leftIcon={<Download size={16} strokeWidth={2} />}
            menu={[
              { id: 'pdf', label: 'Export as PDF', icon: <FileText size={16} strokeWidth={1.75} /> },
              { id: 'csv', label: 'Export as CSV', icon: <Download size={16} strokeWidth={1.75} /> },
            ]}
          >
            Export Report
          </Button>
          <Button variant="outline" theme="error" leftIcon={<Trash2 size={16} strokeWidth={2} />}>Delete Report</Button>
          <Button variant="ghost" leftIcon={<Sparkles size={16} strokeWidth={2} />}>AI Summary</Button>
          <Button variant="ghost" theme="neutral" aria-label="More" icon={<MoreVertical size={20} />} />
        </Row>
      </Section>
    </div>
  ),
};
