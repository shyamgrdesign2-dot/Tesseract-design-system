import { Kbd } from './Kbd';

const meta = {
  title: 'Atoms/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A keyboard key / shortcut cap (⌘K, Esc, ↵) — for documenting shortcuts and pairing with Command / Menu hints.',
          '',
          '**When to use** — surface a keyboard shortcut inline (in menus, help, the ⌘K palette trigger).',
          '',
          '**Key props** — `size` (sm · md). Renders a `<kbd>`; compose multiples for chords (`⌘` + `K`).',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: 'Key-cap size.',
      table: { category: 'Appearance' },
    },
    children: {
      control: 'text',
      name: 'children (key text)',
      description: 'The key / glyph to render inside the cap (e.g. ⌘, K, Esc, ↵).',
      table: { category: 'Content' },
    },
  },
  args: { size: 'md', children: 'K' },
};
export default meta;

export const Playground = { render: (a) => <Kbd {...a} /> };

/** Chords + special keys. */
export const Examples = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ display: 'inline-flex', gap: 4 }}><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
      <span style={{ display: 'inline-flex', gap: 4 }}><Kbd>⌘</Kbd><Kbd>B</Kbd></span>
      <Kbd>Esc</Kbd>
      <Kbd>↵</Kbd>
      <Kbd>⇧</Kbd>
    </div>
  ),
};

/** Sizes. */
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Kbd size="sm">⌘K</Kbd>
      <Kbd size="md">⌘K</Kbd>
    </div>
  ),
};
