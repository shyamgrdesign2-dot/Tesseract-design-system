import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './Tooltip';
import { Button } from '@/src/components/atoms/Button';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];
const ICON_SIZE = 16;

// Resolve the leading-icon node for the tooltip, in the chosen style + family.
const glyphFor = (name, size, variant = 'linear', family) =>
  name ? <TPIcon name={name} variant={variant} family={family || undefined} size={size} /> : undefined;

const meta = {
  title: 'Molecules/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'First-party, collision-aware tooltip — flips to stay on-screen, hover or click triggered, with dark/light surfaces and an optional arrow.',
          '',
          '**When to use** — a short hint or label on hover; a click-dismissible info bubble; revealing the full value of clipped text (`whenTruncated`).',
          '**When not** — anything the user must read or act on belongs in a `ConfirmDialog` or `Toast`, not a tooltip; a rich menu of actions is a `Dropdown`.',
          '',
          '**Key props** — `content` (wrapper mode) · `trigger` hover/click · `side` + `align` + `sideOffset` placement · `variant` dark/light · `arrow` + `arrowSize` · `interactive` (keep open while the pointer moves into the bubble) · `closeDelay` · `dismissible` (× close) · `whenTruncated` (only show when the trigger text overflows).',
          '',
          '**Good to know** — use wrapper mode (`<Tooltip content>`) for the common case; reach for compound parts (`TooltipProvider / TooltipTrigger / TooltipContent`) only when you need full control over trigger and content. `interactive` and `whenTruncated` are hover-only. Respects `aria-describedby` and `prefers-reduced-motion`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    content:       { control: 'text', description: 'Tooltip body (wrapper mode); accepts a ReactNode', table: { category: 'Content' } },
    trigger:       { control: 'inline-radio', options: ['hover', 'click'], description: 'Open on hover or on click', table: { category: 'Behaviour' } },
    dismissible:   { control: 'boolean', name: 'with dismiss (×)', description: 'Show a square × close button (pairs with click trigger)', table: { category: 'Behaviour' } },
    side:          { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'], description: 'Preferred side; flips to stay on-screen', table: { category: 'Placement' } },
    align:         { control: 'inline-radio', options: ['start', 'center', 'end'], description: 'Alignment along the chosen side', table: { category: 'Placement' } },
    sideOffset:    { control: { type: 'range', min: 0, max: 24, step: 1 }, description: 'Gap in px between trigger and bubble', table: { category: 'Placement' } },
    variant:       { control: 'inline-radio', options: ['dark', 'light'], description: 'Dark (default) or light surface; the arrow tracks it', table: { category: 'Appearance' } },
    arrow:         { control: 'boolean', description: 'Show the pointer arrow', table: { category: 'Appearance' } },
    arrowSize:     { control: { type: 'range', min: 3, max: 12, step: 1 }, name: 'arrow size', description: 'Arrow size in px', table: { category: 'Appearance' } },
    maxWidth:      { control: { type: 'range', min: 120, max: 400, step: 10 }, description: 'Max bubble width in px before text wraps', table: { category: 'Appearance' } },
    delayDuration: { control: { type: 'range', min: 0, max: 800, step: 50 }, description: 'Hover open delay in ms', table: { category: 'Behaviour' } },
    closeDelay:    { control: { type: 'range', min: 0, max: 500, step: 10 }, name: 'close delay (ms)', description: 'Delay before the hover tooltip closes', table: { category: 'Behaviour' } },
    interactive:   { control: 'boolean', description: 'Hover only — keep open while the pointer is inside the tooltip', table: { category: 'Behaviour' } },
    disabled:      { control: 'boolean', description: 'Suppress the tooltip entirely', table: { category: 'Behaviour' } },
    whenTruncated: { control: 'boolean', description: 'Hover only — show when trigger text overflows', table: { category: 'Behaviour' } },
    withIcon:      { control: 'boolean', name: 'with icon', description: 'Render a leading icon before the content', table: { category: 'Icons' } },
    iconName:      { control: 'text', tpIcon: true, name: 'icon', description: 'Leading CDN icon name (needs "with icon" on; blank = none)', table: { category: 'Icons' } },
    iconVariant:   { control: 'select', options: ICON_VARIANTS, name: 'icon style', description: 'Icon style for the leading icon', table: { category: 'Icons' } },
    iconFamily:    { control: 'text', name: 'icon family', description: 'Override the auto-resolved CDN family (blank = auto)', table: { category: 'Icons' } },
    children:      { table: { disable: true } },
  },
  args: {
    content: 'Save changes',
    trigger: 'hover',
    dismissible: false,
    side: 'top',
    align: 'center',
    sideOffset: 6,
    variant: 'dark',
    arrow: true,
    arrowSize: 5,
    maxWidth: 280,
    delayDuration: 200,
    closeDelay: 60,
    interactive: false,
    disabled: false,
    whenTruncated: false,
    withIcon: false,
    iconName: 'information',
    iconVariant: 'linear',
    iconFamily: '',
  },
};

export default meta;

// Build an accurate, copy-paste code snippet from the controls (what "Show code" shows).
const iconJsx = (name, variant, family, size) =>
  `<TPIcon name="${name}"${variant && variant !== 'linear' ? ` variant="${variant}"` : ''}${family ? ` family="${family}"` : ''} size={${size}} />`;

const tooltipCode = ({ content = '', trigger, dismissible, side, align, variant, arrow, arrowSize, interactive, closeDelay, withIcon, iconName, iconVariant, iconFamily }) => {
  const lines = [`  content="${content}"`];
  if (trigger && trigger !== 'hover') lines.push(`  trigger="${trigger}"`);
  if (dismissible) lines.push('  dismissible');
  if (interactive) lines.push('  interactive');
  if (side && side !== 'top') lines.push(`  side="${side}"`);
  if (align && align !== 'center') lines.push(`  align="${align}"`);
  if (variant && variant !== 'dark') lines.push(`  variant="${variant}"`);
  if (!arrow) lines.push('  arrow={false}');
  if (arrow && arrowSize != null && arrowSize !== 5) lines.push(`  arrowSize={${arrowSize}}`);
  if (closeDelay != null && closeDelay !== 60) lines.push(`  closeDelay={${closeDelay}}`);
  if (withIcon && iconName) lines.push(`  icon={${iconJsx(iconName, iconVariant, iconFamily, ICON_SIZE)}}`);
  return `<Tooltip\n${lines.join('\n')}\n>\n  <Button variant="outline">${trigger === 'click' ? 'Click me' : 'Hover me'}</Button>\n</Tooltip>`;
};

export const Playground = {
  render: ({ withIcon, iconName, iconVariant, iconFamily, ...args }) => (
    <Tooltip {...args} icon={withIcon ? glyphFor(iconName, ICON_SIZE, iconVariant, iconFamily) : undefined}>
      <Button variant="outline">{args.trigger === 'click' ? 'Click me' : 'Hover me'}</Button>
    </Tooltip>
  ),
  parameters: { docs: { source: { transform: (_code, ctx) => tooltipCode(ctx.args) } } },
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
    const cell = { maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14, padding: '8px 10px', border: '1px solid var(--tesseract-slate-200, #e5e7eb)', borderRadius: 8 };
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

/** Interactive — a hover tooltip you can move into (e.g. to click a link inside).
 *  The pointer can travel from the trigger into the bubble without it closing. */
export const Interactive = {
  render: () => (
    <Tooltip
      interactive
      side="bottom"
      maxWidth={260}
      content={
        <span>
          Dr. Mehta is on leave today.{' '}
          <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }} onClick={(e) => e.preventDefault()}>
            View cover roster
          </a>
        </span>
      }
    >
      <Button variant="outline">Hover, then reach in</Button>
    </Tooltip>
  ),
};

/** Custom arrow — bigger arrow + a custom dismiss glyph. The arrow color tracks
 *  the surface (light here) via a CSS var, so it matches the bubble. */
export const CustomArrow = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Tooltip content="Big arrow on a light surface" variant="light" arrowSize={9} side="bottom">
        <Button variant="outline">Big arrow</Button>
      </Tooltip>
      <Tooltip
        trigger="click"
        dismissible
        side="bottom"
        closeIcon={<TPLibraryIcon name="minus-square" variant="bold" size={14} aria-hidden />}
        content="Custom × glyph (minus-square)"
      >
        <Button variant="tonal">Custom dismiss</Button>
      </Tooltip>
    </div>
  ),
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
