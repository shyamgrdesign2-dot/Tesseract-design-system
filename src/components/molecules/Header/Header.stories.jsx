import React from 'react';
import { Header } from './Header';
import { Logo } from '@/src/components/atoms/Logo';

// Header logo — the actual gradient wordmark, min height 32px (width auto).
const HeaderLogo = () => <Logo variant="wordmark" tone="gradient" height={32} />;

const END_VISIT_MENU = [
  { id: 'save', label: 'Save & exit' },
  { id: 'discard', label: 'Discard visit' },
];

const meta = {
  title: 'Molecules/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'One configurable top bar. Left: full-height back button, logo, user/patient block, or title (+ optional subtext). Right: an ordered `actions` list (max 8) where only `tutorial` and `avatar` are special — everything else is a CTA (the Button atom), and dividers (the Divider atom) are placed explicitly wherever you want them. Reuses Button / Avatar / Divider / Badge / Logo atoms.' } },
  },
};

export default meta;

// ── Presets that reproduce the real app headers ──────────────────────────────

/** Home / shell header — logo + tutorial · notifications · clinic · avatar. */
export const Shell = {
  render: () => (
    <Header
      logo={<HeaderLogo />}
      actions={[
        { type: 'tutorial' },
        { type: 'divider' },
        { type: 'cta', icon: 'bell-2', ariaLabel: 'Notifications', variant: 'tonal', theme: 'neutral', badge: { color: 'error' } },
        { type: 'divider' },
        { type: 'cta', icon: 'building', label: 'Rajeshwar Eye Clinic', variant: 'tonal', theme: 'neutral', dropdown: true },
        { type: 'avatar', name: 'DS', ring: true },
      ]}
    />
  ),
};

/** RxPad header — back + patient + tools + Preview / End Visit (split) + kebab. */
export const RxPad = {
  render: () => (
    <Header
      back
      user={{ name: 'Ramesh Kumar', meta: 'Male | 76y', dropdown: true }}
      actions={[
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
export const Print = {
  render: () => (
    <Header
      back
      user={{ name: 'Ramesh Kumar', meta: 'Male | 76y' }}
      actions={[
        { type: 'cta', label: 'Print Settings', icon: 'setting-4', variant: 'tonal', theme: 'neutral' },
        { type: 'cta', label: 'English', icon: 'global', variant: 'tonal', theme: 'neutral', dropdown: true },
        { type: 'cta', label: 'Done', variant: 'solid', theme: 'primary' },
      ]}
    />
  ),
};

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

// ── Configurable Playground ──────────────────────────────────────────────────

const CTA_VARIANTS = ['none', 'solid', 'outline', 'tonal', 'ghost', 'link'];
const SLOTS = [1, 2, 3, 4, 5, 6]; // up to 8 supported by the API; 6 wired here

function slotArgTypes() {
  const t = {};
  for (const i of SLOTS) {
    const category = `CTA ${i}`;
    t[`c${i}Variant`] = { control: 'select', options: CTA_VARIANTS, name: `#${i} · variant (none = off)`, table: { category } };
    t[`c${i}Label`] = { control: 'text', name: `#${i} · label (blank = icon only)`, table: { category } };
    t[`c${i}Icon`] = { control: 'text', tpIcon: true, name: `#${i} · icon`, table: { category } };
    t[`c${i}Dropdown`] = { control: 'boolean', name: `#${i} · dropdown chevron`, table: { category } };
    t[`c${i}Divider`] = { control: 'boolean', name: `#${i} · divider before`, table: { category } };
  }
  return t;
}

export const Playground = {
  argTypes: {
    showBack: { control: 'boolean', name: 'back button', table: { category: 'Left' } },
    leading: { control: 'inline-radio', options: ['logo', 'title', 'user', 'none'], name: 'leading', table: { category: 'Left' } },
    title: { control: 'text', table: { category: 'Left' } },
    subtitle: { control: 'text', name: 'subtext (blank = title only)', table: { category: 'Left' } },
    userName: { control: 'text', name: 'user · name', table: { category: 'Left' } },
    userMeta: { control: 'text', name: 'user · meta', table: { category: 'Left' } },
    userDropdown: { control: 'boolean', name: 'user · dropdown', table: { category: 'Left' } },
    tutorial: { control: 'boolean', name: 'tutorial (first)', table: { category: 'Right' } },
    avatar: { control: 'boolean', name: 'avatar (last)', table: { category: 'Right' } },
    ...slotArgTypes(),
  },
  args: {
    showBack: false,
    leading: 'logo',
    title: 'Welcome Dr. Sheela BR!',
    subtitle: 'Your Appointments',
    userName: 'Ramesh Kumar',
    userMeta: 'Male | 76y',
    userDropdown: true,
    tutorial: true,
    avatar: true,
    c1Variant: 'tonal', c1Label: '', c1Icon: 'bell-2', c1Dropdown: false, c1Divider: true,
    c2Variant: 'tonal', c2Label: 'Rajeshwar Eye Clinic', c2Icon: 'building', c2Dropdown: true, c2Divider: true,
    c3Variant: 'none', c3Label: '', c3Icon: '', c3Dropdown: false, c3Divider: false,
    c4Variant: 'none', c4Label: '', c4Icon: '', c4Dropdown: false, c4Divider: false,
    c5Variant: 'none', c5Label: '', c5Icon: '', c5Dropdown: false, c5Divider: false,
    c6Variant: 'none', c6Label: '', c6Icon: '', c6Dropdown: false, c6Divider: false,
  },
  render: (a) => {
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
        dropdown: a[`c${i}Dropdown`],
      });
    }
    if (a.avatar) actions.push({ type: 'avatar', name: 'DS', ring: true });

    const left = {};
    if (a.leading === 'logo') left.logo = <HeaderLogo />;
    else if (a.leading === 'title') { left.title = a.title; if (a.subtitle && a.subtitle.trim()) left.subtitle = a.subtitle; }
    else if (a.leading === 'user') left.user = { name: a.userName, meta: a.userMeta, dropdown: a.userDropdown };

    return (
      <div style={{ background: 'var(--tp-slate-50, #f8fafc)', minHeight: 200 }}>
        <Header back={a.showBack} {...left} actions={actions} />
      </div>
    );
  },
};
