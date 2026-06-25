import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from './Sheet';
import { Button } from '@/src/components/atoms/Button';
import { InputBox } from '@/src/components/atoms/Input/InputBox';

const SIDES = ['left', 'right', 'top', 'bottom'];

const meta = {
  title: 'Molecules/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A side drawer / panel — slides in from an edge as a modal surface. The substrate for the mobile sidebar, filter panels, patient quick-view, and slide-in forms.',
          '',
          '**When to use** — a focused task or secondary content that overlays the page from an edge. For a centered confirm/alert use **ConfirmDialog**; for an anchored mini-panel use **Popover**.',
          '',
          '**Key parts** — `Sheet` (root, controlled/uncontrolled `open`) · `SheetTrigger` (asChild) · `SheetContent` (`side` left/right/top/bottom, `showClose`) · `SheetHeader` / `SheetTitle` / `SheetDescription` / `SheetFooter` · `SheetClose` (asChild).',
          '',
          '**Good to know** — composes the shared DialogPrimitive: focus trap, scroll lock, Escape, focus restore, `role="dialog"`/`aria-modal`, overlay scrim. Slide animation honors `prefers-reduced-motion`.',
        ].join('\n'),
      },
    },
  },
  // These controls drive SheetContent in the Playground render below.
  argTypes: {
    side: {
      control: 'inline-radio',
      options: SIDES,
      description: 'Edge the sheet slides in from.',
      table: { category: 'SheetContent', defaultValue: { summary: 'right' } },
    },
    showClose: {
      control: 'boolean',
      description: 'Render the built-in close (X) button in the corner.',
      table: { category: 'SheetContent', defaultValue: { summary: 'true' } },
    },
    closeIcon: {
      control: 'text',
      description: 'TPLibraryIcon name for the built-in close button glyph.',
      if: { arg: 'showClose' },
      table: { category: 'SheetContent', defaultValue: { summary: 'close-square' } },
    },
  },
  args: {
    side: 'right',
    showClose: true,
    closeIcon: 'close-square',
  },
};
export default meta;

export const Playground = {
  render: ({ side, showClose, closeIcon }) => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline" theme="neutral">Open filters</Button></SheetTrigger>
      <SheetContent side={side} showClose={showClose} closeIcon={closeIcon}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the patient list.</SheetDescription>
        </SheetHeader>
        <InputBox label="Search" placeholder="Name or MRN" fullWidth />
        <SheetFooter>
          <SheetClose asChild><Button variant="ghost" theme="neutral">Cancel</Button></SheetClose>
          <SheetClose asChild><Button variant="solid" theme="primary">Apply</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/** Each side. */
export const Sides = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild><Button variant="tonal" theme="neutral" style={{ textTransform: 'capitalize' }}>{side}</Button></SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader><SheetTitle style={{ textTransform: 'capitalize' }}>{side} sheet</SheetTitle><SheetDescription>Slides in from the {side}.</SheetDescription></SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
