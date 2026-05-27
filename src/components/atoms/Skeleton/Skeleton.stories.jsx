import { Skeleton } from './Skeleton';

const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'circular', 'rectangular'] },
    width: { control: 'text' },
    height: { control: 'text' },
    radius: { control: 'text' },
  },
  args: {
    variant: 'text',
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {
  render: (args) => (
    <div style={{ width: 240 }}>
      <Skeleton {...args} />
    </div>
  ),
};

export const Variants = {
  render: () => (
    <div style={{ width: 240, display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 12, color: 'var(--tp-slate-500, #717179)' }}>text</strong>
        <Skeleton variant="text" />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 12, color: 'var(--tp-slate-500, #717179)' }}>circular</strong>
        <Skeleton variant="circular" />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 12, color: 'var(--tp-slate-500, #717179)' }}>rectangular</strong>
        <Skeleton variant="rectangular" height={80} />
      </div>
    </div>
  ),
};

export const TextLines = {
  render: () => (
    <div style={{ width: 280, display: 'grid', gap: 8 }}>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="75%" />
    </div>
  ),
};

export const Circular = {
  render: () => (
    <Row>
      <Skeleton variant="circular" width={28} />
      <Skeleton variant="circular" width={40} />
      <Skeleton variant="circular" width={56} />
    </Row>
  ),
};

export const CardPlaceholder = {
  render: () => (
    <div
      style={{
        width: 280,
        padding: 16,
        border: '1px solid var(--tp-slate-200, #e2e2ea)',
        borderRadius: 12,
        display: 'grid',
        gap: 12,
      }}
    >
      <Skeleton variant="rectangular" height={120} radius={8} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circular" width={40} />
        <div style={{ flex: 1, display: 'grid', gap: 8 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Patient row loading state — simulates a table body while data fetches. */
export const PatientTableRows = {
  name: '🏥 Patient Table Rows',
  render: () => (
    <div style={{ width: 640, border: '1px solid #E2E2EA', borderRadius: 10, overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'grid', gridTemplateColumns: '40px 200px 1fr 100px 80px', gap: 16, padding: '10px 16px', background: '#F7F7FB', borderBottom: '1px solid #E2E2EA' }}>
        {['', 'Patient', 'Dept / Doctor', 'Status', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 11, fontWeight: 600, color: '#A2A2A8', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>{h}</div>
        ))}
      </div>
      {/* skeleton rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 200px 1fr 100px 80px', gap: 16, padding: '12px 16px', borderBottom: '1px solid #F0F0F6', alignItems: 'center' }}>
          <Skeleton variant="circular" width={32} />
          <div style={{ display: 'grid', gap: 5 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div style={{ display: 'grid', gap: 5 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
          <Skeleton variant="text" width={70} />
          <Skeleton variant="text" width={60} />
        </div>
      ))}
    </div>
  ),
};

/** Patient profile hero — avatar + name + vitals loading state. */
export const PatientProfileHero = {
  name: '👤 Patient Profile Hero',
  render: () => (
    <div style={{ width: 520, padding: 24, border: '1px solid #E2E2EA', borderRadius: 14, background: '#fff', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* header */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Skeleton variant="circular" width={64} />
        <div style={{ flex: 1, display: 'grid', gap: 8 }}>
          <Skeleton variant="text" width="55%" />
          <Skeleton variant="text" width="40%" />
          <div style={{ display: 'flex', gap: 8 }}>
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={80} />
          </div>
        </div>
        <Skeleton variant="rectangular" width={100} height={32} radius={6} />
      </div>
      {/* vitals strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ padding: '12px 10px', border: '1px solid #F0F0F6', borderRadius: 10, display: 'grid', gap: 6 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="40%" />
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Appointment card loading state — 3 upcoming slots. */
export const AppointmentCardList = {
  name: '📅 Appointment Cards Loading',
  render: () => (
    <div style={{ width: 420, display: 'grid', gap: 12 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ padding: 16, border: '1px solid #E2E2EA', borderRadius: 10, display: 'flex', gap: 14, alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={48} height={52} radius={8} />
          <div style={{ flex: 1, display: 'grid', gap: 7 }}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="45%" />
            <Skeleton variant="text" width="55%" />
          </div>
          <Skeleton variant="rectangular" width={64} height={28} radius={6} />
        </div>
      ))}
    </div>
  ),
};
