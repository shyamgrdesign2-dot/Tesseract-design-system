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
    icon: {
      control: 'text',
      tpIcon: true,
      description: 'Icon name (rendered in a soft tinted disc) or a node. Ignored when `media` is set.',
      table: { category: 'Content' },
    },
    title: { control: 'text', description: 'Heading for the empty state.', table: { category: 'Content' } },
    description: { control: 'text', description: 'Supporting copy below the title.', table: { category: 'Content' } },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: 'Overall scale of the icon disc and text.',
      table: { category: 'Appearance' },
    },
    iconSize: { control: { type: 'number', min: 16, max: 64 }, description: 'Glyph size in px (disc scales with it).', table: { category: 'Appearance' } },
    // Story helper — render() turns this label into a composed Button action. Empty string hides the action.
    actionLabel: {
      control: 'text',
      description: 'Story helper: label for the primary action Button. Leave empty for no action.',
      table: { category: 'Content' },
    },
    // Real props not driven by these stories (kept documented, controls disabled).
    media: {
      control: false,
      description: 'Custom illustration node — overrides `icon` when provided.',
      table: { category: 'Content' },
    },
    action: {
      control: false,
      description: 'Primary action node (compose the Button atom). Driven via `actionLabel` in stories.',
      table: { category: 'Content' },
    },
  },
  args: {
    icon: 'box',
    title: 'No patients yet',
    description: 'Add your first patient to start managing appointments and records.',
    size: 'md',
    actionLabel: 'Add patient',
  },
};
export default meta;

export const Playground = {
  render: ({ actionLabel, ...a }) => (
    <Empty
      {...a}
      action={
        actionLabel
          ? <Button leftIcon={<TPLibraryIcon name="add-square" size={18} />}>{actionLabel}</Button>
          : undefined
      }
    />
  ),
};

/** Search no-results (no action). */
export const NoResults = {
  render: () => (
    <Empty icon="search:search-2" title="No matches" description="Try a different name, MRN, or phone number." />
  ),
};

/** Compact, for inside a card or sidebar. */
export const Small = {
  render: () => (
    <Empty size="sm" icon="document-text" title="No notes" description="Clinical notes will appear here." />
  ),
};

/** Two CTAs — a primary plus a secondary action. */
export const TwoActions = {
  render: () => (
    <Empty
      icon="profile-2user"
      title="No patients yet"
      description="Add one manually or import an existing list."
      action={<Button leftIcon={<TPLibraryIcon name="add-square" size={18} />}>Add patient</Button>}
      secondaryAction={<Button variant="outline" theme="neutral">Import CSV</Button>}
    />
  ),
};

/** Action + a text hyperlink CTA (the `link` prop). */
export const WithLink = {
  render: () => (
    <Empty
      icon="box"
      title="No templates"
      description="Create a template to reuse common plans."
      action={<Button>New template</Button>}
      link={{ label: 'Learn how templates work', href: '#' }}
    />
  ),
};

/** Adjustable icon size — the disc scales with `iconSize`. */
export const IconSizes = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {[20, 28, 40].map((s) => (
        <Empty key={s} iconSize={s} icon="gallery" title={`${s}px`} description="Icon size" />
      ))}
    </div>
  ),
};
