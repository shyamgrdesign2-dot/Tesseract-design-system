import React from 'react';
import { DateRangePicker } from './DateRangePicker';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'inline-radio', options: ['range', 'single'], description: 'Range (start–end) or a single date', table: { category: 'Type' } },
    months: { control: 'inline-radio', options: [1, 2], description: 'Number of calendars shown (max 2)', table: { category: 'Type' } },
    showPresets: { control: 'boolean', name: 'show presets', description: 'Quick-select preset rail (range only)', table: { category: 'Type' } },
    iconName: { control: 'text', tpIcon: true, name: 'trigger icon', description: 'TP icon shown in the trigger', table: { category: 'Content' } },
    value: { control: false },
    onChange: { control: false },
  },
  args: { mode: 'range', months: 2, showPresets: true, iconName: 'calendar-1' },
};

export default meta;

/** Every type in one place — switch `mode`, `months`, and `show presets` in Controls. */
export const Playground = {
  render: ({ iconName, mode, months, showPresets }) => {
    const [value, setValue] = React.useState('this-month');
    return (
      <div style={{ width: 280 }}>
        <DateRangePicker
          mode={mode}
          months={months}
          showPresets={showPresets}
          value={value}
          onChange={(r) => setValue(r.mode === 'single' ? r.date : r.presetId)}
          icon={iconName ? <TPLibraryIcon name={iconName} size={16} /> : undefined}
        />
      </div>
    );
  },
};

/** Single-date picker — one month, pick one day. */
export const SingleDate = {
  render: () => {
    const [value, setValue] = React.useState(null);
    return (
      <div style={{ width: 280 }}>
        <DateRangePicker mode="single" value={value} onChange={(r) => setValue(r.date)} />
      </div>
    );
  },
};

/** Compact range — a single month, no preset rail. */
export const SingleMonthRange = {
  render: () => {
    const [value, setValue] = React.useState(null);
    return (
      <div style={{ width: 280 }}>
        <DateRangePicker mode="range" months={1} showPresets={false} value={value} onChange={(r) => setValue(r.presetId)} />
      </div>
    );
  },
};

/** Pre-selected preset — clicking a preset jumps the calendar to its range. */
export const PresetSelected = {
  render: () => {
    const [value, setValue] = React.useState('last-month');
    return (
      <div style={{ width: 280 }}>
        <DateRangePicker value={value} onChange={(r) => setValue(r.presetId)} />
      </div>
    );
  },
};

// ── Healthcare in-context demos ────────────────────────────────────────────

const Label = ({ children }) => (
  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#54545C', display: 'block', marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
    {children}
  </span>
);

/** Appointments dashboard filter — picker alongside a label and result count. */
export const AppointmentFilter = {
  name: '📅 Appointments Dashboard Filter',
  render: () => {
    const [value, setValue] = React.useState('today');
    const countMap = { today: 18, yesterday: 14, 'this-week': 96, 'this-month': 312, 'all-time': 1048 };
    const count = countMap[value] ?? '—';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif' }}>
        <Label>Appointments — Date Range</Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <DateRangePicker value={value} onChange={(r) => setValue(r.presetId)} />
          <div style={{ fontSize: 14, color: '#54545C' }}>
            <span style={{ fontWeight: 700, fontSize: 24, color: '#171725', marginRight: 4 }}>{count}</span>
            appointments
          </div>
        </div>
      </div>
    );
  },
};

/** Revenue analytics — shows the selected preset id below. */
export const RevenueAnalytics = {
  name: '💰 Revenue Analytics',
  render: () => {
    const [value, setValue] = React.useState('this-year');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif' }}>
        <Label>Revenue Period</Label>
        <DateRangePicker value={value} onChange={(r) => setValue(r.presetId)} />
        <p style={{ margin: 0, fontSize: 13, color: '#54545C' }}>
          Selected preset: <strong>{value || 'custom'}</strong>
        </p>
      </div>
    );
  },
};

/** Follow-up tracker — shows the selected date range in text. */
export const FollowUpTracker = {
  name: '🔄 Follow-up Tracker',
  render: () => {
    const [range, setRange] = React.useState({ presetId: 'this-month', start: null, end: null });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif' }}>
        <Label>Follow-up Date Range</Label>
        <DateRangePicker value={range.presetId} onChange={(r) => setRange(r)} />
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

/** Two pickers side-by-side — different presets active independently. */
export const SideBySide = {
  name: '↔ Side by Side',
  render: () => {
    const [a, setA] = React.useState('today');
    const [b, setB] = React.useState('last-month');
    return (
      <div style={{ display: 'flex', gap: 32, fontFamily: 'Inter, sans-serif' }}>
        <div>
          <Label>Primary period</Label>
          <DateRangePicker value={a} onChange={(r) => setA(r.presetId)} />
        </div>
        <div>
          <Label>Compare period</Label>
          <DateRangePicker value={b} onChange={(r) => setB(r.presetId)} />
        </div>
      </div>
    );
  },
};
