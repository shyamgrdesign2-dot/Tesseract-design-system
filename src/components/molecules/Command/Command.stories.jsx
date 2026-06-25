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
};
export default meta;

const GROUPS = [
  { heading: 'Patients', items: [
    { id: 'p1', label: 'Ramesh Kumar — MRN 10231', icon: 'profile-2user', keywords: ['patient'], onSelect: () => {} },
    { id: 'p2', label: 'Aarav Sharma — MRN 10232', icon: 'profile-2user', keywords: ['patient'], onSelect: () => {} },
  ] },
  { heading: 'Actions', items: [
    { id: 'a1', label: 'New appointment', icon: 'calendar-1', shortcut: '⌘N', onSelect: () => {} },
    { id: 'a2', label: 'New prescription', icon: 'document-text', shortcut: '⌘R', onSelect: () => {} },
    { id: 'a3', label: 'Open settings', icon: 'setting-4', onSelect: () => {} },
  ] },
];

export const Playground = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="outline" theme="neutral" onClick={() => setOpen(true)}>Open command palette (⌘K)</Button>
        <Command open={open} onOpenChange={setOpen} groups={GROUPS} placeholder="Search patients or actions…" />
      </>
    );
  },
};

/** Open by default (for previewing the palette). */
export const Open = {
  render: () => <Command defaultOpen groups={GROUPS} placeholder="Search patients or actions…" />,
};
