import React from 'react';
import { Sidebar } from './Sidebar';

const DEFAULT_ITEMS = [
  { id: 'appointments', label: 'Appointments', icon: 'calendar' },
  { id: 'all-patients', label: 'All Patients', icon: 'profile-2user' },
  { id: 'follow-ups', label: 'Follow-ups', icon: 'calendar-add' },
  { id: 'opd-billing', label: 'OPD Billing', icon: 'receipt-text' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'shop' },
  { id: 'ipd', label: 'IPD', icon: 'hospital' },
  { id: 'daycare', label: 'Daycare', icon: 'document-like' },
  { id: 'bulk-messages', label: 'Bulk Messages', icon: 'message-programming' },
];
const IDS = DEFAULT_ITEMS.map((i) => i.id);
const TAG_VARIANTS = ['gradient', 'solid', 'soft', 'outline'];
const TAG_COLORS = ['warning', 'error', 'success', 'primary', 'neutral', 'violet'];

const iconArgTypes = {};
const iconDefaults = {};
DEFAULT_ITEMS.forEach((item, i) => {
  iconArgTypes[`icon${i}`] = {
    control: 'text', tpIcon: true,
    name: `${item.label} icon`,
    table: { category: 'Icons' },
  };
  iconDefaults[`icon${i}`] = item.icon;
});

const meta = {
  title: 'Molecules/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Primary 80px navigation rail. Every icon is individually configurable via the Tesseract Icons panel. Tags reuse the Badge atom (incl. gradient + sticky).' } },
  },
  argTypes: {
    activeId: { control: 'select', options: IDS, name: 'active item', table: { category: 'Rail' } },
    bottomFade: { control: 'boolean', name: 'bottom fade', table: { category: 'Rail' } },
    width: { control: { type: 'range', min: 80, max: 100, step: 2 }, name: 'rail width', table: { category: 'Rail' } },

    editItem: { control: 'select', options: IDS, name: 'item to edit', table: { category: 'Selected item' } },
    label: { control: 'text', name: 'name (blank = keep)', table: { category: 'Selected item' } },
    withTag: { control: 'boolean', name: 'add tag', table: { category: 'Selected item · tag' } },
    tagText: { control: 'text', name: 'tag · text', table: { category: 'Selected item · tag' } },
    tagVariant: { control: 'inline-radio', options: TAG_VARIANTS, name: 'tag · variant', table: { category: 'Selected item · tag' } },
    tagColor: { control: 'select', options: TAG_COLORS, name: 'tag · color', table: { category: 'Selected item · tag' } },
    tagSticky: { control: 'inline-radio', options: ['right', 'left', 'none'], name: 'tag · sticky', table: { category: 'Selected item · tag' } },
    ...iconArgTypes,
  },
  args: {
    activeId: 'appointments',
    bottomFade: true,
    width: 80,
    editItem: 'opd-billing',
    label: '',
    withTag: true,
    tagText: 'Trial',
    tagVariant: 'gradient',
    tagColor: 'warning',
    tagSticky: 'right',
    ...iconDefaults,
  },
};

export default meta;

function SidebarDemo(args) {
  const { activeId, bottomFade, width, editItem, label, withTag, tagText, tagVariant, tagColor, tagSticky, ...rest } = args;
  const [active, setActive] = React.useState(activeId);
  const items = DEFAULT_ITEMS.map((it, i) => {
    const next = { ...it, icon: rest[`icon${i}`] || it.icon };
    if (it.id === editItem) {
      if (label && label.trim()) next.label = label.trim();
      if (withTag) next.badge = { text: tagText || 'Trial', variant: tagVariant, color: tagColor, sticky: tagSticky === 'none' ? undefined : tagSticky };
    }
    return next;
  });
  return (
    <div style={{ display: 'flex', height: 600, background: 'var(--tp-slate-50, #FAFAFB)' }}>
      <Sidebar items={items} activeId={active} onSelect={setActive} width={width} bottomFade={bottomFade} />
      <div style={{ flex: 1, padding: 'var(--tp-space-6)', fontFamily: 'var(--tp-font-body)', color: 'var(--tp-slate-600, #545460)' }}>
        Active: <strong style={{ color: 'var(--tp-slate-900, #171725)' }}>{active}</strong>
      </div>
    </div>
  );
}

export const Playground = {
  render: (args) => <SidebarDemo key={args.editItem} {...args} />,
};

export const RailOnly = {
  render: () => {
    const [active, setActive] = React.useState('all-patients');
    const items = DEFAULT_ITEMS.map((it) => (it.id === 'opd-billing' ? { ...it, badge: 'trial' } : it));
    return (
      <div style={{ height: 600 }}>
        <Sidebar items={items} activeId={active} onSelect={setActive} />
      </div>
    );
  },
};
