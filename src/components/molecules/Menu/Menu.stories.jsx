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

// Build an accurate "Show code" snippet from the Playground controls.
const menuCode = ({ side, align, sideOffset, triggerLabel, triggerVariant, item1Icon, item2Icon, item2Shortcut, showSeparator, dangerIcon, dangerDisabled }) => {
  const contentProps = [];
  if (side && side !== 'bottom') contentProps.push(`side="${side}"`);
  if (align && align !== 'start') contentProps.push(`align="${align}"`);
  if (sideOffset != null && sideOffset !== 6) contentProps.push(`sideOffset={${sideOffset}}`);
  const cp = contentProps.length ? ` ${contentProps.join(' ')}` : '';
  return [
    `<Menu>`,
    `  <MenuTrigger asChild>`,
    `    <Button variant="${triggerVariant}" theme="neutral">${triggerLabel}</Button>`,
    `  </MenuTrigger>`,
    `  <MenuContent${cp}>`,
    `    <MenuItem icon="${item1Icon}" onSelect={() => {}}>Edit</MenuItem>`,
    `    <MenuItem icon="${item2Icon}"${item2Shortcut ? ` shortcut="${item2Shortcut}"` : ''} onSelect={() => {}}>Duplicate</MenuItem>`,
    showSeparator ? `    <MenuSeparator />` : null,
    `    <MenuItem icon="${dangerIcon}" danger${dangerDisabled ? ' disabled' : ''} onSelect={() => {}}>Delete</MenuItem>`,
    `  </MenuContent>`,
    `</Menu>`,
  ].filter(Boolean).join('\n');
};

// ── Playground — every knob lives in the Controls panel ───────────────────────
export const Playground = {
  args: {
    defaultOpen: false,
    side: 'bottom',
    align: 'start',
    sideOffset: 6,
    triggerLabel: 'Actions',
    triggerVariant: 'outline',
    item1Icon: 'edit-2',
    item2Icon: 'copy',
    item2Shortcut: '⌘D',
    showSeparator: true,
    dangerIcon: 'trash',
    dangerDisabled: false,
  },
  argTypes: {
    defaultOpen:    { control: 'boolean', name: 'open by default', description: 'Render the menu open on mount (uncontrolled)', table: { category: 'Behavior' } },
    side:           { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'], description: 'Preferred side of the trigger to place the surface (collision-aware)', table: { category: 'Position' } },
    align:          { control: 'inline-radio', options: ['start', 'center', 'end'], description: 'Alignment of the surface along the chosen side', table: { category: 'Position' } },
    sideOffset:     { control: { type: 'number', min: 0, max: 32, step: 1 }, name: 'side offset', description: 'Gap in px between trigger and surface', table: { category: 'Position' } },
    triggerLabel:   { control: 'text', name: 'trigger label', table: { category: 'Trigger' } },
    triggerVariant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost', 'tonal', 'link'], name: 'trigger variant', table: { category: 'Trigger' } },
    item1Icon:      { control: 'text', tpIcon: true, name: 'item 1 · icon', description: 'Pick from the Tesseract Icons panel (or type a name)', table: { category: 'Items' } },
    item2Icon:      { control: 'text', tpIcon: true, name: 'item 2 · icon', description: 'Pick from the Tesseract Icons panel (or type a name)', table: { category: 'Items' } },
    item2Shortcut:  { control: 'text', name: 'item 2 · shortcut', description: 'Right-aligned shortcut hint, e.g. ⌘D', table: { category: 'Items' } },
    showSeparator:  { control: 'boolean', name: 'separator', description: 'Show a divider before the danger item', table: { category: 'Items' } },
    dangerIcon:     { control: 'text', tpIcon: true, name: 'danger · icon', table: { category: 'Items' } },
    dangerDisabled: { control: 'boolean', name: 'danger · disabled', description: 'Disable the destructive item', table: { category: 'Items' } },
  },
  parameters: { docs: { source: { transform: (_code, ctx) => menuCode(ctx.args) } } },
  render: ({ defaultOpen, side, align, sideOffset, triggerLabel, triggerVariant, item1Icon, item2Icon, item2Shortcut, showSeparator, dangerIcon, dangerDisabled }) => (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      <Menu defaultOpen={defaultOpen}>
        <MenuTrigger asChild>
          <Button variant={triggerVariant} theme="neutral" rightIcon={<TPLibraryIcon name="chevron-down" size={16} />}>{triggerLabel}</Button>
        </MenuTrigger>
        <MenuContent side={side} align={align} sideOffset={Number(sideOffset)}>
          <MenuItem icon={item1Icon} onSelect={() => {}}>Edit</MenuItem>
          <MenuItem icon={item2Icon} shortcut={item2Shortcut || undefined} onSelect={() => {}}>Duplicate</MenuItem>
          <MenuItem icon="document-download" onSelect={() => {}}>Export</MenuItem>
          {showSeparator && <MenuSeparator />}
          <MenuItem icon={dangerIcon} danger disabled={dangerDisabled} onSelect={() => {}}>Delete</MenuItem>
        </MenuContent>
      </Menu>
    </div>
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
