import React from 'react';
import { Header } from './Header';

// Real TatvaPractice logo — symbol + wordmark SVGs served from /public/brand.
const Logo = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <img src="/brand/tatvapractice-symbol.svg" alt="" style={{ height: 26, width: 'auto', display: 'block' }} />
    <img src="/brand/tatvapractice-wordmark.svg" alt="TatvaPractice" style={{ height: 18, width: 'auto', display: 'block' }} />
  </span>
);

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
    docs: { description: { component: 'One configurable top bar. Left cluster: optional back button, logo, user/patient block, or title. Right cluster: an ordered `actions` list (up to ~8) of typed items — icon button, dropdown, CTA (solid/outline/tonal/split), avatar, tutorial, and gradient dividers you place anywhere. Everything composes the Button + Badge atoms. The three presets reproduce the real Shell, RxPad and Print headers; the Playground assembles one from controls.' } },
  },
};

export default meta;

// ── Presets that reproduce the real app headers ──────────────────────────────

/** Home / shell header — logo + tutorial · notifications · clinic · avatar. */
export const Shell = {
  render: () => (
    <Header
      logo={<Logo />}
      actions={[
        { type: 'tutorial' },
        { type: 'divider' },
        { type: 'icon', icon: 'bell-2', label: 'Notifications', badge: { color: 'error' } },
        { type: 'divider' },
        { type: 'dropdown', icon: 'building', label: 'Rajeshwar Eye Clinic' },
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
        { type: 'icon', icon: 'task-square', label: 'Template' },
        { type: 'icon', icon: 'setting-4', label: 'Customisation' },
        { type: 'divider' },
        { type: 'cta', label: 'Preview', icon: 'eye-tp', variant: 'outline', theme: 'primary' },
        { type: 'cta', label: 'End Visit', icon: 'clipboard-export', variant: 'solid', theme: 'primary', menu: END_VISIT_MENU },
        { type: 'icon', icon: 'more', label: 'More options', variant: 'ghost' },
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
        { type: 'dropdown', icon: 'global', label: 'English' },
        { type: 'cta', label: 'Done', variant: 'solid', theme: 'primary' },
      ]}
    />
  ),
};

// ── Configurable Playground ──────────────────────────────────────────────────

const CTA_VARIANTS = ['solid', 'outline', 'tonal', 'ghost', 'link'];
const CTA_THEMES = ['primary', 'neutral', 'error', 'success', 'warning'];

export const Playground = {
  argTypes: {
    // Left cluster
    showBack: { control: 'boolean', name: 'back button', table: { category: 'Left' } },
    leading: { control: 'inline-radio', options: ['logo', 'user', 'title', 'none'], name: 'leading', table: { category: 'Left' } },
    title: { control: 'text', table: { category: 'Left' } },
    userName: { control: 'text', name: 'user · name', table: { category: 'Left' } },
    userMeta: { control: 'text', name: 'user · meta', table: { category: 'Left' } },
    userDropdown: { control: 'boolean', name: 'user · dropdown', table: { category: 'Left' } },
    // Right cluster — toggles for common items + dividers
    tutorial: { control: 'boolean', name: 'tutorial', table: { category: 'Right' } },
    notify: { control: 'boolean', name: 'notification icon', table: { category: 'Right' } },
    clinic: { control: 'text', name: 'clinic dropdown (blank = off)', table: { category: 'Right' } },
    avatar: { control: 'boolean', name: 'avatar', table: { category: 'Right' } },
    dividers: { control: 'boolean', name: 'auto dividers', table: { category: 'Right' } },
    // One fully configurable CTA (the same controls every CTA supports)
    ctaLabel: { control: 'text', name: 'CTA · label (blank = off)', table: { category: 'Right · CTA' } },
    ctaVariant: { control: 'inline-radio', options: CTA_VARIANTS, name: 'CTA · variant', table: { category: 'Right · CTA' } },
    ctaTheme: { control: 'select', options: CTA_THEMES, name: 'CTA · theme', table: { category: 'Right · CTA' } },
    ctaIcon: { control: 'text', tpIcon: true, name: 'CTA · icon', table: { category: 'Right · CTA' } },
    ctaSplit: { control: 'boolean', name: 'CTA · split (menu)', table: { category: 'Right · CTA' } },
  },
  args: {
    showBack: false,
    leading: 'logo',
    title: 'Appointments',
    userName: 'Ramesh Kumar',
    userMeta: 'Male | 76y',
    userDropdown: true,
    tutorial: true,
    notify: true,
    clinic: 'Rajeshwar Eye Clinic',
    avatar: true,
    dividers: true,
    ctaLabel: '',
    ctaVariant: 'solid',
    ctaTheme: 'primary',
    ctaIcon: '',
    ctaSplit: false,
  },
  render: (a) => {
    const actions = [];
    const div = () => a.dividers && actions.push({ type: 'divider' });
    if (a.tutorial) actions.push({ type: 'tutorial' });
    if (a.notify) { div(); actions.push({ type: 'icon', icon: 'bell-2', label: 'Notifications', badge: { color: 'error' } }); }
    if (a.ctaLabel && a.ctaLabel.trim()) {
      div();
      actions.push({
        type: 'cta', label: a.ctaLabel.trim(), variant: a.ctaVariant, theme: a.ctaTheme,
        icon: a.ctaIcon && a.ctaIcon.trim() ? a.ctaIcon.trim() : undefined,
        menu: a.ctaSplit ? END_VISIT_MENU : undefined,
      });
    }
    if (a.clinic && a.clinic.trim()) { div(); actions.push({ type: 'dropdown', icon: 'building', label: a.clinic.trim() }); }
    if (a.avatar) actions.push({ type: 'avatar', name: 'DS', ring: true });

    const leftProps = {};
    if (a.leading === 'logo') leftProps.logo = <Logo />;
    else if (a.leading === 'user') leftProps.user = { name: a.userName, meta: a.userMeta, dropdown: a.userDropdown };
    else if (a.leading === 'title') leftProps.title = a.title;

    return (
      <div style={{ background: 'var(--tp-slate-50, #f8fafc)', minHeight: 200 }}>
        <Header back={a.showBack} {...leftProps} actions={actions} />
      </div>
    );
  },
};
