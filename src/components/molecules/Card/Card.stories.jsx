import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    hoverable: { control: 'boolean' },
  },
  args: {
    padding: 'md',
    hoverable: false,
  },
};

export default meta;

export const Playground = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <p style={{ margin: 0, fontWeight: 600 }}>Appointment summary</p>
      <p style={{ margin: '6px 0 0', color: 'var(--tp-slate-500, #54545C)' }}>
        Dr. Mehta · 10:30 AM · Cardiology
      </p>
    </Card>
  ),
};

export const Paddings = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {['none', 'sm', 'md', 'lg'].map((padding) => (
        <Card key={padding} {...args} padding={padding} style={{ width: 200 }}>
          <strong>{padding}</strong>
          <p style={{ margin: '6px 0 0' }}>Card body content.</p>
        </Card>
      ))}
    </div>
  ),
};

export const Hoverable = {
  args: { hoverable: true },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 320 }}>
      <p style={{ margin: 0 }}>Hover over me — the surface lifts slightly.</p>
    </Card>
  ),
};

export const Composed = {
  render: () => (
    <Card padding="none" style={{ maxWidth: 380 }}>
      <CardHeader>
        <strong>Patient details</strong>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0 }}>Anita Sharma, 42</p>
        <p style={{ margin: '6px 0 0', color: 'var(--tp-slate-500, #54545C)' }}>
          Last visit: 12 May 2026
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">
          View
        </Button>
        <Button size="sm">Schedule</Button>
      </CardFooter>
    </Card>
  ),
};

/** Hoverable patient summary card with avatar, status chip, and action buttons. */
export const PatientCard = {
  render: () => (
    <Card hoverable padding="none" style={{ width: 320 }}>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          {/* Avatar */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--tp-blue-100, #DBEAFE)',
              color: 'var(--tp-blue-700, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            RS
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--tp-slate-900, #18181B)' }}>
              Rohan Sharma
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--tp-slate-500, #54545C)' }}>
              Age 38 · Blood Group B+
            </p>
          </div>
          {/* Status chip */}
          <span
            style={{
              background: '#DCFCE7',
              color: '#15803D',
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
            }}
          >
            Active
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--tp-slate-400, #A1A1AA)' }}>
          Last visit: 14 May 2026
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">View</Button>
        <Button size="sm">Schedule</Button>
      </CardFooter>
    </Card>
  ),
};

/** 2×2 grid of clinic metric cards with trend indicators. */
export const StatsGrid = {
  render: () => {
    const stats = [
      { label: 'Total Patients', value: '248', trend: '+12 this month', up: true },
      { label: "Today's Appointments", value: '18', trend: '3 pending', up: null },
      { label: 'Revenue', value: '₹1,24,500', trend: 'this month', up: null },
      { label: 'Avg Consultation', value: '14.2 min', trend: '−2.1 from last week', up: false },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 520 }}>
        {stats.map((s) => (
          <Card key={s.label} padding="md">
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--tp-slate-400, #A1A1AA)',
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                margin: '6px 0 4px',
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--tp-slate-900, #18181B)',
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color:
                  s.up === true
                    ? '#15803D'
                    : s.up === false
                    ? '#B91C1C'
                    : 'var(--tp-slate-500, #54545C)',
                fontWeight: 500,
              }}
            >
              {s.up === true && '↑ '}
              {s.up === false && '↓ '}
              {s.trend}
            </p>
          </Card>
        ))}
      </div>
    );
  },
};

/** Appointment details card with doctor info and call/reschedule actions. */
export const AppointmentCard = {
  render: () => (
    <Card padding="none" style={{ width: 380 }}>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          {/* Doctor avatar */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--tp-purple-100, #EDE9FE)',
              color: 'var(--tp-purple-700, #6D28D9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            AM
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--tp-slate-900, #18181B)' }}>
              Dr. Ananya Mehta
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--tp-slate-500, #54545C)' }}>
              Cardiologist
            </p>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px 0',
            fontSize: 13,
          }}
        >
          <span style={{ color: 'var(--tp-slate-400, #A1A1AA)' }}>Time</span>
          <span style={{ fontWeight: 600, color: 'var(--tp-slate-800, #27272A)' }}>10:30 AM</span>
          <span style={{ color: 'var(--tp-slate-400, #A1A1AA)' }}>Date</span>
          <span style={{ fontWeight: 600, color: 'var(--tp-slate-800, #27272A)' }}>27 May 2026</span>
          <span style={{ color: 'var(--tp-slate-400, #A1A1AA)' }}>Room</span>
          <span style={{ fontWeight: 600, color: 'var(--tp-slate-800, #27272A)' }}>OPD-3</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">Reschedule</Button>
        <Button size="sm">Join Call</Button>
      </CardFooter>
    </Card>
  ),
};

/** AI-tonal card with diagnosis summary and analysis link. */
export const ActionCard = {
  render: () => (
    <Card
      padding="md"
      style={{
        width: 340,
        background: '#EEEEFF',
        border: '1px solid #C7C6FF',
      }}
    >
      {/* AI chip */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: '#C7C6FF',
          color: '#4338CA',
          fontSize: 11,
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 4,
          marginBottom: 10,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {/* Sparkle icon inline SVG */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
          <path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z" />
          <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z" />
        </svg>
        AI Summary
      </span>
      <p
        style={{
          margin: '0 0 12px',
          fontSize: 14,
          lineHeight: 1.6,
          color: '#3730A3',
          fontWeight: 500,
        }}
      >
        Patient presents with mild hypertension (Stage 1) and elevated LDL. Recommend lifestyle
        modification and follow-up in 4 weeks. No acute cardiac risk indicators noted.
      </p>
      <button
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          fontSize: 13,
          color: '#4338CA',
          fontWeight: 600,
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
        }}
      >
        View full analysis →
      </button>
    </Card>
  ),
};
