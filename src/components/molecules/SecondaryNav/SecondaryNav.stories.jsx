import React from 'react';
import { SecondaryNav } from './SecondaryNav';

const DEFAULT_ITEMS = [
  { id: 'pastVisits', label: 'Past Visits', icon: 'clipboard-text' },
  { id: 'vitals', label: 'Vitals', icon: 'heart-rate', signal: true },
  { id: 'history', label: 'History', icon: 'clipboard-activity' },
  { id: 'labResults', label: 'Lab Results', icon: 'lab' },
  { id: 'records', label: 'Records', icon: 'health-file-03' },
  { id: 'gynec', label: 'Gynec', icon: 'gynec' },
  { id: 'obstetric', label: 'Obstetric', icon: 'obstetric' },
  { id: 'vaccine', label: 'Vaccine', icon: 'injection' },
  { id: 'growth', label: 'Growth', icon: 'ruler' },
  { id: 'optal', label: 'Ophthal', icon: 'eye' },
  { id: 'personalNotes', label: 'Private Notes', icon: 'document-text' },
  { id: 'zydus', label: 'Zydus Reports', icon: 'microscope' },
];
const IDS = DEFAULT_ITEMS.map((i) => i.id);

const iconArgTypes = {};
DEFAULT_ITEMS.forEach((item, i) => {
  iconArgTypes[`icon${i}`] = {
    control: 'text', tpIcon: true,
    name: `${item.label} icon`,
    table: { category: 'Icons' },
  };
});

const iconDefaults = {};
DEFAULT_ITEMS.forEach((item, i) => { iconDefaults[`icon${i}`] = item.icon; });

const meta = {
  title: 'Molecules/SecondaryNav',
  component: SecondaryNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The RxPad secondary navigation rail — an 80px blue-gradient rail of icon-pill-over-label items. Every icon is individually configurable via the Tesseract Icons panel.' } },
  },
  argTypes: {
    activeId: { control: 'select', options: IDS, name: 'active item' },
    signalItem: { control: 'select', options: ['none', ...IDS], name: 'signal dot on' },
    width: { control: { type: 'range', min: 72, max: 96, step: 2 }, name: 'rail width' },
    ...iconArgTypes,
  },
  args: { activeId: 'vitals', signalItem: 'vitals', width: 80, ...iconDefaults },
};

export default meta;

function SecondaryNavDemo(args) {
  const { activeId, signalItem, width, ...rest } = args;
  const [active, setActive] = React.useState(activeId);
  const items = DEFAULT_ITEMS.map((it, i) => ({
    ...it,
    icon: rest[`icon${i}`] || it.icon,
    signal: it.id === signalItem,
  }));
  return (
    <div style={{ display: 'flex', height: 640, background: 'var(--tp-slate-50, #FAFAFB)' }}>
      <SecondaryNav items={items} activeId={active} onSelect={setActive} width={width} />
      <div style={{ flex: 1, padding: 'var(--tp-space-6)', fontFamily: 'var(--tp-font-body)', color: 'var(--tp-slate-600, #545460)' }}>
        Active section: <strong style={{ color: 'var(--tp-slate-900, #171725)' }}>{active}</strong>
      </div>
    </div>
  );
}

export const Playground = {
  render: (args) => <SecondaryNavDemo key={`${args.activeId}-${args.signalItem}`} {...args} />,
};

export const RailOnly = {
  render: () => {
    const [active, setActive] = React.useState('history');
    return <div style={{ height: 640 }}><SecondaryNav items={DEFAULT_ITEMS} activeId={active} onSelect={setActive} /></div>;
  },
};
