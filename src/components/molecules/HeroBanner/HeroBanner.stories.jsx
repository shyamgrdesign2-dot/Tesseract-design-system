import { HeroBanner } from './HeroBanner';
import { Button } from '@/src/components/atoms/Button';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

// ── CTA model ────────────────────────────────────────────────────────────────
// Up to THREE generic CTAs (CTA 1 / 2 / 3 — no fixed roles, no separate trailing
// "end icon"). Each is the same dark-surface <Button>; the Playground exposes that
// Button's knobs per CTA — variant, shape (text · icon-only · split), icon (which
// glyph + on/off), label — so a CTA can be text, text-with-icon, or fully
// icon-only, placed however you want. The banner is dark-only, so every CTA is
// surface="dark".
const CTA_VARIANTS = ['none', 'solid', 'outline', 'ghost', 'tonal', 'link'];
const CTA_SHAPES = ['text', 'icon', 'split'];
const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];
const TONES = ['violet', 'blue', 'slate', 'dark'];

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

// Placement — which CTA sits first / second / third in the row.
const CTA_ORDERS = ['1, 2, 3', '3, 2, 1', '2, 1, 3', '3, 1, 2'];

const meta = {
  title: 'Molecules/HeroBanner',
  component: HeroBanner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    // ── Content ──
    eyebrow:        { control: 'text', name: 'eyebrow (kicker)', description: 'Small label above the title; blank = none', table: { category: 'Content' } },
    title:          { control: 'text', table: { category: 'Content' } },
    titleSize:      { control: 'inline-radio', options: ['sm', 'md'], description: '18px / 24px', table: { category: 'Content' } },
    showSubtitle:   { control: 'boolean', name: 'with subtitle', table: { category: 'Content' } },
    subtitle:       { control: 'text', table: { category: 'Content' } },
    subtitleSize:   { control: 'inline-radio', options: ['sm', 'md'], description: '13px / 16px', table: { category: 'Content' } },
    showBackButton: { control: 'boolean', name: 'with back button', table: { category: 'Content' } },
    backIcon:        { control: 'text', tpIcon: true, name: 'back icon', table: { category: 'Content' } },
    backIconVariant: { control: 'select', options: ICON_VARIANTS, name: 'back icon style', table: { category: 'Content' } },

    // ── Appearance ──  (pattern opacity is fixed at 100%, no control)
    tone:         { control: 'inline-radio', options: TONES, description: 'Gradient tone (token-only); violet = default look', table: { category: 'Appearance' } },
    background:   { control: 'text', name: 'background (override)', description: 'Full CSS background string; wins over tone. Blank = use tone', table: { category: 'Appearance' } },
    size:         { control: 'select', options: ['sm', 'md', 'lg'], description: 'height 80 / 120 / 160', table: { category: 'Appearance' } },
    height:       { control: { type: 'number', min: 0, step: 4 }, name: 'height (override)', description: 'Numeric height; overrides size. Blank = use size', table: { category: 'Appearance' } },
    align:        { control: 'inline-radio', options: ['center', 'top'], description: 'Vertical alignment of the content block', table: { category: 'Appearance' } },
    bottomRadius: { control: { type: 'range', min: 0, max: 42, step: 1 }, name: 'bottom radius (L + R)', table: { category: 'Appearance' } },
    pattern:      { control: 'boolean', name: 'with pattern', table: { category: 'Appearance' } },

    // ── Actions — up to 3 CTAs, each a dark-surface Button (text / icon / split) ──
    // Shared
    ctaSize:  { control: 'inline-radio', options: ['sm', 'md'], name: 'CTA size', table: { category: 'Actions' } },
    iconSize: { control: { type: 'range', min: 12, max: 24, step: 1 }, name: 'icon size', table: { category: 'Actions' } },
    ctaOrder: { control: 'select', options: CTA_ORDERS, name: 'placement (order)', table: { category: 'Actions' } },

    // CTA 1
    cta1Variant:  { control: 'select', options: CTA_VARIANTS, name: 'CTA 1 · variant', table: { category: 'CTA 1' } },
    cta1Shape:    { control: 'inline-radio', options: CTA_SHAPES, name: 'CTA 1 · shape', table: { category: 'CTA 1' } },
    cta1Icon:     { control: 'boolean', name: 'CTA 1 · with icon', table: { category: 'CTA 1' } },
    cta1IconName: { control: 'text', tpIcon: true, name: 'CTA 1 · icon', description: 'Pick from the Tesseract Icons panel (or type a name)', table: { category: 'CTA 1' } },
    cta1Label:    { control: 'text', name: 'CTA 1 · label', table: { category: 'CTA 1' } },

    // CTA 2
    cta2Variant:  { control: 'select', options: CTA_VARIANTS, name: 'CTA 2 · variant', table: { category: 'CTA 2' } },
    cta2Shape:    { control: 'inline-radio', options: CTA_SHAPES, name: 'CTA 2 · shape', table: { category: 'CTA 2' } },
    cta2Icon:     { control: 'boolean', name: 'CTA 2 · with icon', table: { category: 'CTA 2' } },
    cta2IconName: { control: 'text', tpIcon: true, name: 'CTA 2 · icon', description: 'Pick from the Tesseract Icons panel (or type a name)', table: { category: 'CTA 2' } },
    cta2Label:    { control: 'text', name: 'CTA 2 · label', table: { category: 'CTA 2' } },

    // CTA 3
    cta3Variant:  { control: 'select', options: CTA_VARIANTS, name: 'CTA 3 · variant', table: { category: 'CTA 3' } },
    cta3Shape:    { control: 'inline-radio', options: CTA_SHAPES, name: 'CTA 3 · shape', table: { category: 'CTA 3' } },
    cta3Icon:     { control: 'boolean', name: 'CTA 3 · with icon', table: { category: 'CTA 3' } },
    cta3IconName: { control: 'text', tpIcon: true, name: 'CTA 3 · icon', description: 'Pick from the Tesseract Icons panel (or type a name)', table: { category: 'CTA 3' } },
    cta3Label:    { control: 'text', name: 'CTA 3 · label', table: { category: 'CTA 3' } },

    // synthetic-only — keep the real props out of the table
    actions: { table: { disable: true } },
  },
  args: {
    eyebrow: '',
    title: 'Your Appointments',
    titleSize: 'md',
    showSubtitle: true,
    subtitle: '32 scheduled today · 4 awaiting confirmation',
    subtitleSize: 'sm',
    showBackButton: false,
    backIcon: 'arrow-left',
    backIconVariant: 'linear',

    tone: 'violet',
    background: '',
    size: 'md',
    height: undefined,
    align: 'center',
    bottomRadius: 24,
    pattern: true,

    ctaSize: 'sm',
    iconSize: 16,
    // Default = the production header CTAs: Add Appointment (secondary) +
    // Start Walk-in (primary). Add the 3rd CTA back via controls if needed.
    ctaOrder: '1, 2',

    cta1Variant: 'outline',
    cta1Shape: 'text',
    cta1Icon: true,
    cta1IconName: 'add',
    cta1Label: 'Add Appointment',

    cta2Variant: 'solid',
    cta2Shape: 'text',
    cta2Icon: true,
    cta2IconName: 'flash',
    cta2Label: 'Start Walk-in',

    // Third CTA defaults to an icon-only Button (a "more" kebab) — replaces the
    // old separate end-icon: it is just another configurable CTA.
    cta3Variant: 'ghost',
    cta3Shape: 'icon',
    cta3Icon: true,
    cta3IconName: 'more',
    cta3Label: 'More options',
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
  if (!ctas.length) return undefined;
  return <>{ctas}</>;
}

// Accurate, copy-paste snippet (mirrors Badge's "Show code"). Only non-default
// props are emitted, so the snippet stays minimal at the default look.
const heroBackCode = (a) => {
  const lines = [];
  if (a.eyebrow) lines.push(`  eyebrow="${a.eyebrow}"`);
  lines.push(`  title="${a.title}"`);
  if (a.tone && a.tone !== 'violet') lines.push(`  tone="${a.tone}"`);
  if (a.background) lines.push(`  background="${a.background}"`);
  if (a.align && a.align !== 'center') lines.push(`  align="${a.align}"`);
  if (a.height) lines.push(`  height={${a.height}}`);
  if (a.showBackButton) {
    lines.push('  showBackButton');
    if (a.backIcon && a.backIcon !== 'arrow-left') lines.push(`  backIcon="${a.backIcon}"`);
    if (a.backIconVariant && a.backIconVariant !== 'linear') lines.push(`  backIconVariant="${a.backIconVariant}"`);
  }
  return `<HeroBanner\n${lines.join('\n')}\n  /* …size, subtitle, actions… */\n/>`;
};

export const Playground = {
  args: {
    cta1IconName: "calendar-2"
  },
  parameters: { docs: { source: { transform: (_code, ctx) => heroBackCode(ctx.args) } } },
  render:(args) => (
    <HeroBanner
      size={args.size}
      height={args.height || undefined}
      tone={args.tone}
      background={args.background || undefined}
      align={args.align}
      bottomRadius={args.bottomRadius}
      eyebrow={args.eyebrow || undefined}
      title={args.title}
      titleSize={args.titleSize}
      subtitle={args.showSubtitle ? args.subtitle : undefined}
      subtitleSize={args.subtitleSize}
      showBackButton={args.showBackButton}
      backIcon={args.backIcon}
      backIconVariant={args.backIconVariant}
      pattern={args.pattern}
      actions={renderActions(args)}
    />
  )
};

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HeroBanner size="sm" title="Small Banner (80px)" />
      <HeroBanner size="md" title="Medium Banner (120px)" />
      <HeroBanner size="lg" title="Large Banner (160px)" />
    </div>
  ),
};

export const WithSubtitle = {
  render: () => (
    <HeroBanner title="Appointments" subtitle="Manage your daily patient schedule" />
  ),
};

export const WithBackButton = {
  render: () => (
    <HeroBanner showBackButton title="Patient Details" subtitle="UHID 2048871 · 42y · Male" />
  ),
};

// ── CTA configurability ──────────────────────────────────────────────────────
// The `actions` slot takes dark-surface Buttons in whatever shape the flow
// needs — text, icon-only, or split. All CTAs ship with an icon.

/** Standard CTAs — text Buttons with leading icons. */
export const ActionsWithButtons = {
  name: 'CTAs · Text',
  render: () => (
    <HeroBanner
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
    <HeroBanner
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
    <HeroBanner
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

/** Three CTAs — text + text + a fully icon-only CTA (the kebab is just a CTA). */
export const ThreeCtas = {
  name: 'CTAs · Three (incl. icon-only)',
  render: () => (
    <HeroBanner
      size="lg"
      title="Appointments"
      subtitle="Two text CTAs and a third icon-only CTA — max three"
      actions={
        <>
          <Button surface="dark" variant="outline" size="sm" leftIcon={<TPIcon name="filter" size={16} />}>Filter</Button>
          <Button surface="dark" variant="solid" size="sm" leftIcon={<PlusIcon size={16} />}>New appointment</Button>
          <Button surface="dark" variant="ghost" theme="neutral" size="sm" aria-label="More options" icon={<TPIcon name="more-horizontal" size={18} />} />
        </>
      }
    />
  ),
};

/** All three CTA shapes together — icon-only + split + text. */
export const AllCtaTypes = {
  name: 'CTAs · All Shapes',
  render: () => (
    <HeroBanner
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
      <HeroBanner size="md" titleSize="sm" title="Small Title (18px)" subtitle="With a supporting subtext" showBackButton />
      <HeroBanner size="md" titleSize="md" title="Medium Title (24px)" subtitle="With a supporting subtext" showBackButton />
    </div>
  ),
};

export const BottomRadius = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HeroBanner bottomRadius={0} title="No Bottom Radius (0)" />
      <HeroBanner title="Default — md size (24)" />
      <HeroBanner bottomRadius={42} title="Max Bottom Radius (42)" />
    </div>
  ),
};

/** Tones — token-only gradient reskins. "violet" is the default look. */
export const Tones = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {TONES.map((tone) => (
        <HeroBanner key={tone} tone={tone} title={`${tone[0].toUpperCase()}${tone.slice(1)} tone`} subtitle="Same hero, reskinned per page / specialty" />
      ))}
    </div>
  ),
};

/** Eyebrow kicker + top-aligned content (taller banner). */
export const EyebrowAndAlign = {
  name: 'Eyebrow + align="top"',
  render: () => (
    <HeroBanner
      height={180}
      align="top"
      eyebrow="Cardiology · OPD Block B"
      title="Outpatient Appointments"
      subtitle="32 scheduled today · 4 awaiting confirmation"
      showBackButton
    />
  ),
};

export const FullFeatured = {
  render: () => (
    <HeroBanner
      size="lg"
      eyebrow="Today · OPD Block B"
      title="Outpatient Appointments"
      subtitle="Cardiology · 32 scheduled today"
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
