import { Badge } from './Badge';

const COLORS = ['primary', 'success', 'warning', 'error', 'neutral', 'violet'];
const VARIANTS = ['solid', 'soft', 'outline', 'dot'];

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: COLORS },
    children: { control: 'text' },
  },
  args: {
    variant: 'soft',
    color: 'primary',
    children: 'Badge',
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {};

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
          <strong style={{ fontSize: 12, color: 'var(--tp-slate-500, #717179)' }}>
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
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#A2A2A8', marginBottom: 10 }}>Appointment status</div>
        <Row>
          <Badge variant="soft" color="success">Confirmed</Badge>
          <Badge variant="soft" color="warning">Waiting</Badge>
          <Badge variant="soft" color="error">No-show</Badge>
          <Badge variant="soft" color="neutral">Completed</Badge>
          <Badge variant="soft" color="primary">Rescheduled</Badge>
        </Row>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#A2A2A8', marginBottom: 10 }}>Lab result flags</div>
        <Row>
          <Badge variant="solid" color="error">Critical ↑</Badge>
          <Badge variant="solid" color="warning">High</Badge>
          <Badge variant="soft" color="success">Normal</Badge>
          <Badge variant="soft" color="primary">Pending</Badge>
          <Badge variant="outline" color="neutral">Cancelled</Badge>
        </Row>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#A2A2A8', marginBottom: 10 }}>Patient record state</div>
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
