import React from 'react';
import { Header } from './Header';
import { Logo } from '@/src/components/atoms/Logo';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

// Header logo — the actual gradient wordmark, min height 32px (width auto).
const HeaderLogo = () => <Logo variant="wordmark" tone="gradient" height={32} />;

const END_VISIT_MENU = [
  { id: 'save', label: 'Save & exit' },
  { id: 'discard', label: 'Discard visit' },
];

// Clinic options for the clinic switcher (single-select; >5 → searchable).
const clinicIcon = () => <TPLibraryIcon name="building" size={16} />;
const CLINICS = [
  { value: 'rajeshwar', label: 'Rajeshwar Eye Clinic', icon: clinicIcon() },
  { value: 'apex', label: 'Apex Ortho Clinic', icon: clinicIcon() },
  { value: 'sunrise', label: 'Sunrise Multispeciality', icon: clinicIcon() },
  { value: 'citycare', label: 'City Care Hospital', icon: clinicIcon() },
  { value: 'lotus', label: 'Lotus Dental & Skin', icon: clinicIcon() },
  { value: 'green', label: 'Green Valley Clinic', icon: clinicIcon() },
  { value: 'metro', label: 'Metro Heart Institute', icon: clinicIcon() },
];

// Stateful clinic switcher used in presets.
function ClinicHeader({ children, ...props }) {
  const [clinic, setClinic] = React.useState('rajeshwar');
  const clinicAction = { type: 'select', icon: 'building', options: CLINICS, value: clinic, onChange: setClinic };
  return <Header {...props} actions={props.actions.map((a) => (a === '__clinic__' ? clinicAction : a))} />;
}

const meta = {
  title: 'Molecules/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: [
      'One configurable application top bar — left side identity, right side an ordered list of actions.',
      '',
      '**When to use** — the page or app-shell header: a home/shell bar (logo + tools + clinic switcher + avatar), an RxPad bar (back + patient + CTAs), or a titled section header.',
      '**When not** — for in-page side navigation use `Sidebar` / `SecondarySidebar`, not this top bar.',
      '',
      '**Key props** — the left slot is one of `logo`, `user`, or `title` (+ optional `subtitle`), with `back` (+ `backIcon`) for a full-height back button; `actions` is an ordered list (max 8) of typed items — `cta`, `info`, `divider`, `select`, plus the special `tutorial` and `avatar`; `trailing` is a free-form node rendered after the actions; `density` (`comfortable` / `compact`) sets control height; `sticky` + `elevation` pin the bar with a shadow; `background` overrides the bar fill via a token.',
      '',
      '**Good to know** — every action except `tutorial` and `avatar` is a CTA rendered through the Button atom; dividers are placed explicitly in the `actions` array wherever you want them (not auto-inserted). Reuses the Button / Avatar / Divider / Badge / Logo atoms.',
    ].join('\n') } },
  },
  // Meta-level argTypes so the autodocs args table documents the REAL component
  // props (description + control), not just the Playground's synthetic controls.
  argTypes: {
    back:            { control: 'boolean', description: 'Show the back button (a small, control-sized icon button)', table: { category: 'Left' } },
    backDivider:     { control: 'boolean', description: 'Vertical rule after the back button when the left cluster has following content (default on)', table: { category: 'Left' } },
    backIcon:        { control: 'text', description: 'Back glyph name (default "arrow-left3")', table: { category: 'Left' } },
    backIconVariant: { control: 'select', options: ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'], description: 'Back glyph style', table: { category: 'Left' } },
    backIconCorner:  { control: 'inline-radio', options: ['straight', 'rounded'], description: 'Back glyph corner variant (default "straight")', table: { category: 'Left' } },
    title:           { control: 'text', description: 'Leading title (string or node)', table: { category: 'Left' } },
    subtitle:        { control: 'text', description: 'Subtext under the title', table: { category: 'Left' } },
    align:           { control: 'inline-radio', options: ['left', 'center'], description: 'left (default) or center-aligned title (MD3 center top app bar)', table: { category: 'Bar' } },
    maxVisibleActions: { control: { type: 'number', min: 0 }, description: 'Actions past this count roll into a "More" overflow menu (blank = no overflow)', table: { category: 'Bar' } },
    density:         { control: 'inline-radio', options: ['comfortable', 'compact'], description: 'Control height + padding (comfortable 42px / compact 36px)', table: { category: 'Bar' } },
    sticky:          { control: 'boolean', description: 'Pin the bar to the top (position: sticky)', table: { category: 'Bar' } },
    elevation:       { control: 'inline-radio', options: [false, 'always', 'onScroll'], description: 'Drop shadow — false · always · onScroll (appears after scrolling)', table: { category: 'Bar' } },
    bordered:        { control: 'boolean', description: 'Bottom hairline border (default true)', table: { category: 'Bar' } },
    height:          { control: { type: 'number', min: 40, max: 96 }, description: 'Bar height in px (default 62)', table: { category: 'Bar' } },
    background:      { control: 'text', description: 'Surface override (token, default --tesseract-slate-0)', table: { category: 'Bar' } },
    borderColor:     { control: 'text', description: 'Bottom-border colour (token, default --tesseract-slate-100)', table: { category: 'Bar' } },
    // Node / object props — documented but not panel-controllable.
    search:          { control: false, description: '{ placeholder?, value?, onChange?, width? } — a first-class search field in the bar', table: { category: 'Slots' } },
    logo:            { control: false, description: 'Brand mark (use the Logo atom)', table: { category: 'Slots' } },
    user:            { control: false, description: '{ name, meta?, avatar?, dropdown? } — patient/user block', table: { category: 'Slots' } },
    leading:         { control: false, description: 'Custom left content (escape hatch)', table: { category: 'Slots' } },
    trailing:        { control: false, description: 'Free-form right content after the actions', table: { category: 'Slots' } },
    actions:         { control: false, description: 'Ordered list (max 8) of typed action items (cta · info · divider · select · tutorial · avatar · node)', table: { category: 'Slots' } },
    onBack:          { control: false, table: { category: 'Events' } },
    onUserClick:     { control: false, table: { category: 'Events' } },
    tutorialIcon:    { control: false, description: 'Override the tutorial play glyph (icon name or node)', table: { category: 'Slots' } },
    className:       { table: { disable: true } },
  },
};

export default meta;

// ── Presets that reproduce the real app headers ──────────────────────────────

/** Home / shell header — logo + tutorial · notifications · info tag · clinic select · avatar. */
export const Shell = {
  render: () => (
    <ClinicHeader
      logo={<HeaderLogo />}
      actions={[
        { type: 'tutorial' },
        { type: 'divider' },
        { type: 'cta', icon: 'bell-2', ariaLabel: 'Notifications', variant: 'tonal', theme: 'neutral', badge: { color: 'error' } },
        { type: 'divider' },
        { type: 'info', icon: 'hospital', label: 'Ward', value: 'W-204' },
        '__clinic__',
        { type: 'avatar', name: 'Dr Sheela', ring: true },
      ]}
    />
  ),
};

/** RxPad header — back + patient + info tag (doctor) + tools + Preview / End Visit (split) + kebab. */
export const RxPad = {
  render: () => (
    <Header
      back
      user={{ name: 'Ramesh Kumar', meta: 'Male | 76y', dropdown: true }}
      actions={[
        { type: 'info', icon: 'user-octagon', label: 'Doctor:', value: 'Dr. Sheela BR' },
        { type: 'tutorial' },
        { type: 'divider' },
        { type: 'cta', icon: 'task-square', ariaLabel: 'Template', variant: 'tonal', theme: 'neutral' },
        { type: 'cta', icon: 'setting-4', ariaLabel: 'Customisation', variant: 'tonal', theme: 'neutral' },
        { type: 'divider' },
        { type: 'cta', label: 'Preview', icon: 'eye-tp', variant: 'outline', theme: 'primary' },
        { type: 'cta', label: 'End Visit', icon: 'clipboard-export', variant: 'solid', theme: 'primary', menu: END_VISIT_MENU },
        { type: 'cta', icon: 'more', ariaLabel: 'More options', variant: 'ghost', theme: 'neutral' },
      ]}
    />
  ),
};

/** Print header — back + patient + Print Settings / English / Done. */
const LANGUAGES = [
  { value: 'en', label: 'English', icon: <TPLibraryIcon name="global" size={16} /> },
  { value: 'hi', label: 'Hindi', icon: <TPLibraryIcon name="global" size={16} /> },
  { value: 'ta', label: 'Tamil', icon: <TPLibraryIcon name="global" size={16} /> },
  { value: 'te', label: 'Telugu', icon: <TPLibraryIcon name="global" size={16} /> },
];

function PrintHeader() {
  const [lang, setLang] = React.useState('en');
  return (
    <Header
      back
      user={{ name: 'Ramesh Kumar', meta: 'Male | 76y' }}
      actions={[
        { type: 'cta', label: 'Print Settings', icon: 'setting-4', variant: 'tonal', theme: 'neutral' },
        { type: 'select', icon: 'global', options: LANGUAGES, value: lang, onChange: setLang, width: 150 },
        { type: 'cta', label: 'Done', variant: 'solid', theme: 'primary' },
      ]}
    />
  );
}

export const Print = { render: () => <PrintHeader /> };

/** Title + subtext leading (e.g. the home "Welcome" header). */
export const TitleWithSubtext = {
  render: () => (
    <Header
      title="Welcome Dr. Sheela BR!"
      subtitle="Your Appointments"
      actions={[
        { type: 'cta', label: 'Add New Appointment', icon: 'add-square', variant: 'outline', theme: 'primary' },
        { type: 'cta', label: 'Start Walk-in Consultation', variant: 'solid', theme: 'primary' },
      ]}
    />
  ),
};

/** Info Tags — non-clickable violet data badges in the action bar. */
export const InfoTags = {
  name: 'Info Tags',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Header
        title="Icon Left (default)"
        actions={[
          { type: 'info', icon: 'hospital', label: 'Ward', value: 'W-204' },
          { type: 'info', icon: 'user-octagon', label: 'Doctor:', value: 'Dr. Sheela BR' },
        ]}
      />
      <Header
        title="Icon Right"
        actions={[
          { type: 'info', icon: 'status-up', iconPosition: 'right', label: 'Status:', value: 'Current' },
        ]}
      />
      <Header
        title="No Icon"
        actions={[
          { type: 'info', label: 'Room:', value: '302-A' },
          { type: 'info', value: 'Pending' },
        ]}
      />
      <Header
        title="Custom Radius"
        actions={[
          { type: 'info', icon: 'heart', label: 'BP:', value: '120/80 mmHg', radius: 'var(--tesseract-radius-full)' },
          { type: 'info', icon: 'calendar', value: 'Jun 23, 2026', radius: '4px' },
        ]}
      />
    </div>
  ),
};

/** Compact density — the same Shell header with 36px controls + tighter padding/gap. */
export const Compact = {
  name: 'Compact density',
  render: () => (
    <ClinicHeader
      density="compact"
      logo={<HeaderLogo />}
      actions={[
        { type: 'tutorial' },
        { type: 'divider' },
        { type: 'cta', icon: 'bell-2', ariaLabel: 'Notifications', variant: 'tonal', theme: 'neutral', badge: { color: 'error' } },
        { type: 'divider' },
        { type: 'info', icon: 'hospital', label: 'Ward', value: 'W-204' },
        '__clinic__',
        { type: 'avatar', name: 'Dr Sheela', ring: true },
      ]}
    />
  ),
};

/** Trailing slot — free-form right content rendered AFTER the actions array
 *  (mirrors the `leading` slot on the left). Here: a sticky + elevated bar with
 *  a custom status pill in the trailing slot. */
export const TrailingSlot = {
  name: 'Trailing slot + sticky',
  render: () => (
    <div style={{ minHeight: 320 }}>
      <Header
        sticky
        elevation
        logo={<HeaderLogo />}
        actions={[
          { type: 'cta', icon: 'bell-2', ariaLabel: 'Notifications', variant: 'tonal', theme: 'neutral' },
          { type: 'divider' },
        ]}
        trailing={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--tesseract-radius-full)', background: 'var(--tesseract-success-50, #ECFDF3)', color: 'var(--tesseract-success-700, #027A48)', fontSize: 13, fontWeight: 600 }}>
            <TPLibraryIcon name="status-up" size={16} />
            Online
          </span>
        }
      />
      <div style={{ padding: 16, color: 'var(--tesseract-slate-500)' }}>Scroll content — the bar stays pinned (sticky) with a drop shadow (elevation).</div>
    </div>
  ),
};

/** Center-aligned title (MD3 center top app bar) — back left, title centered, actions right. */
export const CenterAligned = {
  name: 'Center-aligned title',
  render: () => (
    <Header
      back
      align="center"
      title="Patient Summary"
      subtitle="MRN-10231 · Aarav Sharma"
      actions={[
        { type: 'cta', icon: 'printer', ariaLabel: 'Print', variant: 'tonal', theme: 'neutral' },
        { type: 'cta', icon: 'more', ariaLabel: 'More', variant: 'ghost', theme: 'neutral' },
      ]}
    />
  ),
};

/** First-class search slot — a pill search field in the bar. */
export const WithSearch = {
  name: 'Search slot',
  render: () => {
    const [q, setQ] = React.useState('');
    return (
      <Header
        logo={<HeaderLogo />}
        search={{ placeholder: 'Search patients, doctors, MRN…', value: q, onChange: (e) => setQ(e.target.value) }}
        actions={[
          { type: 'cta', icon: 'bell-2', ariaLabel: 'Notifications', variant: 'tonal', theme: 'neutral', badge: { color: 'error' } },
          { type: 'avatar', name: 'Dr Sheela', ring: true },
        ]}
      />
    );
  },
};

/** Responsive action overflow — actions past `maxVisibleActions` roll into a "More" menu. */
export const ActionOverflow = {
  name: 'Action overflow (More menu)',
  render: () => (
    <Header
      logo={<HeaderLogo />}
      maxVisibleActions={2}
      actions={[
        { type: 'cta', label: 'New', icon: 'add-square', variant: 'solid', theme: 'primary', onClick: () => {} },
        { type: 'cta', icon: 'bell-2', ariaLabel: 'Notifications', variant: 'tonal', theme: 'neutral' },
        { type: 'cta', label: 'Export', icon: 'document-download', onClick: () => {} },
        { type: 'cta', label: 'Import', icon: 'document-upload', onClick: () => {} },
        { type: 'cta', label: 'Settings', icon: 'setting-4', onClick: () => {} },
        { type: 'cta', label: 'Help', icon: 'message-question', onClick: () => {} },
      ]}
    />
  ),
};

/** Elevate on scroll — the shadow appears only after the page scrolls under the bar. */
export const ElevateOnScroll = {
  name: 'Elevate on scroll',
  render: () => (
    <div style={{ minHeight: 700 }}>
      <Header
        sticky
        elevation="onScroll"
        logo={<HeaderLogo />}
        actions={[
          { type: 'cta', icon: 'bell-2', ariaLabel: 'Notifications', variant: 'tonal', theme: 'neutral' },
          { type: 'avatar', name: 'Dr Sheela', ring: true },
        ]}
      />
      <div style={{ padding: 24, color: 'var(--tesseract-slate-500)' }}>
        Scroll this story — the header has no shadow at the top, and gains one once you scroll.
      </div>
    </div>
  ),
};

// ── Configurable Playground ──────────────────────────────────────────────────

const CTA_VARIANTS = ['none', 'solid', 'outline', 'tonal', 'ghost', 'link'];
const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];
const SLOTS = [1, 2, 3, 4, 5, 6]; // up to 8 supported by the API; 6 wired here

function slotArgTypes() {
  const t = {};
  for (const i of SLOTS) {
    const category = `CTA ${i}`;
    t[`c${i}Variant`] = { control: 'select', options: CTA_VARIANTS, name: `#${i} · variant (none = off)`, table: { category } };
    t[`c${i}Label`] = { control: 'text', name: `#${i} · label (blank = icon only)`, table: { category } };
    t[`c${i}Icon`] = { control: 'text', tpIcon: true, name: `#${i} · icon`, table: { category } };
    t[`c${i}Split`] = { control: 'boolean', name: `#${i} · split (menu)`, table: { category } };
    t[`c${i}Divider`] = { control: 'boolean', name: `#${i} · divider before`, table: { category } };
  }
  return t;
}

// Accurate, copy-paste snippet (mirrors Badge's "Show code"). Defaults are
// omitted so the snippet stays minimal and reflects only what's been changed.
const headerBackCode = (a) => {
  const lines = [];
  if (a.showBack) {
    lines.push('  back');
    if (a.backIcon && a.backIcon !== 'arrow-left3') lines.push(`  backIcon="${a.backIcon}"`);
    if (a.backIconVariant && a.backIconVariant !== 'linear') lines.push(`  backIconVariant="${a.backIconVariant}"`);
  }
  if (a.align && a.align !== 'left') lines.push(`  align="${a.align}"`);
  if (a.searchSlot) lines.push('  search={{ placeholder: "Search patients, doctors…" }}');
  if (a.maxVisibleActions > 0) lines.push(`  maxVisibleActions={${a.maxVisibleActions}}`);
  if (a.density && a.density !== 'comfortable') lines.push(`  density="${a.density}"`);
  if (a.sticky) lines.push('  sticky');
  if (a.elevation) lines.push(typeof a.elevation === 'string' ? `  elevation="${a.elevation}"` : '  elevation');
  if (a.background && a.background.trim()) lines.push(`  background="${a.background.trim()}"`);
  if (!lines.length) return '<Header /* … */ />';
  return `<Header\n${lines.join('\n')}\n  /* …actions, leading, trailing… */\n/>`;
};

export const Playground = {
  parameters: { docs: { source: { transform: (_code, ctx) => headerBackCode(ctx.args) } } },
  argTypes: {
    showBack: { control: 'boolean', name: 'back button', table: { category: 'Left' } },
    backIcon: { control: 'text', tpIcon: true, name: 'back icon', table: { category: 'Left' } },
    backIconVariant: { control: 'select', options: ICON_VARIANTS, name: 'back icon style', table: { category: 'Left' } },
    leading: { control: 'inline-radio', options: ['logo', 'title', 'user', 'none'], name: 'leading', description: 'What fills the left slot — logo, title (+subtext), user/patient block, or nothing', table: { category: 'Left' } },
    title: { control: 'text', table: { category: 'Left' } },
    subtitle: { control: 'text', name: 'subtext (blank = title only)', table: { category: 'Left' } },
    userName: { control: 'text', name: 'user · name', table: { category: 'Left' } },
    userMeta: { control: 'text', name: 'user · meta', table: { category: 'Left' } },
    userDropdown: { control: 'boolean', name: 'user · dropdown', table: { category: 'Left' } },
    tutorial: { control: 'boolean', name: 'tutorial (first)', table: { category: 'Right' } },
    clinic: { control: 'boolean', name: 'clinic select', table: { category: 'Right' } },
    avatar: { control: 'boolean', name: 'avatar (last)', table: { category: 'Right' } },
    trailing: { control: 'boolean', name: 'trailing slot (status pill)', description: 'Free-form node rendered after the actions list', table: { category: 'Right' } },
    align: { control: 'inline-radio', options: ['left', 'center'], name: 'align', description: 'left or center-aligned title', table: { category: 'Bar' } },
    searchSlot: { control: 'boolean', name: 'search slot', description: 'Render a first-class search field in the bar', table: { category: 'Bar' } },
    maxVisibleActions: { control: { type: 'number', min: 0 }, name: 'max visible actions (0 = off)', description: 'Roll extra actions into a "More" overflow menu', table: { category: 'Bar' } },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'], name: 'density', description: 'Control height + padding — comfortable or compact (36px)', table: { category: 'Bar' } },
    sticky: { control: 'boolean', name: 'sticky', description: 'Pin the bar to the top as content scrolls', table: { category: 'Bar' } },
    elevation: { control: 'inline-radio', options: [false, 'always', 'onScroll'], name: 'elevation (shadow)', description: 'Drop shadow — off · always · on scroll', table: { category: 'Bar' } },
    background: { control: 'text', name: 'background (token)', table: { category: 'Bar' } },
    ...slotArgTypes(),
  },
  args: {
    showBack: true,
    backIcon: 'arrow-left3',
    backIconVariant: 'linear',
    align: 'left',
    searchSlot: false,
    maxVisibleActions: 0,
    leading: "title",
    title: "Nursing",
    subtitle: "",
    userName: 'Ramesh Kumar',
    userMeta: 'Male | 76y',
    userDropdown: true,
    tutorial: true,
    clinic: true,
    avatar: true,
    trailing: false,
    density: 'comfortable',
    sticky: true,
    elevation: false,
    background: '',
    c1Variant: 'tonal',
    c1Label: '',
    c1Icon: 'bell-2',
    c1Split: false,
    c1Divider: true,
    c2Variant: "none",
    c2Label: 'End Visit',
    c2Icon: 'clipboard-export',
    c2Split: true,
    c2Divider: true,
    c3Variant: 'none',
    c3Label: '',
    c3Icon: '',
    c3Split: false,
    c3Divider: false,
    c4Variant: 'none',
    c4Label: '',
    c4Icon: '',
    c4Split: false,
    c4Divider: false,
    c5Variant: 'none',
    c5Label: '',
    c5Icon: '',
    c5Split: false,
    c5Divider: false,
    c6Variant: 'none',
    c6Label: '',
    c6Icon: '',
    c6Split: false,
    c6Divider: false,
    backIconCorner: "straight"
  },
  render: (a) => <HeaderPlaygroundDemo {...a} />,
};

function HeaderPlaygroundDemo(a) {
  const [clinic, setClinic] = React.useState('rajeshwar');
  const actions = [];
  if (a.tutorial) actions.push({ type: 'tutorial' });
  for (const i of SLOTS) {
    const variant = a[`c${i}Variant`];
    if (!variant || variant === 'none') continue;
    if (a[`c${i}Divider`]) actions.push({ type: 'divider' });
    const label = (a[`c${i}Label`] || '').trim();
    const ic = (a[`c${i}Icon`] || '').trim();
    actions.push({
      type: 'cta',
      variant,
      theme: variant === 'solid' ? 'primary' : 'neutral',
      label: label || undefined,
      icon: ic || undefined,
      ariaLabel: label || `Action ${i}`,
      menu: a[`c${i}Split`] ? END_VISIT_MENU : undefined,
    });
  }
  if (a.clinic) actions.push({ type: 'select', icon: 'building', options: CLINICS, value: clinic, onChange: setClinic });
  if (a.avatar) actions.push({ type: 'avatar', name: 'Dr Sheela', ring: true });

  const left = {};
  if (a.leading === 'logo') left.logo = <HeaderLogo />;
  else if (a.leading === 'title') { left.title = a.title; if (a.subtitle && a.subtitle.trim()) left.subtitle = a.subtitle; }
  else if (a.leading === 'user') left.user = { name: a.userName, meta: a.userMeta, dropdown: a.userDropdown };

  const trailing = a.trailing ? (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--tesseract-radius-full)', background: 'var(--tesseract-success-50, #ECFDF3)', color: 'var(--tesseract-success-700, #027A48)', fontSize: 13, fontWeight: 600 }}>
      <TPLibraryIcon name="status-up" size={16} />
      Online
    </span>
  ) : undefined;

  return (
    <div style={{ background: 'var(--tesseract-slate-50, #FAFAFB)', minHeight: 320 }}>
      <Header
        back={a.showBack}
        backIcon={a.backIcon}
        backIconVariant={a.backIconVariant}
        align={a.align}
        search={a.searchSlot ? { placeholder: 'Search patients, doctors…' } : undefined}
        maxVisibleActions={a.maxVisibleActions > 0 ? a.maxVisibleActions : undefined}
        density={a.density}
        sticky={a.sticky}
        elevation={a.elevation}
        background={a.background && a.background.trim() ? a.background.trim() : undefined}
        trailing={trailing}
        {...left}
        actions={actions}
      />
    </div>
  );
}
