import { Empty } from './Empty';
import { Button } from '@/src/components/atoms/Button';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Empty-state — a centered icon + title + description + optional action, for tables, lists, sidebars, and search no-results.',
          '',
          '**When to use** — "no records yet", "no matches", "nothing scheduled" — to orient the user and offer a next step.',
          '**When not** — for transient feedback use **Toast**; for loading use **Skeleton** / **LoadingIndicator**.',
          '',
          '**Key props** — `icon` (name or node, in a soft disc) or `media` (custom illustration), `title`, `description`, `action` (compose Button), `size` (sm · md).',
          '',
          '**Good to know** — `role="status"` so assistive tech announces the state; token-only and self-contained; compose the Button atom in `action`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    icon: { control: 'text', tpIcon: true, table: { category: 'Content' } },
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Appearance' } },
  },
  args: {
    icon: 'box',
    title: 'No patients yet',
    description: 'Add your first patient to start managing appointments and records.',
    size: 'md',
  },
};
export default meta;

export const Playground = {
  render: (a) => (
    <Empty {...a} action={<Button leftIcon={<TPLibraryIcon name="add-square" size={18} />}>Add patient</Button>} />
  ),
};

/** Search no-results (no action). */
export const NoResults = {
  render: () => (
    <Empty icon="search-normal-1" title="No matches" description="Try a different name, MRN, or phone number." />
  ),
};

/** Compact, for inside a card or sidebar. */
export const Small = {
  render: () => (
    <Empty size="sm" icon="document-text" title="No notes" description="Clinical notes will appear here." />
  ),
};
