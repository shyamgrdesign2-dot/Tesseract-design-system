import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Button } from '@/src/components/atoms/Button';
import { InputBox } from '@/src/components/atoms/Input/InputBox';

const meta = {
  title: 'Molecules/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A generic anchored floating panel for arbitrary interactive content — date pickers, comboboxes, quick-edit forms, rich "more info" panels.',
          '',
          '**When to use** — anchored content that needs focus + interaction. For a list of actions use **Menu**; for hover text use **Tooltip**; for a modal use **ConfirmDialog**; for a side drawer use **Sheet**.',
          '',
          '**Key parts** — `Popover` (root, controlled/uncontrolled `open`) · `PopoverTrigger` (`asChild`) · `PopoverContent` (`side`/`align`/`sideOffset`, portaled, collision-aware, focus-trapped, Escape + click-outside).',
          '',
          '**Good to know** — `role="dialog"`; opens anchored to the trigger and flips on collision; Esc closes and returns focus. Built on the same Portal / usePosition / focus machinery as Menu.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    // ── PopoverContent placement ──
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'], description: 'Preferred side of the trigger the panel opens on (flips on collision)', table: { category: 'Placement' } },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'], description: 'Alignment along the chosen side', table: { category: 'Placement' } },
    sideOffset: { control: { type: 'number', min: 0, max: 40, step: 1 }, description: 'Gap in px between the trigger and the panel', table: { category: 'Placement' } },
    // ── Behaviour ──
    trapFocus: { control: 'boolean', description: 'Trap keyboard focus inside the open panel', table: { category: 'Behaviour' } },
    defaultOpen: { control: 'boolean', description: 'Open on first render (uncontrolled)', table: { category: 'Behaviour' } },
    onOpenChange: { control: false, action: 'openChange', description: 'Fires with the next open state when the panel toggles', table: { category: 'Behaviour' } },
  },
  args: {
    side: 'bottom',
    align: 'start',
    sideOffset: 8,
    trapFocus: true,
    defaultOpen: false,
  },
};
export default meta;

export const Playground = {
  render: ({ side, align, sideOffset, trapFocus, defaultOpen, onOpenChange }) => (
    <Popover defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" theme="neutral">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent side={side} align={align} sideOffset={sideOffset} trapFocus={trapFocus}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <strong style={{ color: 'var(--tesseract-slate-900)' }}>Quick note</strong>
          <span style={{ color: 'var(--tesseract-slate-600)' }}>Anchored, focus-managed content. Press Esc or click away to close.</span>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/** A small quick-edit form inside a popover. */
export const QuickEdit = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="tonal" theme="neutral">Edit dose</Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" style={{ width: 260 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InputBox label="Dosage" defaultValue="500" rightAddon={{ type: 'select', ariaLabel: 'Unit', options: ['mg', 'g'] }} fullWidth />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button size="sm" variant="ghost" theme="neutral">Cancel</Button>
            <Button size="sm" variant="solid" theme="primary">Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
