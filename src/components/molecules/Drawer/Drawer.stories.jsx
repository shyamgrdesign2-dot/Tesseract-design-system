import { useState } from 'react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerHeader } from './Drawer';
import { Button } from '../../atoms/Button/Button';
import { InputBox } from '../../atoms/Input/InputBox';
import { Header } from '../Header/Header';
import { SectionCard } from '../SectionCard/SectionCard';
import { Badge } from '../../atoms/Badge/Badge';
import { TPLibraryIcon } from '../../atoms/icons/tp/TPLibraryIcon';

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

/** Reuse the app Header as the drawer header (compact height + back button).
 *  Pass any node to `header` — here the real Header component at height 56. */
export const WithAppHeader = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild><Button>Open with app header</Button></DrawerTrigger>
        <DrawerContent
          width="50%"
          header={
            <Header
              height={56}
              density="compact"
              bordered
              back
              onBack={() => setOpen(false)}
              backIcon="arrow-left3"
              title="Edit patient"
              subtitle="MRN-0042"
              actions={[{ type: 'cta', label: 'Save', variant: 'solid' }]}
            />
          }
          footer={<><DrawerClose asChild><Button variant="ghost" theme="neutral" size="sm">Cancel</Button></DrawerClose><Button size="sm">Save</Button></>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InputBox label="Full name" placeholder="Jane Doe" fullWidth />
            <InputBox label="Phone" placeholder="+91" fullWidth />
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
};

/** Footer variants — plain text · info text · info + CTAs. */
export const FooterVariants = {
  render: () => {
    const [v, setV] = useState(null);
    const variants = {
      text: <span style={{ font: '13px var(--tesseract-font-body)', color: 'var(--tesseract-slate-500)' }}>Last saved 2 min ago</span>,
      info: <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--tesseract-slate-600)', font: '13px var(--tesseract-font-body)' }}><TPLibraryIcon name="info-circle" variant="bulk" size={18} color="var(--tesseract-blue-500)" />3 unsaved changes</div>,
      cta: <><span style={{ marginRight: 'auto', font: '13px var(--tesseract-font-body)', color: 'var(--tesseract-slate-600)' }}>Total: ₹11,500</span><Button variant="ghost" theme="neutral" size="sm">Discard</Button><Button size="sm">Apply</Button></>,
    };
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {Object.keys(variants).map((k) => (
          <Drawer key={k} open={v === k} onOpenChange={(o) => setV(o ? k : null)}>
            <DrawerTrigger asChild><Button variant="outline" theme="neutral" size="sm">{k}</Button></DrawerTrigger>
            <DrawerContent width="40%" title={`Footer: ${k}`} footerAlign={k === 'cta' ? 'between' : 'start'} footer={variants[k]}>
              <p style={{ margin: 0, color: 'var(--tesseract-slate-600)', font: '14px var(--tesseract-font-body)' }}>The footer is pinned; the body scrolls between header and footer.</p>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    );
  },
};

/** Rich, scrollable middle content — a SectionCard with fields (header + footer
 *  stay pinned while this scrolls). The body accepts any molecules. */
export const RichContent = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild><Button>Open form drawer</Button></DrawerTrigger>
        <DrawerContent width="50%" title="New appointment" action={<Badge variant="soft" color="primary" size="sm">Draft</Badge>}
          footer={<><DrawerClose asChild><Button variant="ghost" theme="neutral" size="sm">Cancel</Button></DrawerClose><Button size="sm">Create</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Patient', 'Visit', 'Billing'].map((s, i) => (
              <SectionCard key={s} number={i + 1} title={s} tone="primary" collapsible defaultCollapsed={i > 0}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <InputBox label={`${s} field A`} placeholder="…" fullWidth />
                  <InputBox label={`${s} field B`} placeholder="…" fullWidth />
                </div>
              </SectionCard>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
};

/** Header-less drawer (showClose=false, no title) — pure content panel. */
export const NoHeader = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild><Button>Open (no header)</Button></DrawerTrigger>
        <DrawerContent width="40%" showClose={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <DrawerHeader showClose title="Custom inline header" />
            <p style={{ margin: 0, color: 'var(--tesseract-slate-600)', font: '14px var(--tesseract-font-body)' }}>No built-in header band — compose your own.</p>
          </div>
        </DrawerContent>
      </Drawer>
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
