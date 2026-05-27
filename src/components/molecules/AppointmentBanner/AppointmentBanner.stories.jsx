import { AppointmentBanner } from './AppointmentBanner';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/AppointmentBanner',
  component: AppointmentBanner,
  tags: ['autodocs', 'ai-generated'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    title: { control: 'text' },
  },
  args: {
    title: 'Appointments',
  },
};

export default meta;

export const Playground = {
  render: (args) => <AppointmentBanner {...args} />,
};

export const WithActions = {
  render: (args) => (
    <AppointmentBanner
      {...args}
      title="Appointments"
      actions={
        <>
          <Button size="sm" variant="ghost" surface="dark">
            Filter
          </Button>
          <Button size="sm" surface="dark">
            New appointment
          </Button>
        </>
      }
    />
  ),
};

export const LongTitle = {
  render: (args) => (
    <AppointmentBanner
      {...args}
      title="Today's Outpatient Cardiology Appointments Overview"
    />
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

import React from 'react';

/** Patient detail page hero — banner with back button and patient name. */
export const PatientDetailHero = {
  name: '👤 Patient Detail Hero',
  render: () => (
    <AppointmentBanner
      title="Rohan Sharma"
      backButton={
        <button
          aria-label="Back"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.12)', cursor: 'pointer', color: '#fff', marginRight: 4 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </button>
      }
      actions={
        <>
          <Button size="sm" variant="outline" surface="dark">Edit</Button>
          <Button size="sm" surface="dark">Book appointment</Button>
        </>
      }
    />
  ),
};

/** Appointments list page banner with filter and new appointment CTA. */
export const AppointmentsListBanner = {
  name: '📅 Appointments List',
  render: () => {
    const [tab, setTab] = React.useState('today');
    return (
      <div>
        <AppointmentBanner
          title="Appointments"
          actions={
            <>
              <Button size="sm" variant="ghost" surface="dark">Export</Button>
              <Button size="sm" surface="dark">New appointment</Button>
            </>
          }
        />
        <div style={{ padding: '0 24px', display: 'flex', gap: 0, borderBottom: '1px solid #E2E2EA', background: '#fff' }}>
          {['today', 'upcoming', 'past'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: tab === t ? 600 : 400,
                color: tab === t ? '#4B4AD5' : '#54545C',
                borderBottom: tab === t ? '2px solid #4B4AD5' : '2px solid transparent',
                fontFamily: 'Inter, sans-serif', textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

/** Analytics dashboard header with date and export actions. */
export const AnalyticsDashboardBanner = {
  name: '📊 Analytics Dashboard',
  render: () => (
    <AppointmentBanner
      title="Revenue Analytics"
      actions={
        <>
          <Button size="sm" variant="ghost" surface="dark">This month</Button>
          <Button size="sm" variant="outline" surface="dark">Download report</Button>
        </>
      }
    />
  ),
};
