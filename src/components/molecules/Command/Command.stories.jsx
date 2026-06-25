import React from 'react';
import { Command } from './Command';
import { Button } from '@/src/components/atoms/Button';

const meta = {
  title: 'Molecules/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A ⌘K command palette — a dialog-hosted, searchable, keyboard-navigable list for fast global navigation and actions (patient lookup, quick actions).',
          '',
          '**When to use** — power-user fast access across the app. For a per-trigger action list use **Menu**; for a value picker use **Dropdown**.',
          '',
          '**Key props** — `open` / `defaultOpen` / `onOpenChange` (wire to your ⌘K shortcut), `groups` (or flat `items`) of `{ id, label, icon?, shortcut?, keywords?, onSelect, disabled? }`, `placeholder`, `emptyText`.',
          '',
          '**Good to know** — filters live as you type (label + `keywords`); ↑/↓ move, Enter runs `onSelect`; hosted in the shared DialogPrimitive (focus trap, scroll lock, Escape, scrim). Input auto-focuses on open.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text', description: 'Search-input placeholder' },
    emptyText: { control: 'text', description: 'Shown when the query matches nothing' },
    label: { control: 'text', description: 'Accessible name for the palette dialog (aria-label)' },
    withGroupHeadings: { control: 'boolean', description: 'Story helper — render grouped (with headings) vs a single flat list' },
    withIcons: { control: 'boolean', description: 'Story helper — show leading icons on items' },
    withShortcuts: { control: 'boolean', description: 'Story helper — show keyboard-shortcut hints on action items' },
    // Wired by the story render() / not directly controllable from the panel.
    open: { control: false, description: 'Controlled open state (wire to your ⌘K shortcut)' },
    defaultOpen: { control: false, description: 'Uncontrolled initial open state' },
    onOpenChange: { control: false, description: 'Called when the palette opens/closes' },
    groups: { control: false, description: 'Grouped items — [{ heading?, items: [{ id, label, icon?, shortcut?, keywords?, onSelect, disabled? }] }]' },
    items: { control: false, description: 'Flat items convenience (one unlabeled group)' },
  },
  args: {
    placeholder: 'Search patients or actions…',
    emptyText: 'No results found.',
    label: 'Command palette',
    withGroupHeadings: true,
    withIcons: true,
    withShortcuts: true,
  },
};
export default meta;

// Build the data-driven groups from the story-helper toggles.
const buildGroups = ({ withGroupHeadings = true, withIcons = true, withShortcuts = true }) => {
  const patients = [
    { id: 'p1', label: 'Ramesh Kumar — MRN 10231', icon: withIcons ? 'profile-2user' : undefined, keywords: ['patient'], onSelect: () => {} },
    { id: 'p2', label: 'Aarav Sharma — MRN 10232', icon: withIcons ? 'profile-2user' : undefined, keywords: ['patient'], onSelect: () => {} },
  ];
  const actions = [
    { id: 'a1', label: 'New appointment', icon: withIcons ? 'calendar-1' : undefined, shortcut: withShortcuts ? '⌘N' : undefined, onSelect: () => {} },
    { id: 'a2', label: 'New prescription', icon: withIcons ? 'document-text' : undefined, shortcut: withShortcuts ? '⌘R' : undefined, onSelect: () => {} },
    { id: 'a3', label: 'Open settings', icon: withIcons ? 'setting-4' : undefined, onSelect: () => {} },
  ];
  if (withGroupHeadings) {
    return [
      { heading: 'Patients', items: patients },
      { heading: 'Actions', items: actions },
    ];
  }
  return [{ items: [...patients, ...actions] }];
};

export const Playground = {
  render: ({ withGroupHeadings, withIcons, withShortcuts, ...args }) => {
    const [open, setOpen] = React.useState(false);
    const groups = buildGroups({ withGroupHeadings, withIcons, withShortcuts });
    return (
      <>
        <Button variant="outline" theme="neutral" onClick={() => setOpen(true)}>Open command palette (⌘K)</Button>
        <Command {...args} open={open} onOpenChange={setOpen} groups={groups} />
      </>
    );
  },
};

/** Open by default (for previewing the palette). */
export const Open = {
  render: ({ withGroupHeadings, withIcons, withShortcuts, ...args }) => (
    <Command {...args} defaultOpen groups={buildGroups({ withGroupHeadings, withIcons, withShortcuts })} />
  ),
};
