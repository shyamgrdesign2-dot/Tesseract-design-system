import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Wayfinding for deep navigation — the path to the current resource (Patients › Ramesh Kumar › Visit).',
          '',
          '**When to use** — deep, hierarchical EMR navigation (patient → encounter → result). Pair it with a page Header/HeroBanner.',
          '**When not** — for switching between sibling views use **Tabs**; for primary app nav use **Sidebar**.',
          '',
          '**Key props** — `items` ([{ label, href?, onClick?, icon? }] — the last is the current page), `separator` (icon name or node), `maxItems` (collapse the middle to "…"), `size` (sm · md).',
          '',
          '**Good to know** — the last item renders as text with `aria-current="page"`; earlier items are real `<a>` when `href` is set (SSR / middle-click). `maxItems` keeps the first crumb + the last two and collapses the rest behind a hover-titled "…".',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    separator: { control: 'text', tpIcon: true, name: 'separator (icon)', table: { category: 'Appearance' } },
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Appearance' } },
    maxItems: { control: { type: 'number', min: 0 }, name: 'max items (0 = no collapse)', table: { category: 'Behaviour' } },
  },
  args: { separator: 'arrow-right3', size: 'md', maxItems: 0 },
};
export default meta;

const TRAIL = [
  { label: 'Patients', href: '#patients', icon: 'profile-2user' },
  { label: 'Ramesh Kumar', href: '#patient' },
  { label: 'Encounters', href: '#encounters' },
  { label: 'Visit — 24 Jun 2026' },
];

export const Playground = {
  render: ({ maxItems, ...a }) => <Breadcrumb {...a} maxItems={maxItems || undefined} items={TRAIL} />,
};

/** Simple two-level path. */
export const Basic = {
  render: () => <Breadcrumb items={[{ label: 'Dashboard', href: '#' }, { label: 'Appointments' }]} />,
};

/** Leading icon on the root crumb. */
export const WithIcons = {
  render: () => (
    <Breadcrumb items={[
      { label: 'Home', href: '#', icon: 'home-2' },
      { label: 'Billing', href: '#', icon: 'receipt-item' },
      { label: 'Invoice #10231' },
    ]} />
  ),
};

/** Long trail collapses the middle to "…" (hover for the hidden steps). */
export const Collapsed = {
  render: () => (
    <Breadcrumb
      maxItems={3}
      items={[
        { label: 'Patients', href: '#' },
        { label: 'Ramesh Kumar', href: '#' },
        { label: 'Encounters', href: '#' },
        { label: 'Cardiology', href: '#' },
        { label: 'Visit — 24 Jun 2026' },
      ]}
    />
  ),
};
