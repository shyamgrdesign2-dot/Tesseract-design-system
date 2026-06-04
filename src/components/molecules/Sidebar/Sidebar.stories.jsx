import React from 'react';
import { Sidebar } from './Sidebar';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

// Icons reuse the icon atoms; they render in currentColor so they turn blue on
// the active item automatically.
const li = (name) => <TPLibraryIcon name={name} size={26} />;

// The Tatva Practice primary nav, matching the app's SidebarDoctor.
const ITEMS = [
  { id: 'appointment', label: 'Appointment', icon: li('calendar-1') },
  { id: 'ask-tatva', label: 'Ask Tatva', icon: li('messages-2') },
  { id: 'opd-billing', label: 'OPD Billing', icon: li('receipt-text') },
  { id: 'all-patients', label: 'All Patients', icon: li('profile-2user') },
  { id: 'follow-up', label: 'Follow Up', icon: li('calendar-tick') },
  { id: 'pharmacy', label: 'Pharmacy', icon: li('shop') },
  { id: 'ipd', label: 'IPD', icon: <TPIcon name="hospital" size={26} /> },
  { id: 'data-analytics', label: 'Data analytics', icon: li('chart-1') },
  { id: 'apollo-analytics', label: 'Apollo analytics', icon: li('chart') },
  { id: 'messages', label: 'Messages', icon: li('message-programming') },
];

// Small TatvaPractice wordmark (token-driven, no asset dependency).
const Logo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
    <span style={{ width: 30, height: 30, borderRadius: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4b4ad5, #6c4f90)', color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: 'Inter, sans-serif' }}>T</span>
    <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tp-slate-700, #454551)', letterSpacing: '0.02em' }}>Practice</span>
  </div>
);

const meta = {
  title: 'Molecules/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Primary navigation rail (icon-over-label items, active blue indicator bar). Icons are the TP icon atoms rendered in currentColor, so the active item tints them blue automatically. Items, active id, logo, footer, and width are all configurable.' } },
  },
  argTypes: {
    activeId: { control: 'select', options: ITEMS.map((i) => i.id), name: 'active item', table: { category: 'State' } },
    showLogo: { control: 'boolean', name: 'with logo', table: { category: 'Content' } },
    showFooter: { control: 'boolean', name: 'with footer (avatar)', table: { category: 'Content' } },
    trialBadges: { control: 'boolean', name: 'Trial badges (Pharmacy/IPD)', table: { category: 'Content' } },
    width: { control: { type: 'range', min: 84, max: 140, step: 2 }, name: 'rail width', table: { category: 'Layout' } },
  },
  args: {
    activeId: 'appointment',
    showLogo: true,
    showFooter: true,
    trialBadges: true,
    width: 100,
  },
};

export default meta;

const Avatar = () => (
  <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--tp-blue-100, #d8d8fa)', color: 'var(--tp-blue-700, #2f2e90)', fontWeight: 700, fontSize: 12, fontFamily: 'Inter, sans-serif' }}>DS</span>
);

// Keyed by activeId so changing the control re-seeds the local selection
// (no set-state-in-effect needed).
function SidebarDemo({ activeId, showLogo, showFooter, trialBadges, width }) {
  const [active, setActive] = React.useState(activeId);
  const items = ITEMS.map((it) =>
    trialBadges && (it.id === 'pharmacy' || it.id === 'ipd') ? { ...it, badge: 'trial' } : it,
  );
  return (
    <div style={{ display: 'flex', height: 560, background: 'var(--tp-slate-50, #f8fafc)' }}>
      <Sidebar
        items={items}
        activeId={active}
        onSelect={setActive}
        width={width}
        logo={showLogo ? <Logo /> : undefined}
        footer={showFooter ? <Avatar /> : undefined}
      />
      <div style={{ flex: 1, padding: 24, fontFamily: 'Inter, sans-serif', color: 'var(--tp-slate-600, #717179)' }}>
        Active: <strong style={{ color: 'var(--tp-slate-900, #171725)' }}>{active}</strong>
      </div>
    </div>
  );
}

export const Playground = {
  render: (args) => <SidebarDemo key={args.activeId} {...args} />,
};

/** Just the rail, no logo/footer chrome. */
export const RailOnly = {
  render: () => {
    const [active, setActive] = React.useState('all-patients');
    return (
      <div style={{ height: 560 }}>
        <Sidebar items={ITEMS} activeId={active} onSelect={setActive} />
      </div>
    );
  },
};
