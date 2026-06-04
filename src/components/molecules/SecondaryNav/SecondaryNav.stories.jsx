import React from 'react';
import { SecondaryNav } from './SecondaryNav';

// The RxPad secondary nav set (icons from the TP library; medical names resolve
// through TPLibraryIcon's medical-aware lookup).
const ITEMS = [
  { id: 'pastVisits', label: 'Past Visits', icon: 'note-1' },
  { id: 'vitals', label: 'Vitals', icon: 'chart-1', signal: true },
  { id: 'history', label: 'History', icon: 'clipboard-text' },
  { id: 'labResults', label: 'Lab Results', icon: 'flask' },
  { id: 'records', label: 'Records', icon: 'folder-2' },
  { id: 'gynec', label: 'Gynec', icon: 'dna' },
  { id: 'obstetric', label: 'Obstetric', icon: 'baby' },
  { id: 'vaccine', label: 'Vaccine', icon: 'syringe' },
  { id: 'growth', label: 'Growth', icon: 'ruler-pen' },
  { id: 'optal', label: 'Ophthal', icon: 'eye-tp' },
  { id: 'personalNotes', label: 'Private Notes', icon: 'document-text' },
  { id: 'zydus', label: 'Zydus Reports', icon: 'microscope' },
];
const IDS = ITEMS.map((i) => i.id);

const meta = {
  title: 'Molecules/SecondaryNav',
  component: SecondaryNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The RxPad secondary navigation rail — an 80px blue-gradient rail of icon-pill-over-label items. The pill is a translucent-white chip with a white icon at rest, and turns solid white with a blue icon when active (white row tint + 3px white left bar). An optional red signal dot (Badge atom) marks items with new data. Icons come from the TP library.' } },
  },
  argTypes: {
    activeId: { control: 'select', options: IDS, name: 'active item' },
    signalItem: { control: 'select', options: ['none', ...IDS], name: 'signal dot on' },
    width: { control: { type: 'range', min: 72, max: 96, step: 2 }, name: 'rail width' },
  },
  args: { activeId: 'vitals', signalItem: 'vitals', width: 80 },
};

export default meta;

function SecondaryNavDemo({ activeId, signalItem, width }) {
  const [active, setActive] = React.useState(activeId);
  const items = ITEMS.map((it) => (it.id === signalItem ? { ...it, signal: true } : { ...it, signal: false }));
  return (
    <div style={{ display: 'flex', height: 640, background: 'var(--tp-slate-50, #f8fafc)' }}>
      <SecondaryNav items={items} activeId={active} onSelect={setActive} width={width} />
      <div style={{ flex: 1, padding: 24, fontFamily: 'Inter, sans-serif', color: 'var(--tp-slate-600, #717179)' }}>
        Active section: <strong style={{ color: 'var(--tp-slate-900, #171725)' }}>{active}</strong>
      </div>
    </div>
  );
}

export const Playground = {
  render: (args) => <SecondaryNavDemo key={`${args.activeId}-${args.signalItem}`} {...args} />,
};

/** Just the rail. */
export const RailOnly = {
  render: () => {
    const [active, setActive] = React.useState('history');
    return <div style={{ height: 640 }}><SecondaryNav items={ITEMS} activeId={active} onSelect={setActive} /></div>;
  },
};
