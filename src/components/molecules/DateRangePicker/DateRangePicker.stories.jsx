import React from 'react';
import { DateRangePicker } from './DateRangePicker';

const meta = {
  title: 'Molecules/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs', 'ai-generated'],
};

export default meta;

/** Click the trigger to open the two-month picker with presets. */
export const Playground = {
  render: () => {
    const [value, setValue] = React.useState('till-date');
    return (
      <div style={{ width: 280 }}>
        <DateRangePicker value={value} onChange={(r) => setValue(r.presetId)} />
      </div>
    );
  },
};

/** Pre-selected "Today" preset. */
export const TodayPreset = {
  render: () => {
    const [value, setValue] = React.useState('today');
    return (
      <div style={{ width: 280 }}>
        <DateRangePicker value={value} onChange={(r) => setValue(r.presetId)} />
      </div>
    );
  },
};

/** Past-only presets (future presets hidden). */
export const PastPresetsOnly = {
  render: () => {
    const [value, setValue] = React.useState('past-3-months');
    return (
      <div style={{ width: 280 }}>
        <DateRangePicker value={value} hideFuturePresets onChange={(r) => setValue(r.presetId)} />
      </div>
    );
  },
};

// ── Healthcare in-context demos ────────────────────────────────────────────

const Label = ({ children }) => (
  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#A2A2A8', display: 'block', marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
    {children}
  </span>
);

/** Appointments dashboard filter — shows the picker alongside a label and result count. */
export const AppointmentFilter = {
  name: '📅 Appointments Dashboard Filter',
  render: () => {
    const [value, setValue] = React.useState('today');
    const countMap = { 'today': 18, 'yesterday': 14, 'past-3-months': 312, 'till-date': 1048 };
    const count = countMap[value] ?? '—';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif' }}>
        <Label>Appointments — Date Range</Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <DateRangePicker value={value} hideFuturePresets onChange={(r) => setValue(r.presetId)} />
          <div style={{ fontSize: 14, color: '#717179' }}>
            <span style={{ fontWeight: 700, fontSize: 24, color: '#171725', marginRight: 4 }}>{count}</span>
            appointments
          </div>
        </div>
      </div>
    );
  },
};

/** Revenue analytics — future presets visible for forecasting. */
export const RevenueAnalytics = {
  name: '💰 Revenue Analytics (future presets)',
  render: () => {
    const [value, setValue] = React.useState('past-3-months');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif' }}>
        <Label>Revenue Period</Label>
        <DateRangePicker value={value} onChange={(r) => setValue(r.presetId)} />
        <p style={{ margin: 0, fontSize: 13, color: '#717179' }}>
          Selected preset: <strong>{value || 'custom'}</strong>
        </p>
      </div>
    );
  },
};

/** Follow-up tracker — past only, shows the selected date range in text. */
export const FollowUpTracker = {
  name: '🔄 Follow-up Tracker',
  render: () => {
    const [range, setRange] = React.useState({ presetId: 'past-3-months', start: null, end: null });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif' }}>
        <Label>Follow-up Date Range</Label>
        <DateRangePicker
          value={range.presetId}
          hideFuturePresets
          onChange={(r) => setRange(r)}
        />
        {range.start && (
          <div style={{ fontSize: 13, color: '#454551', background: '#F7F7FB', borderRadius: 8, padding: '10px 14px', border: '1px solid #E2E2EA' }}>
            <strong>Range:</strong>{' '}
            {range.start?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {' '}&rarr;{' '}
            {range.end?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}
      </div>
    );
  },
};

/** Shows two pickers side-by-side — different presets active independently. */
export const SideBySide = {
  name: '↔ Side by Side',
  render: () => {
    const [a, setA] = React.useState('today');
    const [b, setB] = React.useState('past-3-months');
    return (
      <div style={{ display: 'flex', gap: 32, fontFamily: 'Inter, sans-serif' }}>
        <div>
          <Label>Primary period</Label>
          <DateRangePicker value={a} hideFuturePresets onChange={(r) => setA(r.presetId)} />
        </div>
        <div>
          <Label>Compare period</Label>
          <DateRangePicker value={b} hideFuturePresets onChange={(r) => setB(r.presetId)} />
        </div>
      </div>
    );
  },
};
