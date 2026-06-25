import { useState } from 'react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from './Drawer';
import { Button } from '../../atoms/Button/Button';
import { InputBox } from '../../atoms/Input/InputBox';

const meta = {
  title: 'Molecules/Drawer',
  component: DrawerContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'An edge-anchored modal panel with a consistent header / body / footer. The one slide-in surface for filters, quick-views, forms, bill previews and record editors.',
          '',
          '**When to use** — any side panel. The header (close · divider · title · `action`) and `footer` are standard; the body is any content you compose.',
          '',
          '**Key props (DrawerContent)** — `side` (right·left·top·bottom); `width` for left/right and `height` for top/bottom, each accepting `"full"` · a percentage (`"70%"`) · a px number (capped at the viewport) · any CSS length; `title` · `description` · `action` (header CTAs) · `footer`; `showClose`, `closeIcon`, `bodyPadding`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['right', 'left', 'top', 'bottom'] },
    width: { control: 'select', options: ['full', '90%', '80%', '70%', '60%', '50%', '40%', '30%', 440, 600, 880] },
    showClose: { control: 'boolean' },
    title: { control: 'text' },
    bodyPadding: { control: 'number' },
  },
  args: { side: 'right', width: '50%', showClose: true, title: 'Create Treatment Plan' },
};
export default meta;

export const Playground = {
  render: (a) => {
    const [open, setOpen] = useState(false);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild><Button>Open Drawer</Button></DrawerTrigger>
        <DrawerContent
          {...a}
          action={<Button size="sm">Save</Button>}
          footer={<><DrawerClose asChild><Button variant="ghost" theme="neutral" size="sm">Cancel</Button></DrawerClose><Button size="sm">Create Plan</Button></>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InputBox label="Plan name" placeholder="e.g., Wisdom Tooth Removal" fullWidth />
            <InputBox label="Notes" placeholder="Optional" fullWidth autoGrow />
            <p style={{ margin: 0, color: 'var(--tesseract-slate-600)', font: '14px var(--tesseract-font-body)' }}>
              The body is fully scrollable and accepts any composed content.
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
};

/** Width presets — percentage of the viewport. */
export const WidthPresets = {
  render: () => {
    const [w, setW] = useState(null);
    const presets = ['full', '90%', '80%', '70%', '60%', '50%', '40%', '30%'];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {presets.map((p) => (
          <Drawer key={p} open={w === p} onOpenChange={(o) => setW(o ? p : null)}>
            <DrawerTrigger asChild><Button variant="outline" theme="neutral" size="sm">{p}</Button></DrawerTrigger>
            <DrawerContent width={p} title={`Drawer — ${p}`} footer={<DrawerClose asChild><Button size="sm">Done</Button></DrawerClose>}>
              <p style={{ margin: 0, color: 'var(--tesseract-slate-600)', font: '14px var(--tesseract-font-body)' }}>Width set to {p} of the viewport.</p>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    );
  },
};

/** Bottom sheet (height preset). */
export const BottomSheet = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild><Button>Open bottom</Button></DrawerTrigger>
        <DrawerContent side="bottom" height="40%" title="Quick actions" footer={<DrawerClose asChild><Button size="sm">Close</Button></DrawerClose>}>
          <p style={{ margin: 0, color: 'var(--tesseract-slate-600)', font: '14px var(--tesseract-font-body)' }}>Slides up from the bottom edge.</p>
        </DrawerContent>
      </Drawer>
    );
  },
};
