import React from 'react';
import { Sidebar } from './Sidebar';

// Icons are TP library icon NAMES — the Sidebar renders them linear at rest and
// bold when active.
const ITEMS = [
  { id: 'appointments', label: 'Appointments', icon: 'calendar-1' },
  { id: 'all-patients', label: 'All Patients', icon: 'profile-2user' },
  { id: 'follow-ups', label: 'Follow-ups', icon: 'calendar-tick' },
  { id: 'opd-billing', label: 'OPD Billing', icon: 'receipt-text' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'capsule' },
  { id: 'ipd', label: 'IPD', icon: 'building-3' },
  { id: 'daycare', label: 'Daycare', icon: 'building-4' },
  { id: 'bulk-messages', label: 'Bulk Messages', icon: 'message-programming' },
];
const IDS = ITEMS.map((i) => i.id);
const TAG_VARIANTS = ['gradient', 'solid', 'soft', 'outline'];
const TAG_COLORS = ['warning', 'error', 'success', 'primary', 'neutral', 'violet'];

const meta = {
  title: 'Molecules/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Primary 80px navigation rail. The icon chip reuses the Button atom (tonal/grey at rest, solid/blue when active); the icon is a library glyph that switches linear→bold on select. Tags reuse the Badge atom (incl. the gradient variant). Controls let you pick the active item, configure one item\'s tag (type / variant / color), and swap any item\'s icon.' } },
  },
  argTypes: {
    activeId: { control: 'select', options: IDS, name: 'active item', table: { category: 'State' } },
    // Tag — configured on one chosen item; the same rule applies to any item.
    tagItem: { control: 'select', options: ['none', ...IDS], name: 'tag · on item', table: { category: 'Tag' } },
    tagText: { control: 'text', name: 'tag · text', table: { category: 'Tag' } },
    tagVariant: { control: 'inline-radio', options: TAG_VARIANTS, name: 'tag · variant', table: { category: 'Tag' } },
    tagColor: { control: 'select', options: TAG_COLORS, name: 'tag · color', table: { category: 'Tag' } },
    tagSticky: { control: 'inline-radio', options: ['right', 'left', 'none'], name: 'tag · sticky', table: { category: 'Tag' } },
    // Icon swap — change any item's glyph (and it still switches linear/bold).
    iconItem: { control: 'select', options: IDS, name: 'icon · on item', table: { category: 'Icon' } },
    iconName: { control: 'text', tpIcon: true, name: 'icon · glyph', table: { category: 'Icon' } },
    bottomFade: { control: 'boolean', name: 'bottom fade', table: { category: 'Layout' } },
    width: { control: { type: 'range', min: 72, max: 110, step: 2 }, name: 'rail width', table: { category: 'Layout' } },
  },
  args: {
    activeId: 'appointments',
    tagItem: 'opd-billing',
    tagText: 'Trial',
    tagVariant: 'gradient',
    tagColor: 'warning',
    tagSticky: 'right',
    iconItem: 'appointments',
    iconName: '',
    bottomFade: true,
    width: 80,
  },
};

export default meta;

function SidebarDemo({ activeId, tagItem, tagText, tagVariant, tagColor, tagSticky, iconItem, iconName, bottomFade, width }) {
  const [active, setActive] = React.useState(activeId);
  const items = ITEMS.map((it) => {
    let next = it;
    if (it.id === tagItem) next = { ...next, badge: { text: tagText || 'Trial', variant: tagVariant, color: tagColor, sticky: tagSticky === 'none' ? undefined : tagSticky } };
    if (it.id === iconItem && iconName && iconName.trim()) next = { ...next, icon: iconName.trim() };
    return next;
  });
  return (
    <div style={{ display: 'flex', height: 600, background: 'var(--tp-slate-50, #f8fafc)' }}>
      <Sidebar items={items} activeId={active} onSelect={setActive} width={width} bottomFade={bottomFade} />
      <div style={{ flex: 1, padding: 24, fontFamily: 'Inter, sans-serif', color: 'var(--tp-slate-600, #717179)' }}>
        Active: <strong style={{ color: 'var(--tp-slate-900, #171725)' }}>{active}</strong>
      </div>
    </div>
  );
}

export const Playground = {
  render: (args) => <SidebarDemo key={`${args.activeId}-${args.tagItem}-${args.iconItem}`} {...args} />,
};

/** Just the rail, with the Trial tag on OPD Billing. */
export const RailOnly = {
  render: () => {
    const [active, setActive] = React.useState('all-patients');
    const items = ITEMS.map((it) => (it.id === 'opd-billing' ? { ...it, badge: 'trial' } : it));
    return (
      <div style={{ height: 600 }}>
        <Sidebar items={items} activeId={active} onSelect={setActive} />
      </div>
    );
  },
};
