import { TPBanner } from './TPBanner';
import { Button } from '@/src/components/atoms/Button';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

// ── CTA model ────────────────────────────────────────────────────────────────
// Up to three generic CTAs (CTA 1 / 2 / 3 — no fixed roles). The banner reuses
// the same dark-surface <Button>; the Playground exposes that Button's knobs per
// CTA — variant, shape (text · icon-only · split), icon (which glyph + on/off),
// label — so you can place and configure each one however you want. The banner
// is dark-only, so every CTA is surface="dark".
const CTA_VARIANTS = ['none', 'solid', 'outline', 'ghost', 'tonal', 'link'];
const CTA_SHAPES = ['text', 'icon', 'split'];

// Clean line plus (two crossing strokes) — matches the accordion-style line
// icons, not the chunky TP_Icons "Plus" silhouette.
const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden focusable="false">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// Resolve a glyph from a full-library icon name (rendered mask-themed).
const ctaIcon = (name, size) => <TPLibraryIcon name={name} size={size} />;

const DEMO_MENU = [
  { id: 'walkin',   label: 'Walk-in',   icon: <TPIcon name="calendar" size={16} /> },
  { id: 'followup', label: 'Follow-up', icon: <TPIcon name="edit" size={16} /> },
  { id: 'export',   label: 'Export',    icon: <TPIcon name="download" size={16} /> },
];

// One CTA slot → a dark-surface Button (or null when variant === 'none').
function buildCta(key, { variant, shape, label, withIcon, iconName, ctaSize, iconSize }) {
  if (!variant || variant === 'none') return null;
  const text = label || key;
  const glyph = ctaIcon(iconName, iconSize);

  if (shape === 'icon') {
    return (
      <Button key={key} surface="dark" variant={variant} size={ctaSize}
        aria-label={text} icon={glyph} />
    );
  }
  if (shape === 'split') {
    return (
      <Button key={key} surface="dark" variant={variant} size={ctaSize}
        icon={glyph} menu={DEMO_MENU}>
        {text}
      </Button>
    );
  }
  // text — icon is optional
  return (
    <Button key={key} surface="dark" variant={variant} size={ctaSize}
      leftIcon={withIcon ? glyph : undefined}>
      {text}
    </Button>
  );
}

// Trailing icon-only Button. The "more" three-dots uses the bold variant
// rotated 90° → a vertical kebab (⋮). Toggle it off via endIcon: 'none'.
function EndIconButton({ name, size, iconSize }) {
  const isMore = name === 'more';
  return (
    <Button
      surface="dark"
      variant="ghost"
      theme="neutral"
      size={size}
      aria-label={isMore ? 'More options' : name}
      icon={
        <TPIcon
          name={isMore ? 'more-horizontal' : name}
          size={iconSize + 2}
          style={isMore ? { transform: 'rotate(90deg)' } : undefined}
        />
      }
    />
  );
}

const END_ICONS = ['none', 'more', 'search', 'settings', 'filter', 'printer'];
// Placement — which CTA sits first / second / third in the row.
const CTA_ORDERS = ['1, 2, 3', '3, 2, 1', '2, 1, 3', '3, 1, 2'];

const meta = {
  title: 'Molecules/TPBanner',
  component: TPBanner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    // ── Content ──
    title:          { control: 'text', table: { category: 'Content' } },
    titleSize:      { control: 'inline-radio', options: ['sm', 'md'], description: '18px / 24px', table: { category: 'Content' } },
    showSubtitle:   { control: 'boolean', name: 'with subtitle', table: { category: 'Content' } },
    subtitle:       { control: 'text', table: { category: 'Content' } },
    subtitleSize:   { control: 'inline-radio', options: ['sm', 'md'], description: '13px / 16px', table: { category: 'Content' } },
    showBackButton: { control: 'boolean', name: 'with back button', table: { category: 'Content' } },

    // ── Appearance ──  (pattern opacity is fixed at 100%, no control)
    size:         { control: 'select', options: ['sm', 'md', 'lg'], description: 'height 80 / 120 / 160', table: { category: 'Appearance' } },
    bottomRadius: { control: { type: 'range', min: 0, max: 32, step: 1 }, name: 'bottom radius (L + R)', table: { category: 'Appearance' } },
    pattern:      { control: 'boolean', name: 'with pattern', table: { category: 'Appearance' } },

    // ── Actions — up to 3 CTAs (each a dark-surface Button) + a trailing icon ──
    // Shared
    ctaSize:  { control: 'inline-radio', options: ['sm', 'md'], name: 'CTA size', table: { category: 'Actions' } },
    iconSize: { control: { type: 'range', min: 12, max: 24, step: 1 }, name: 'icon size', table: { category: 'Actions' } },
    ctaOrder: { control: 'select', options: CTA_ORDERS, name: 'placement (order)', table: { category: 'Actions' } },
    endIcon:  { control: 'select', options: END_ICONS, name: 'end icon', description: 'trailing icon-only Button', table: { category: 'Actions' } },

    // CTA 1
    cta1Variant:  { control: 'select', options: CTA_VARIANTS, name: 'CTA 1 · variant', table: { category: 'CTA 1' } },
    cta1Shape:    { control: 'inline-radio', options: CTA_SHAPES, name: 'CTA 1 · shape', table: { category: 'CTA 1' } },
    cta1Icon:     { control: 'boolean', name: 'CTA 1 · with icon', table: { category: 'CTA 1' } },
    cta1IconName: { control: 'text', tpIcon: true, name: 'CTA 1 · icon', description: 'Pick from the TP Icons panel (or type a name)', table: { category: 'CTA 1' } },
    cta1Label:    { control: 'text', name: 'CTA 1 · label', table: { category: 'CTA 1' } },

    // CTA 2
    cta2Variant:  { control: 'select', options: CTA_VARIANTS, name: 'CTA 2 · variant', table: { category: 'CTA 2' } },
    cta2Shape:    { control: 'inline-radio', options: CTA_SHAPES, name: 'CTA 2 · shape', table: { category: 'CTA 2' } },
    cta2Icon:     { control: 'boolean', name: 'CTA 2 · with icon', table: { category: 'CTA 2' } },
    cta2IconName: { control: 'text', tpIcon: true, name: 'CTA 2 · icon', description: 'Pick from the TP Icons panel (or type a name)', table: { category: 'CTA 2' } },
    cta2Label:    { control: 'text', name: 'CTA 2 · label', table: { category: 'CTA 2' } },

    // CTA 3
    cta3Variant:  { control: 'select', options: CTA_VARIANTS, name: 'CTA 3 · variant', table: { category: 'CTA 3' } },
    cta3Shape:    { control: 'inline-radio', options: CTA_SHAPES, name: 'CTA 3 · shape', table: { category: 'CTA 3' } },
    cta3Icon:     { control: 'boolean', name: 'CTA 3 · with icon', table: { category: 'CTA 3' } },
    cta3IconName: { control: 'text', tpIcon: true, name: 'CTA 3 · icon', description: 'Pick from the TP Icons panel (or type a name)', table: { category: 'CTA 3' } },
    cta3Label:    { control: 'text', name: 'CTA 3 · label', table: { category: 'CTA 3' } },

    // synthetic-only — keep the real props out of the table
    actions: { table: { disable: true } },
  },
  args: {
    title: 'Appointments',
    titleSize: 'md',
    showSubtitle: true,
    subtitle: '32 scheduled today · 4 awaiting confirmation',
    subtitleSize: 'sm',
    showBackButton: false,

    size: 'md',
    bottomRadius: 18,
    pattern: true,

    ctaSize: 'sm',
    iconSize: 16,
    ctaOrder: '1, 2, 3',
    endIcon: 'more',

    cta1Variant: 'outline',
    cta1Shape: 'text',
    cta1Icon: true,
    cta1IconName: 'colorfilter',
    cta1Label: 'Filter',

    cta2Variant: 'solid',
    cta2Shape: 'text',
    cta2Icon: true,
    cta2IconName: 'plus',
    cta2Label: 'New appointment',

    cta3Variant: 'none',
    cta3Shape: 'text',
    cta3Icon: true,
    cta3IconName: 'download',
    cta3Label: 'Export',
  },
};

export default meta;

// Assemble the actions slot from the per-CTA Button controls (max three CTAs).
function renderActions(a) {
  const slots = {
    1: { variant: a.cta1Variant, shape: a.cta1Shape, label: a.cta1Label, withIcon: a.cta1Icon, iconName: a.cta1IconName, ctaSize: a.ctaSize, iconSize: a.iconSize },
    2: { variant: a.cta2Variant, shape: a.cta2Shape, label: a.cta2Label, withIcon: a.cta2Icon, iconName: a.cta2IconName, ctaSize: a.ctaSize, iconSize: a.iconSize },
    3: { variant: a.cta3Variant, shape: a.cta3Shape, label: a.cta3Label, withIcon: a.cta3Icon, iconName: a.cta3IconName, ctaSize: a.ctaSize, iconSize: a.iconSize },
  };
  const order = (a.ctaOrder || '1, 2, 3').split(',').map((s) => s.trim());

  const ctas = order.map((n) => buildCta(`cta${n}`, slots[n])).filter(Boolean);
  const end = a.endIcon && a.endIcon !== 'none' ? <EndIconButton name={a.endIcon} size={a.ctaSize} iconSize={a.iconSize} /> : null;

  if (!ctas.length && !end) return undefined;
  return <>{ctas}{end}</>;
}

export const Playground = {
  render: (args) => (
    <TPBanner
      size={args.size}
      bottomRadius={args.bottomRadius}
      title={args.title}
      titleSize={args.titleSize}
      subtitle={args.showSubtitle ? args.subtitle : undefined}
      subtitleSize={args.subtitleSize}
      showBackButton={args.showBackButton}
      pattern={args.pattern}
      actions={renderActions(args)}
    />
  ),
};

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TPBanner size="sm" title="Small Banner (80px)" />
      <TPBanner size="md" title="Medium Banner (120px)" />
      <TPBanner size="lg" title="Large Banner (160px)" />
    </div>
  ),
};

export const WithSubtitle = {
  render: () => (
    <TPBanner title="Appointments" subtitle="Manage your daily patient schedule" />
  ),
};

export const WithBackButton = {
  render: () => (
    <TPBanner showBackButton title="Patient Details" subtitle="UHID 2048871 · 42y · Male" />
  ),
};

// ── CTA configurability ──────────────────────────────────────────────────────
// The `actions` slot takes dark-surface Buttons in whatever shape the flow
// needs — text, icon-only, or split. All CTAs ship with an icon.

/** Standard CTAs — text Buttons with leading icons. */
export const ActionsWithButtons = {
  name: 'CTAs · Text',
  render: () => (
    <TPBanner
      title="Appointments"
      subtitle="32 scheduled today · 4 awaiting confirmation"
      actions={
        <>
          <Button surface="dark" variant="outline" size="sm" leftIcon={<TPIcon name="filter" size={16} />}>
            Filter
          </Button>
          <Button surface="dark" variant="solid" size="sm" leftIcon={<PlusIcon size={16} />}>
            New appointment
          </Button>
        </>
      }
    />
  ),
};

/** Compact icon-only CTAs. */
export const ActionsWithIconButtons = {
  name: 'CTAs · Icon-only',
  render: () => (
    <TPBanner
      title="Appointments"
      subtitle="Compact, icon-only quick actions"
      actions={
        <>
          <Button surface="dark" variant="tonal" theme="neutral" size="sm" aria-label="Search" icon={<TPIcon name="search" size={18} />} />
          <Button surface="dark" variant="tonal" theme="neutral" size="sm" aria-label="Print" icon={<TPIcon name="printer" size={18} />} />
          <Button surface="dark" variant="tonal" theme="neutral" size="sm" aria-label="More options" icon={<TPIcon name="more-horizontal" size={18} />} />
        </>
      }
    />
  ),
};

/** Primary action + menu — split Button (every option carries an icon). */
export const ActionsWithSplitButton = {
  name: 'CTAs · Split',
  render: () => (
    <TPBanner
      title="Appointments"
      subtitle="Primary action with a grouped dropdown"
      actions={
        <Button
          surface="dark"
          size="sm"
          variant="solid"
          icon={<PlusIcon size={16} />}
          menu={[
            { id: 'walkin', label: 'Walk-in', icon: <TPIcon name="calendar" size={16} /> },
            { id: 'followup', label: 'Follow-up', icon: <TPIcon name="edit" size={16} /> },
            { id: 'export', label: 'Export list', icon: <TPIcon name="download" size={16} /> },
          ]}
        >
          New appointment
        </Button>
      }
    />
  ),
};

/** Three CTAs (tertiary + secondary + primary) plus a trailing more (•••) icon. */
export const ThreeCtasWithEndIcon = {
  name: 'CTAs · Three + end icon',
  render: () => (
    <TPBanner
      size="lg"
      title="Appointments"
      subtitle="Tertiary · secondary · primary, then a trailing icon"
      actions={
        <>
          <Button surface="dark" variant="ghost" size="sm" leftIcon={<TPIcon name="download" size={16} />}>Export</Button>
          <Button surface="dark" variant="outline" size="sm" leftIcon={<TPIcon name="filter" size={16} />}>Filter</Button>
          <Button surface="dark" variant="solid" size="sm" leftIcon={<PlusIcon size={16} />}>New appointment</Button>
          <EndIconButton name="more" size="sm" iconSize={16} />
        </>
      }
    />
  ),
};

/** All three CTA shapes together — icon-only + split + text. */
export const AllCtaTypes = {
  name: 'CTAs · All Shapes',
  render: () => (
    <TPBanner
      size="lg"
      titleSize="md"
      title="Appointments"
      subtitle="Icon-only + split + text"
      actions={
        <>
          <Button surface="dark" variant="tonal" theme="neutral" size="sm" aria-label="Search" icon={<TPIcon name="search" size={18} />} />
          <Button
            surface="dark"
            size="sm"
            variant="outline"
            icon={<TPIcon name="download" size={16} />}
            menu={[
              { id: 'pdf', label: 'Export as PDF', icon: <TPIcon name="printer" size={16} /> },
              { id: 'csv', label: 'Export as CSV', icon: <TPIcon name="download" size={16} /> },
            ]}
          >
            Export
          </Button>
          <Button surface="dark" variant="solid" size="sm" leftIcon={<PlusIcon size={16} />}>
            New appointment
          </Button>
        </>
      }
    />
  ),
};

export const TitleSizes = {
  name: 'Title Sizes (18 / 24)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TPBanner size="md" titleSize="sm" title="Small Title (18px)" subtitle="With a supporting subtext" showBackButton />
      <TPBanner size="md" titleSize="md" title="Medium Title (24px)" subtitle="With a supporting subtext" showBackButton />
    </div>
  ),
};

export const BottomRadius = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TPBanner bottomRadius={0} title="No Bottom Radius (0)" />
      <TPBanner title="Default — md size (18)" />
      <TPBanner bottomRadius={32} title="Large Bottom Radius (32)" />
    </div>
  ),
};

export const FullFeatured = {
  render: () => (
    <TPBanner
      size="lg"
      title="Outpatient Appointments"
      subtitle="Cardiology · OPD Block B"
      titleSize="md"
      subtitleSize="sm"
      showBackButton
      pattern
      actions={
        <>
          <Button surface="dark" variant="tonal" theme="neutral" size="sm" aria-label="Print" icon={<TPIcon name="printer" size={18} />} />
          <Button surface="dark" variant="outline" size="sm" leftIcon={<TPIcon name="filter" size={16} />}>
            Filter
          </Button>
          <Button
            surface="dark"
            size="sm"
            variant="solid"
            icon={<PlusIcon size={16} />}
            menu={[
              { id: 'walkin', label: 'Walk-in', icon: <TPIcon name="calendar" size={16} /> },
              { id: 'followup', label: 'Follow-up', icon: <TPIcon name="edit" size={16} /> },
            ]}
          >
            New appointment
          </Button>
        </>
      }
    />
  ),
};
