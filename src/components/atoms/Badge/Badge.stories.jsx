import { Badge } from './Badge';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

const COLORS = ['primary', 'success', 'warning', 'error', 'neutral', 'violet'];
const VARIANTS = ['solid', 'soft', 'outline', 'gradient', 'dot'];
const SIZES = ['xs', 'sm', 'md', 'lg'];
const ICON_PX = { xs: 10, sm: 12, md: 14, lg: 16 };
const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];

// Resolve an icon node for a slot, sized to the badge, in the chosen style + family.
const glyphFor = (name, size, variant = 'linear', family) =>
  name ? <TPIcon name={name} variant={variant} family={family || undefined} size={ICON_PX[size] || 14} /> : undefined;

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: COLORS },
    size: { control: 'inline-radio', options: SIZES },
    children: { control: 'text', name: 'label (text)', description: 'Label — usually data-bound (e.g. a status string from the backend). Omit, or use icons="icon-only", for an icon-only badge.', table: { category: 'Content' } },
    // ── Icons: choose how many / which side, then pick the glyph(s) ──
    icons: { control: 'inline-radio', options: ['none', 'left', 'right', 'both', 'icon-only'], name: 'icons', description: 'Which icon slots to show', table: { category: 'Icons' } },
    leftIcon: { control: 'text', tpIcon: true, name: 'icon', description: 'CDN icon name — the single icon (left / right / icon-only) or the LEFT icon when both', if: { arg: 'icons', neq: 'none' }, table: { category: 'Icons' } },
    rightIcon: { control: 'text', tpIcon: true, name: 'right icon', description: 'The trailing icon name (both mode only)', if: { arg: 'icons', eq: 'both' }, table: { category: 'Icons' } },
    iconVariant: { control: 'select', options: ICON_VARIANTS, name: 'icon style', description: 'Icon style', if: { arg: 'icons', neq: 'none' }, table: { category: 'Icons' } },
    iconFamily: { control: 'text', name: 'icon family', description: 'Override the auto-resolved CDN family (blank = auto)', if: { arg: 'icons', neq: 'none' }, table: { category: 'Icons' } },
    // ── Layout ──
    radius: { control: 'text', name: 'corner radius', description: "px number, or 'pill' / 'sharp'", table: { category: 'Layout' } },
    sticky: { control: 'inline-radio', options: ['none', 'left', 'right'], description: 'Square the corners on an edge so it sits flush', table: { category: 'Layout' } },
  },
  args: {
    variant: 'soft',
    color: 'primary',
    size: 'md',
    children: 'Badge',
    icons: 'left',
    leftIcon: 'verify',
    rightIcon: 'arrow-right',
    iconVariant: 'linear',
    iconFamily: '',
    radius: '',
    sticky: 'none',
  },
};

export default meta;

// A radius control comes in as a string. Coerce a pure-number string to a number;
// pass keywords ("pill"/"sharp") / tokens through; blank → undefined (default look).
const radiusValue = (r) => {
  const s = String(r ?? '').trim();
  if (!s) return undefined;
  return /^-?\d+$/.test(s) ? Number(s) : s;
};

// Map the icon MODE + name(s) + style onto the real icon/rightIcon props, and
// drop the label for an icon-only badge. One field ("icon") serves the single-icon
// modes (left/right/icon-only); the second ("right icon") only applies to "both".
const withIcons = ({ icons, leftIcon, rightIcon, iconVariant, iconFamily, radius, sticky, children, ...args }) => {
  const single = glyphFor(leftIcon, args.size, iconVariant, iconFamily);
  const trailing = glyphFor(rightIcon, args.size, iconVariant, iconFamily);
  return {
    ...args,
    radius: radiusValue(radius),
    sticky: sticky && sticky !== 'none' ? sticky : undefined,
    icon: icons === 'left' || icons === 'both' || icons === 'icon-only' ? single : undefined,
    rightIcon: icons === 'right' ? single : icons === 'both' ? trailing : undefined,
    children: icons === 'icon-only' ? undefined : children,
  };
};

// Build an accurate, copy-paste code snippet from the controls (what "Show code" shows).
const iconJsx = (name, variant, family) =>
  `<TPIcon name="${name}"${variant && variant !== 'linear' ? ` variant="${variant}"` : ''}${family ? ` family="${family}"` : ''} size={14} />`;

const badgeCode = ({ variant = 'soft', color = 'primary', size = 'md', children = '', sticky, radius, icons = 'none', leftIcon, rightIcon, iconVariant, iconFamily }) => {
  const leftName = icons === 'left' || icons === 'both' || icons === 'icon-only' ? leftIcon : '';
  const rightName = icons === 'right' ? leftIcon : icons === 'both' ? rightIcon : '';
  const lines = [`  variant="${variant}"`, `  color="${color}"`, `  size="${size}"`];
  const rv = radiusValue(radius);
  if (rv != null) lines.push(typeof rv === 'number' ? `  radius={${rv}}` : `  radius="${rv}"`);
  if (sticky && sticky !== 'none') lines.push(`  sticky="${sticky}"`);
  if (leftName) lines.push(`  icon={${iconJsx(leftName, iconVariant, iconFamily)}}`);
  if (rightName) lines.push(`  rightIcon={${iconJsx(rightName, iconVariant, iconFamily)}}`);
  const body = icons === 'icon-only' ? '' : children;
  if (variant === 'dot' || !body) return `<Badge\n${lines.join('\n')}\n/>`;
  return `<Badge\n${lines.join('\n')}\n>\n  ${body}\n</Badge>`;
};

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {
  render: (args) => <Badge {...withIcons(args)} />,
  parameters: { docs: { source: { transform: (_code, ctx) => badgeCode(ctx.args) } } },
};

/** Leading / trailing icons — they inherit the badge color via currentColor. */
export const WithIcons = {
  render: (args) => (
    <Row>
      <Badge {...args} color="success" icon={glyphFor('tick-circle', args.size)}>Verified</Badge>
      <Badge {...args} color="warning" icon={glyphFor('clock-2', args.size)}>Pending</Badge>
      <Badge {...args} color="error" icon={glyphFor('close-circle', args.size)}>Failed</Badge>
      <Badge {...args} color="primary" rightIcon={glyphFor('arrow-right-01', args.size)}>Next</Badge>
      <Badge {...args} variant="outline" color="violet" icon={glyphFor('star', args.size)} rightIcon={glyphFor('star', args.size)}>VIP</Badge>
    </Row>
  ),
};

export const Sizes = {
  render: (args) => (
    <Row>
      {SIZES.map((size) => (
        <Badge key={size} {...args} size={size}>{size.toUpperCase()}</Badge>
      ))}
    </Row>
  ),
};

/** All five variants — solid · soft · outline · gradient · dot. */
export const Variants = {
  render: () => (
    <Row>
      <Badge variant="solid" color="primary">solid</Badge>
      <Badge variant="soft" color="primary">soft</Badge>
      <Badge variant="outline" color="primary">outline</Badge>
      <Badge variant="gradient" color="primary">gradient</Badge>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--tesseract-slate-500,#717179)' }}>
        <Badge variant="dot" color="primary" /> dot
      </span>
    </Row>
  ),
};

/** Gradient variant — white text on a color ramp (red / green / orange / brand). */
export const Gradients = {
  render: (args) => (
    <Row>
      <Badge {...args} variant="gradient" color="warning">Trial</Badge>
      <Badge {...args} variant="gradient" color="error">Expired</Badge>
      <Badge {...args} variant="gradient" color="success">New</Badge>
      <Badge {...args} variant="gradient" color="primary">Pro</Badge>
      <Badge {...args} variant="gradient" color="violet">VIP</Badge>
    </Row>
  ),
};

/** Sticky badges — corners on the stuck edge are squared so the pill sits flush
 *  against a container edge (e.g. the Trial tag pinned to a nav item). */
export const Sticky = {
  render: () => {
    const Box = ({ children }) => (
      <div style={{ position: 'relative', width: 120, height: 64, borderRadius: 12, border: '1px solid var(--tesseract-slate-200, #e2e2ea)', background: 'var(--tesseract-slate-50, #FAFAFB)' }}>
        {children}
      </div>
    );
    return (
      <Row>
        <Box>
          <span style={{ position: 'absolute', top: 12, right: 0 }}>
            <Badge variant="gradient" color="warning" size="sm" sticky="right">Trial</Badge>
          </span>
        </Box>
        <Box>
          <span style={{ position: 'absolute', top: 12, left: 0 }}>
            <Badge variant="gradient" color="success" size="sm" sticky="left">New</Badge>
          </span>
        </Box>
        <Box>
          <span style={{ position: 'absolute', top: 12, right: 0 }}>
            <Badge variant="solid" color="error" size="sm" sticky="right">3</Badge>
          </span>
        </Box>
      </Row>
    );
  },
};

export const Colors = {
  render: (args) => (
    <Row>
      {COLORS.map((color) => (
        <Badge key={color} {...args} color={color}>
          {color}
        </Badge>
      ))}
    </Row>
  ),
};

export const Dot = {
  args: { variant: 'dot' },
  render: (args) => (
    <Row>
      {COLORS.map((color) => (
        <Badge key={color} {...args} color={color} />
      ))}
    </Row>
  ),
};

export const Counts = {
  render: (args) => (
    <Row>
      <Badge {...args} variant="solid">1</Badge>
      <Badge {...args} variant="solid">12</Badge>
      <Badge {...args} variant="solid">99+</Badge>
    </Row>
  ),
};

export const Matrix = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {['solid', 'soft', 'outline'].map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 8 }}>
          <strong style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #717179)' }}>
            {variant}
          </strong>
          <Row>
            {COLORS.map((color) => (
              <Badge key={color} variant={variant} color={color}>
                {color}
              </Badge>
            ))}
          </Row>
        </div>
      ))}
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Status badges used in a patient list — each colour maps to a clinical state. */
export const PatientStatusBadges = {
  name: '🏥 Patient Status Badges',
  render: () => (
    <div style={{ fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#54545C', marginBottom: 10 }}>Appointment status</div>
        <Row>
          <Badge variant="soft" color="success">Confirmed</Badge>
          <Badge variant="soft" color="warning">Waiting</Badge>
          <Badge variant="soft" color="error">No-show</Badge>
          <Badge variant="soft" color="neutral">Completed</Badge>
          <Badge variant="soft" color="primary">Rescheduled</Badge>
        </Row>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#54545C', marginBottom: 10 }}>Lab result flags</div>
        <Row>
          <Badge variant="solid" color="error">Critical ↑</Badge>
          <Badge variant="solid" color="warning">High</Badge>
          <Badge variant="soft" color="success">Normal</Badge>
          <Badge variant="soft" color="primary">Pending</Badge>
          <Badge variant="outline" color="neutral">Cancelled</Badge>
        </Row>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#54545C', marginBottom: 10 }}>Patient record state</div>
        <Row>
          <Badge variant="soft" color="success">Active</Badge>
          <Badge variant="soft" color="neutral">Discharged</Badge>
          <Badge variant="outline" color="warning">Follow-up due</Badge>
          <Badge variant="solid" color="error">Deceased</Badge>
          <Badge variant="soft" color="violet">VIP</Badge>
        </Row>
      </div>
    </div>
  ),
};

/** Notification count badges overlaid on sidebar nav icons. */
export const NotificationCounts = {
  name: '🔔 Notification Counts',
  render: () => {
    const navItem = (label, count, color = 'error') => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: '#F7F7FB', border: '1px solid #E2E2EA', fontFamily: 'Inter, sans-serif', minWidth: 200 }}>
        <span style={{ fontSize: 14, color: '#454551' }}>{label}</span>
        {count > 0 && <Badge variant="solid" color={color}>{count > 99 ? '99+' : count}</Badge>}
      </div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {navItem('Appointments', 12)}
        {navItem('Lab results', 3, 'warning')}
        {navItem('Prescriptions', 0)}
        {navItem('Messages', 7, 'primary')}
        {navItem('Critical alerts', 1, 'error')}
      </div>
    );
  },
};
