import { Badge } from './Badge';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const COLORS = ['primary', 'success', 'warning', 'error', 'neutral', 'violet'];
const VARIANTS = ['solid', 'soft', 'outline', 'gradient', 'dot'];
const SIZES = ['xs', 'sm', 'md', 'lg'];
const ICON_SIDES = ['none', 'left', 'right', 'both'];
const ICON_PX = { xs: 10, sm: 12, md: 14, lg: 16 };

// Resolve the icon node for a side, sized to the badge.
const glyphFor = (name, size) => (name ? <TPLibraryIcon name={name} size={ICON_PX[size] || 14} /> : null);

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: COLORS },
    size: { control: 'inline-radio', options: SIZES },
    children: { control: 'text', table: { category: 'Content' } },
    iconSide: { control: 'inline-radio', options: ICON_SIDES, name: 'icon side', table: { category: 'Content' } },
    iconName: { control: 'text', tpIcon: true, name: 'icon', description: 'Pick a TP icon (or type a name)', table: { category: 'Content' } },
    sticky: { control: 'inline-radio', options: ['none', 'left', 'right'], description: 'Square the corners on an edge so it sits flush', table: { category: 'Layout' } },
  },
  args: {
    variant: 'soft',
    color: 'primary',
    size: 'md',
    children: 'Badge',
    iconSide: 'left',
    iconName: 'verify',
    sticky: 'none',
  },
};

export default meta;

// Inject icons from the controls into either/both sides; normalise sticky.
const withIcons = ({ iconSide, iconName, sticky, ...args }) => {
  const glyph = glyphFor(iconName, args.size);
  return {
    ...args,
    sticky: sticky && sticky !== 'none' ? sticky : undefined,
    icon: iconSide === 'left' || iconSide === 'both' ? glyph : undefined,
    rightIcon: iconSide === 'right' || iconSide === 'both' ? glyph : undefined,
  };
};

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {
  render: (args) => <Badge {...withIcons(args)} />,
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

export const Variants = {
  render: (args) => (
    <Row>
      {['solid', 'soft', 'outline'].map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
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
      <div style={{ position: 'relative', width: 120, height: 64, borderRadius: 12, border: '1px solid var(--tp-slate-200, #e2e2ea)', background: 'var(--tp-slate-50, #f8fafc)' }}>
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
          <strong style={{ fontSize: 12, color: 'var(--tp-slate-500, #54545C)' }}>
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
