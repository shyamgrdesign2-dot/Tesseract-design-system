import React from 'react';
import { Sidebar } from './Sidebar';

// ── Item schema ───────────────────────────────────────────────────────────────
// Every nav option is the SAME shape, so adding one is just another entry here
// and it inherits all the same configurability (name, icon, active state, tag):
//   { id, label, icon, badge?, disabled? }
//     icon  — TP library icon name (string) → switches linear→bulk on active
//     badge — "trial" | { text, variant, color, sticky } | ReactNode
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
    docs: { description: { component: 'Primary 80px navigation rail (width flexes 72–100px). The icon chip reuses the Button atom (tonal/grey at rest, solid/blue when active); the icon switches linear→bulk on select. Tags reuse the Badge atom (incl. gradient + sticky). Every item shares one config schema `{ id, label, icon, badge }` — the Playground lets you pick ONE item and fully configure it (rename, swap icon, add/shape its tag); every other item is just another entry with the same fields.' } },
  },
  argTypes: {
    activeId: { control: 'select', options: IDS, name: 'active item', table: { category: 'Rail' } },
    bottomFade: { control: 'boolean', name: 'bottom fade', table: { category: 'Rail' } },
    width: { control: { type: 'range', min: 72, max: 100, step: 2 }, name: 'rail width', table: { category: 'Rail' } },

    // ── Configure ONE item — the same controls every item supports ──
    editItem: { control: 'select', options: IDS, name: 'item to edit', table: { category: 'Selected item' } },
    label: { control: 'text', name: 'name (blank = keep)', table: { category: 'Selected item' } },
    icon: { control: 'text', tpIcon: true, name: 'icon (blank = keep)', table: { category: 'Selected item' } },
    withTag: { control: 'boolean', name: 'add tag', table: { category: 'Selected item · tag' } },
    tagText: { control: 'text', name: 'tag · text', table: { category: 'Selected item · tag' } },
    tagVariant: { control: 'inline-radio', options: TAG_VARIANTS, name: 'tag · variant', table: { category: 'Selected item · tag' } },
    tagColor: { control: 'select', options: TAG_COLORS, name: 'tag · color', table: { category: 'Selected item · tag' } },
    tagSticky: { control: 'inline-radio', options: ['right', 'left', 'none'], name: 'tag · sticky', table: { category: 'Selected item · tag' } },
  },
  args: {
    activeId: 'appointments',
    bottomFade: true,
    width: 80,
    editItem: 'opd-billing',
    label: '',
    icon: '',
    withTag: true,
    tagText: 'Trial',
    tagVariant: 'gradient',
    tagColor: 'warning',
    tagSticky: 'right',
  },
};

export default meta;

function SidebarDemo({ activeId, bottomFade, width, editItem, label, icon, withTag, tagText, tagVariant, tagColor, tagSticky }) {
  const [active, setActive] = React.useState(activeId);
  // Apply the per-item config to the selected item only; blank fields keep the
  // item's defaults. Every other item is left as its base entry — same schema.
  const items = ITEMS.map((it) => {
    if (it.id !== editItem) return it;
    const next = { ...it };
    if (label && label.trim()) next.label = label.trim();
    if (icon && icon.trim()) next.icon = icon.trim();
    if (withTag) next.badge = { text: tagText || 'Trial', variant: tagVariant, color: tagColor, sticky: tagSticky === 'none' ? undefined : tagSticky };
    return next;
  });
  return (
    <div style={{ display: 'flex', height: 600, background: 'var(--tp-slate-50, #f8fafc)' }}>
      <Sidebar items={items} activeId={active} onSelect={setActive} width={width} bottomFade={bottomFade} />
      <div style={{ flex: 1, padding: 24, fontFamily: 'Inter, sans-serif', color: 'var(--tp-slate-600, #717179)' }}>
        Active: <strong style={{ color: 'var(--tp-slate-900, #171725)' }}>{active}</strong>
        <p style={{ fontSize: 13, marginTop: 12, maxWidth: 420, lineHeight: 1.5 }}>
          Editing <strong>{editItem}</strong>. Pick any item in <em>item to edit</em> to configure its
          name, icon, and tag — every option uses the same controls.
        </p>
      </div>
    </div>
  );
}

export const Playground = {
  render: (args) => <SidebarDemo key={args.editItem} {...args} />,
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
