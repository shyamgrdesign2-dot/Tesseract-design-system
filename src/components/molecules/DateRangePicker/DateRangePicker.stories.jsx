import React from 'react';
import { DatePicker } from './DateRangePicker';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];

// Resolve the trigger icon in the chosen name + style (variant) + family.
const glyphFor = (name, size, variant = 'linear', family) =>
  name ? <TPIcon name={name} variant={variant} family={family || undefined} size={size} /> : undefined;

const meta = {
  title: 'Molecules/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One picker, every mode: **single** date · **range** (1–2 months + quick presets) · **month** · **year** · **time** · **datetime**. Square cells (10px radius), month/year drill-down, min/max + per-day disable, keyboard nav, and a real form field (label · helper · status · size). CTAs compose the Tesseract Button.' } },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range', 'month', 'year', 'time', 'datetime'], table: { category: 'Type' } },
    months: { control: 'inline-radio', options: [1, 2], description: 'Calendars shown (range)', table: { category: 'Type' } },
    showPresets: { control: 'boolean', name: 'show presets', description: 'Quick-select rail (range)', table: { category: 'Type' } },
    use12Hour: { control: 'boolean', name: '12-hour clock', table: { category: 'Type' } },
    minuteStep: { control: 'inline-radio', options: [1, 5, 15, 30], table: { category: 'Type' } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], table: { category: 'Field' } },
    label: { control: 'text', table: { category: 'Field' } },
    helperText: { control: 'text', name: 'helper text', table: { category: 'Field' } },
    status: { control: 'inline-radio', options: [undefined, 'error', 'success', 'warning'], table: { category: 'Field' } },
    required: { control: 'boolean', table: { category: 'Field' } },
    disabled: { control: 'boolean', table: { category: 'Field' } },
    placeholder: { control: 'text', table: { category: 'Field' } },
    iconName: { control: 'text', tpIcon: true, name: 'trigger icon', description: 'CDN icon name for the trigger (blank = default calendar/clock)', table: { category: 'Icons' } },
    iconVariant: { control: 'select', options: ICON_VARIANTS, name: 'icon style', description: 'Icon style applied to the trigger icon', table: { category: 'Icons' } },
    iconFamily: { control: 'text', name: 'icon family', description: 'Override the auto-resolved CDN family (blank = auto)', table: { category: 'Icons' } },
    value: { control: false },
    onChange: { control: false },
  },
  args: { mode: 'single', months: 2, showPresets: true, use12Hour: true, minuteStep: 5, size: 'md', label: '', helperText: '', status: undefined, required: false, disabled: false, iconName: '', iconVariant: 'linear', iconFamily: '' },
};

export default meta;

/** Playground — switch `mode` and every field option in Controls. */
export const Playground = {
  render: ({ iconName, iconVariant, iconFamily, ...args }) => {
    const [value, setValue] = React.useState(null);
    return (
      <div style={{ width: 320 }}>
        <DatePicker
          {...args}
          value={value}
          onChange={(r) => setValue(r.date ?? r.range ?? r)}
          icon={glyphFor(iconName, 16, iconVariant, iconFamily)}
        />
      </div>
    );
  },
};

// ── Core date modes ──────────────────────────────────────────────────────────

/** Single date — one month, pick one day. */
export const SingleDate = {
  render: () => {
    const [v, setV] = React.useState(null);
    return <div style={{ width: 320 }}><DatePicker mode="single" label="Date" value={v} onChange={(r) => setV(r.date)} /></div>;
  },
};

/** Compact single-month range — one calendar, no preset rail. */
export const SingleMonthRange = {
  name: 'Range — single month',
  render: () => {
    const [v, setV] = React.useState(null);
    return <div style={{ width: 320 }}><DatePicker mode="range" months={1} showPresets={false} label="Range" value={v} onChange={(r) => setV(r.range)} /></div>;
  },
};

/** Two-month range with quick-select presets (Today · Past 7 days · This month …). */
export const MultiMonthRange = {
  name: 'Range — two months + presets',
  render: () => {
    const [v, setV] = React.useState('last-7');
    return <div style={{ width: 320 }}><DatePicker mode="range" months={2} value={v} onChange={(r) => setV(r.presetId || r.range)} /></div>;
  },
};

// ── Month · year · time · datetime ───────────────────────────────────────────

/** Month picker — pick a month + year. */
export const MonthPicker = {
  render: () => {
    const [v, setV] = React.useState(null);
    return <div style={{ width: 320 }}><DatePicker mode="month" label="Billing month" value={v} onChange={(r) => setV(r.date)} /></div>;
  },
};

/** Year picker — pick a year from the decade grid. */
export const YearPicker = {
  render: () => {
    const [v, setV] = React.useState(null);
    return <div style={{ width: 320 }}><DatePicker mode="year" label="Financial year" value={v} onChange={(r) => setV(r.year)} /></div>;
  },
};

/** Time picker — hours · minutes · AM/PM. */
export const TimePicker = {
  render: () => {
    const [v, setV] = React.useState(null);
    return <div style={{ width: 320 }}><DatePicker mode="time" label="Appointment time" value={v} onChange={(r) => setV(r.time)} /></div>;
  },
};

/** Date + time — pick a day and a time together. */
export const DateTimePicker = {
  name: 'Date + Time',
  render: () => {
    const [v, setV] = React.useState(null);
    return <div style={{ width: 340 }}><DatePicker mode="datetime" label="Starts at" value={v} onChange={(r) => setV(r.date)} /></div>;
  },
};

// ── Field & behaviour ────────────────────────────────────────────────────────

/** Field chrome — label, helper text, required marker, and an error state. */
export const FieldStates = {
  name: 'Field — label · helper · status',
  render: () => {
    const [a, setA] = React.useState(null);
    const [b, setB] = React.useState(null);
    return (
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', width: 700 }}>
        <div style={{ width: 320 }}><DatePicker mode="single" label="Date of birth" required helperText="Used to verify the patient's age" value={a} onChange={(r) => setA(r.date)} /></div>
        <div style={{ width: 320 }}><DatePicker mode="single" label="Appointment date" status="error" helperText="This date is required" value={b} onChange={(r) => setB(r.date)} /></div>
      </div>
    );
  },
};

/** Sizes — sm · md · lg. */
export const Sizes = {
  render: () => {
    const [v, setV] = React.useState(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
        {['sm', 'md', 'lg'].map((s) => <DatePicker key={s} mode="single" size={s} label={`Size: ${s}`} value={v} onChange={(r) => setV(r.date)} />)}
      </div>
    );
  },
};

/** Constraints — min/max bounds + a per-day disable predicate (weekends off). */
export const Constraints = {
  name: 'Constraints (min/max · disabled days)',
  parameters: { docs: { description: { story: '`minDate` / `maxDate` bound selection (out-of-bounds days, months, and nav arrows disable); `isDateDisabled(date)` disables individual days — here, weekends.' } } },
  render: () => {
    const today = new Date();
    const minD = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxD = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    const [v, setV] = React.useState(null);
    return (
      <div style={{ width: 340 }}>
        <DatePicker mode="single" label="Booking date (this & next month, weekdays only)" helperText="Weekends and out-of-window dates are disabled"
          minDate={minD} maxDate={maxD} isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} value={v} onChange={(r) => setV(r.date)} />
      </div>
    );
  },
};

/** Controlled — the selected value is rendered live below the picker. */
export const Controlled = {
  render: () => {
    const [v, setV] = React.useState(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320, fontFamily: 'Inter, sans-serif' }}>
        <DatePicker mode="single" label="Pick a date" value={v} onChange={(r) => setV(r.date)} />
        <p style={{ margin: 0, fontSize: 13, color: '#54545C' }}>
          Value: <strong style={{ color: '#171725' }}>{v ? v.toDateString() : 'null'}</strong>
        </p>
      </div>
    );
  },
};
