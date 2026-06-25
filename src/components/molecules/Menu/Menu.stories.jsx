import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel } from './Menu';
import { Button } from '@/src/components/atoms/Button';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'The shared **action-menu** primitive — an accessible, portaled menu (role="menu" + menuitem) for row "…" actions, header overflow menus, and nav flyouts.',
          '',
          '**When to use** — a list of *actions* triggered by a button (Edit / Duplicate / Delete). For choosing a *value* use **Dropdown**; for a yes/no use **ConfirmDialog**.',
          '',
          '**Key parts** — `Menu` (root, controlled/uncontrolled `open`) · `MenuTrigger` (`asChild`) · `MenuContent` (`side`/`align`, portaled + collision-aware + focus-trapped + arrow-key nav + Escape + click-outside) · `MenuItem` (`icon`/`shortcut`/`danger`/`disabled`/`onSelect`) · `MenuSeparator` · `MenuLabel`.',
          '',
          '**Good to know** — opens focused on the first item; ↑/↓/Home/End move between items; Esc closes and returns focus to the trigger. Composes the Button atom + TPLibraryIcon; portaled surface self-contains its box model.',
        ].join('\n'),
      },
    },
  },
};
export default meta;

export const Playground = {
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="outline" theme="neutral" rightIcon={<TPLibraryIcon name="chevron-down" size={16} />}>Actions</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon="edit-2" onSelect={() => {}}>Edit</MenuItem>
        <MenuItem icon="copy" shortcut="⌘D" onSelect={() => {}}>Duplicate</MenuItem>
        <MenuItem icon="document-download" onSelect={() => {}}>Export</MenuItem>
        <MenuSeparator />
        <MenuItem icon="trash" danger onSelect={() => {}}>Delete</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

/** Icon-only trigger (the row "…" pattern) with a group label. */
export const RowActions = {
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="ghost" theme="neutral" icon={<TPLibraryIcon name="more" size={20} />} aria-label="Row actions" />
      </MenuTrigger>
      <MenuContent align="end">
        <MenuLabel>Patient</MenuLabel>
        <MenuItem icon="eye" onSelect={() => {}}>View record</MenuItem>
        <MenuItem icon="calendar-1" onSelect={() => {}}>Reschedule</MenuItem>
        <MenuItem icon="printer" shortcut="⌘P" onSelect={() => {}}>Print</MenuItem>
        <MenuSeparator />
        <MenuItem icon="trash" danger onSelect={() => {}}>Cancel visit</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

/** Disabled items are skipped by keyboard nav and not selectable. */
export const WithDisabled = {
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="outline" theme="neutral">Options</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon="edit-2" onSelect={() => {}}>Edit</MenuItem>
        <MenuItem icon="lock" disabled>Locked action</MenuItem>
        <MenuItem icon="archive" onSelect={() => {}}>Archive</MenuItem>
      </MenuContent>
    </Menu>
  ),
};
