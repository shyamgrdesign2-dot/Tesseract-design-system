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
    docs: { description: { component: [
      'One date/time field that covers every mode: single date, range (1–2 months + presets), month, year, time, and datetime.',
      '',
      '**When to use** — picking a date of birth, appointment slot, billing month, or a reporting range. The `range` mode replaces a pair of separate from/to fields.',
      '**When not** — for a free-typed value or a non-date field, use `InputBox`.',
      '',
      '**Key props** — `mode` selects the calendar (`single` · `range` · `month` · `year` · `time` · `datetime`); `value` + `onChange` make it controlled (the change payload carries `date` / `range` / `time` / `year` / `presetId` per mode); `months` + `showPresets` shape the range UI; `minDate` / `maxDate` / `isDateDisabled` bound selection; `locale` + `weekStartsOn` localize formatting and the week start; `commitMode` (`outside-click` vs `apply`) decides when a selection commits.',
      '',
      '**Good to know** — cells are keyboard-navigable and out-of-bounds days/arrows disable themselves. Footer labels (`applyLabel` / `cancelLabel` / `clearLabel`) are overridable for non-English UIs; `showFooter={false}` drops the footer. Footer CTAs compose the Tesseract Button.',
    ].join('\n') } },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range', 'month', 'year', 'time', 'datetime'], description: 'Which calendar to render — single date, range, month, year, time, or datetime', table: { category: 'Type' } },
    months: { control: 'inline-radio', options: [1, 2], description: 'Calendars shown (range)', table: { category: 'Type' } },
    showPresets: { control: 'boolean', name: 'show presets', description: 'Quick-select rail (range)', table: { category: 'Type' } },
    use12Hour: { control: 'boolean', name: '12-hour clock', table: { category: 'Type' } },
    minuteStep: { control: 'inline-radio', options: [1, 5, 15, 30], table: { category: 'Type' } },
    // ── i18n + behaviour ──
    locale: { control: 'text', description: 'BCP-47 locale for date formatting (e.g. en-IN, en-US, fr-FR)', table: { category: 'Localization' } },
    weekStartsOn: { control: 'inline-radio', options: [0, 1], name: 'week starts on', description: '0 = Sunday · 1 = Monday', table: { category: 'Localization' } },
    applyLabel: { control: 'text', name: 'apply label', table: { category: 'Footer' } },
    cancelLabel: { control: 'text', name: 'cancel label', table: { category: 'Footer' } },
    clearLabel: { control: 'text', name: 'clear label', table: { category: 'Footer' } },
    showFooter: { control: 'boolean', name: 'show footer', description: 'Show the Clear · Cancel · Apply footer', table: { category: 'Footer' } },
    commitMode: { control: 'inline-radio', options: ['outside-click', 'apply'], name: 'commit mode', description: 'When the selection commits', table: { category: 'Footer' } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], description: 'Field height — sm · md · lg', table: { category: 'Field' } },
    fullWidth: { control: 'boolean', name: 'full width', description: 'Stretch the field to fill its container (vs shrink to content)', table: { category: 'Field' } },
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
  args: { mode: 'single', months: 2, showPresets: true, use12Hour: true, minuteStep: 5, size: 'md', fullWidth: true, label: '', helperText: '', status: undefined, required: false, disabled: false, iconName: '', iconVariant: 'linear', iconFamily: '', locale: 'en-IN', weekStartsOn: 1, applyLabel: 'Apply', cancelLabel: 'Cancel', clearLabel: 'Clear', showFooter: true, commitMode: 'outside-click' },
};

export default meta;

// Build an accurate copy-paste snippet from the Playground controls (Show code).
// Only non-default props are emitted so the snippet stays minimal.
const datePickerCode = ({
  mode = 'single', months = 2, showPresets = true, use12Hour = true, minuteStep = 5,
  size = 'md', fullWidth = true, label, helperText, status, required, disabled, placeholder,
  locale = 'en-IN', weekStartsOn = 1,
  applyLabel = 'Apply', cancelLabel = 'Cancel', clearLabel = 'Clear', showFooter = true,
  commitMode = 'outside-click',
  iconName, iconVariant, iconFamily,
}) => {
  const lines = [`  mode="${mode}"`];
  if (mode === 'range' && months !== 2) lines.push(`  months={${months}}`);
  if (mode === 'range' && showPresets === false) lines.push('  showPresets={false}');
  if ((mode === 'time' || mode === 'datetime') && !use12Hour) lines.push('  use12Hour={false}');
  if ((mode === 'time' || mode === 'datetime') && minuteStep !== 5) lines.push(`  minuteStep={${minuteStep}}`);
  if (size !== 'md') lines.push(`  size="${size}"`);
  if (fullWidth === false) lines.push('  fullWidth={false}');
  if (label) lines.push(`  label="${label}"`);
  if (helperText) lines.push(`  helperText="${helperText}"`);
  if (status) lines.push(`  status="${status}"`);
  if (required) lines.push('  required');
  if (disabled) lines.push('  disabled');
  if (placeholder) lines.push(`  placeholder="${placeholder}"`);
  if (locale && locale !== 'en-IN') lines.push(`  locale="${locale}"`);
  if (weekStartsOn !== 1) lines.push(`  weekStartsOn={${weekStartsOn}}`);
  if (applyLabel && applyLabel !== 'Apply') lines.push(`  applyLabel="${applyLabel}"`);
  if (cancelLabel && cancelLabel !== 'Cancel') lines.push(`  cancelLabel="${cancelLabel}"`);
  if (clearLabel && clearLabel !== 'Clear') lines.push(`  clearLabel="${clearLabel}"`);
  if (showFooter === false) lines.push('  showFooter={false}');
  if (commitMode && commitMode !== 'outside-click') lines.push(`  commitMode="${commitMode}"`);
  if (iconName) lines.push(`  icon={<TPIcon name="${iconName}"${iconVariant && iconVariant !== 'linear' ? ` variant="${iconVariant}"` : ''}${iconFamily ? ` family="${iconFamily}"` : ''} size={16} />}`);
  lines.push('  value={value}', '  onChange={handleChange}');
  return `<DatePicker\n${lines.join('\n')}\n/>`;
};

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
  parameters: { docs: { source: { transform: (_code, ctx) => datePickerCode(ctx.args) } } },
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

// ── Localization & footer ────────────────────────────────────────────────────

/** Sunday-start week — `weekStartsOn={0}` reorders the weekday header and the
 *  day-grid offset (US convention). Paired here with the `en-US` locale. */
export const SundayStart = {
  name: 'Week starts on Sunday',
  parameters: { docs: { description: { story: '`weekStartsOn={0}` puts Sunday first (header + grid offset). Default is `1` (Monday). Combined with `locale="en-US"` for US-style month/day formatting.' } } },
  render: () => {
    const [v, setV] = React.useState(null);
    return <div style={{ width: 320 }}><DatePicker mode="single" weekStartsOn={0} locale="en-US" label="Date (US)" value={v} onChange={(r) => setV(r.date)} /></div>;
  },
};

/** Relabeled footer — override the footer button labels (and the picker can be
 *  driven in any language via `locale`). Here: French labels + `fr-FR` locale. */
export const RelabeledFooter = {
  name: 'Relabeled footer + locale',
  parameters: { docs: { description: { story: 'Footer buttons are relabeled via `applyLabel` / `cancelLabel` / `clearLabel`; `locale="fr-FR"` localizes the rendered dates. Set `showFooter={false}` to hide the footer entirely.' } } },
  render: () => {
    const [v, setV] = React.useState(null);
    return (
      <div style={{ width: 320 }}>
        <DatePicker mode="range" months={1} showPresets={false} locale="fr-FR"
          applyLabel="Appliquer" cancelLabel="Annuler" clearLabel="Effacer"
          label="Période" value={v} onChange={(r) => setV(r.range)} />
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
