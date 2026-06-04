import React from 'react';
import { Sidebar } from './Sidebar';

// Icons are TP library icon NAMES — the Sidebar renders them linear at rest and
// bold when active (the icon picker fix lets the variant switch through).
const ITEMS = [
  { id: 'appointments', label: 'Appointments', icon: 'calendar-2' },
  { id: 'all-patients', label: 'All Patients', icon: 'profile-2user' },
  { id: 'follow-ups', label: 'Follow-ups', icon: 'calendar-tick' },
  { id: 'opd-billing', label: 'OPD Billing', icon: 'receipt-text' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'capsule' },
  { id: 'ipd', label: 'IPD', icon: 'building-3' },
  { id: 'daycare', label: 'Daycare', icon: 'building-4' },
  { id: 'bulk-messages', label: 'Bulk Messages', icon: 'message-programming' },
];

const meta = {
  title: 'Molecules/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Primary 80px navigation rail. Each item is a 32×32 rounded icon chip (grey at rest, blue when active) over a 1–2 line label. The icon is a TP library icon that switches linear→bold on select and tints slate-700→white. Active rows get a faint blue tint + a 3px rounded left bar; an optional orange Trial tag pins to the right edge, centered on the icon. No logo / patient footer by default; a bottom white fade hints at overflow.' } },
  },
  argTypes: {
    activeId: { control: 'select', options: ITEMS.map((i) => i.id), name: 'active item', table: { category: 'State' } },
    trialItem: { control: 'select', options: ['none', ...ITEMS.map((i) => i.id)], name: 'Trial tag on', table: { category: 'Content' } },
    bottomFade: { control: 'boolean', name: 'bottom fade', table: { category: 'Layout' } },
    width: { control: { type: 'range', min: 72, max: 110, step: 2 }, name: 'rail width', table: { category: 'Layout' } },
  },
  args: {
    activeId: 'appointments',
    trialItem: 'opd-billing',
    bottomFade: true,
    width: 80,
  },
};

export default meta;

// Keyed by activeId so changing the control re-seeds the local selection.
function SidebarDemo({ activeId, trialItem, bottomFade, width }) {
  const [active, setActive] = React.useState(activeId);
  const items = ITEMS.map((it) => (it.id === trialItem ? { ...it, badge: 'trial' } : it));
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
  render: (args) => <SidebarDemo key={`${args.activeId}-${args.trialItem}`} {...args} />,
};

/** Just the rail. */
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
