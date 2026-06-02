import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './Tooltip';
import { Button } from '@/src/components/atoms/Button';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'In-house, collision-aware tooltip. Hover or click trigger, optional dismiss (×), optional leading icon, dark/light surfaces, arrow, controlled state, and a `whenTruncated` mode. Wrapper mode (`content`) or compound parts.' } },
  },
  argTypes: {
    content:       { control: 'text', table: { category: 'Content' } },
    withIcon:      { control: 'boolean', name: 'with icon', table: { category: 'Content' } },
    iconName:      { control: 'text', tpIcon: true, name: 'icon', description: 'Leading TP icon (needs "with icon" on)', table: { category: 'Content' } },
    trigger:       { control: 'inline-radio', options: ['hover', 'click'], table: { category: 'Behaviour' } },
    dismissible:   { control: 'boolean', name: 'with dismiss (×)', table: { category: 'Behaviour' } },
    side:          { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'], table: { category: 'Placement' } },
    align:         { control: 'inline-radio', options: ['start', 'center', 'end'], table: { category: 'Placement' } },
    sideOffset:    { control: { type: 'range', min: 0, max: 24, step: 1 }, table: { category: 'Placement' } },
    variant:       { control: 'inline-radio', options: ['dark', 'light'], table: { category: 'Appearance' } },
    arrow:         { control: 'boolean', table: { category: 'Appearance' } },
    maxWidth:      { control: { type: 'range', min: 120, max: 400, step: 10 }, table: { category: 'Appearance' } },
    delayDuration: { control: { type: 'range', min: 0, max: 800, step: 50 }, table: { category: 'Behaviour' } },
    disabled:      { control: 'boolean', table: { category: 'Behaviour' } },
    whenTruncated: { control: 'boolean', description: 'Hover only — show when trigger text overflows', table: { category: 'Behaviour' } },
    children:      { table: { disable: true } },
  },
  args: {
    content: 'Save changes',
    withIcon: false,
    iconName: 'information',
    trigger: 'hover',
    dismissible: false,
    side: 'top',
    align: 'center',
    sideOffset: 6,
    variant: 'dark',
    arrow: true,
    maxWidth: 280,
    delayDuration: 200,
    disabled: false,
    whenTruncated: false,
  },
};

export default meta;

export const Playground = {
  render: ({ withIcon, iconName, ...args }) => (
    <Tooltip {...args} icon={withIcon && iconName ? <TPLibraryIcon name={iconName} size={16} /> : undefined}>
      <Button variant="outline">{args.trigger === 'click' ? 'Click me' : 'Hover me'}</Button>
    </Tooltip>
  ),
};

/** Hover vs click trigger. The click one stays open until you click out / dismiss. */
export const Triggers = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Tooltip content="Opens on hover" trigger="hover"><Button variant="outline">Hover</Button></Tooltip>
      <Tooltip content="Opens on click — click out or × to close" trigger="click" dismissible side="bottom">
        <Button variant="solid">Click</Button>
      </Tooltip>
    </div>
  ),
};

/** With a leading icon vs without. */
export const WithIcon = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Tooltip content="Email verified" icon={<TPLibraryIcon name="verify" size={16} />}><Button variant="outline">With icon</Button></Tooltip>
      <Tooltip content="No icon here"><Button variant="outline">Without icon</Button></Tooltip>
    </div>
  ),
};

/** Dismissible — a click tooltip with the square × (like the toast / dialog close). */
export const Dismissible = {
  render: () => (
    <Tooltip
      trigger="click"
      dismissible
      side="bottom"
      maxWidth={260}
      icon={<TPLibraryIcon name="information" size={16} />}
      content="3 active prescriptions · 1 pending lab result. Click the × to dismiss."
    >
      <Button variant="tonal">Patient summary</Button>
    </Tooltip>
  ),
};

/** All four sides. */
export const Sides = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 32, padding: 48 }}>
      {['top', 'right', 'bottom', 'left'].map((side) => (
        <Tooltip key={side} content={`Side: ${side}`} side={side}>
          <Button variant="outline">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Dark (default) and light surfaces. */
export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Tooltip content="Dark surface" variant="dark"><Button variant="solid">Dark</Button></Tooltip>
      <Tooltip content="Light surface" variant="light"><Button variant="outline">Light</Button></Tooltip>
    </div>
  ),
};

/** Long body wraps within maxWidth. */
export const RichContent = {
  render: () => (
    <Tooltip
      side="bottom"
      maxWidth={240}
      content="This patient has 3 active prescriptions and 1 pending lab result awaiting review."
    >
      <Button variant="tonal">Patient summary</Button>
    </Tooltip>
  ),
};

/** whenTruncated — the tooltip only appears for the clipped row.
 *  Hover both: only the long one shows a tooltip. */
export const OnlyWhenTruncated = {
  name: 'When Truncated',
  render: () => {
    const cell = { maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14, padding: '8px 10px', border: '1px solid var(--tp-slate-200, #e5e7eb)', borderRadius: 8 };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Tooltip content="Short label" whenTruncated side="top">
          <div style={cell}>Short label</div>
        </Tooltip>
        <Tooltip content="Outpatient cardiology follow-up — Dr. Mehta, OPD Block B, 11:30 AM" whenTruncated side="top">
          <div style={cell}>Outpatient cardiology follow-up — Dr. Mehta, OPD Block B, 11:30 AM</div>
        </Tooltip>
      </div>
    );
  },
};

/** Compound parts — full control over trigger and content. */
export const CompoundParts = {
  render: () => (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost">Compound trigger</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>Built from parts</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
