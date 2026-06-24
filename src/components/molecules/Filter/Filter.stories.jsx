import React from 'react';
import { Filter } from './Filter';
import { DataTable, DataCell } from '@/src/components/molecules/DataTable';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/Filter',
  component: Filter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A single "Filter" entry point that opens one panel with grouped, multi-select sections (Status · Doctors · Types). Chosen options become removable chips below. The section set changes per table — pass a different `groups` config. Pairs with DataTable to filter rows.' } },
  },
  argTypes: {
    groups: { control: 'object', description: 'Filter sections: [{ id, label, type?, options: [{ value, label }] }] — type "multi" (default) | "single"' },
    label: { control: 'text', description: 'Trigger label' },
    triggerIcon: { control: 'text', tpIcon: true, name: 'trigger icon', description: 'Tesseract icon on the Filter trigger (defaults to a funnel)' },
    mode: { control: 'inline-radio', options: ['live', 'apply'], description: 'live = immediate onChange · apply = stage a draft, fire on Done', table: { category: 'Behavior' } },
    clearLabel: { control: 'text', name: 'clear label', description: 'Reset button label (footer + active bar)', table: { category: 'Labels' } },
    doneLabel: { control: 'text', name: 'done label', description: 'Footer confirm button label', table: { category: 'Labels' } },
    width: { control: 'text', description: 'Panel width (CSS length, e.g. 320px). Blank = default (240px min-width).', table: { category: 'Layout' } },
    maxHeight: { control: 'text', name: 'max height', description: 'Panel max height (CSS length). Blank = default 360px.', table: { category: 'Layout' } },
  },
  args: { mode: 'live', clearLabel: 'Clear all', doneLabel: 'Done', width: '', maxHeight: '' },
};

export default meta;

// Build an accurate, copy-paste snippet from the controls (what "Show code" shows).
const filterCode = ({ label = 'Filter', mode = 'live', clearLabel = 'Clear all', doneLabel = 'Done', width, maxHeight, triggerIcon } = {}) => {
  const lines = ['  groups={GROUPS}', '  value={value}', '  onChange={setValue}'];
  if (label && label !== 'Filter') lines.push(`  label="${label}"`);
  if (triggerIcon) lines.push(`  icon={<TPLibraryIcon name="${triggerIcon}" size={16} />}`);
  if (mode && mode !== 'live') lines.push(`  mode="${mode}"`);
  if (clearLabel && clearLabel !== 'Clear all') lines.push(`  clearLabel="${clearLabel}"`);
  if (doneLabel && doneLabel !== 'Done') lines.push(`  doneLabel="${doneLabel}"`);
  if (width) lines.push(`  width="${width}"`);
  if (maxHeight) lines.push(`  maxHeight="${maxHeight}"`);
  return `<Filter\n${lines.join('\n')}\n/>`;
};

const GROUPS = [
  { id: 'status', label: 'Status', options: [
    { value: 'Confirmed', label: 'Confirmed' }, { value: 'Waiting', label: 'Waiting' },
    { value: 'No-show', label: 'No-show' }, { value: 'Completed', label: 'Completed' },
  ] },
  { id: 'doctor', label: 'Doctor', options: [
    { value: 'Dr. Mehra', label: 'Dr. Mehra' }, { value: 'Dr. Sharma', label: 'Dr. Sharma' },
    { value: 'Dr. Kapoor', label: 'Dr. Kapoor' }, { value: 'Dr. Gupta', label: 'Dr. Gupta' },
  ] },
  { id: 'type', label: 'Type', options: [
    { value: 'Follow-up', label: 'Follow-up' }, { value: 'Consultation', label: 'Consultation' },
    { value: 'New Patient', label: 'New Patient' }, { value: 'Lab Review', label: 'Lab Review' },
  ] },
];

export const Playground = {
  args: { groups: GROUPS, label: 'Filter', triggerIcon: '' },
  parameters: { docs: { source: { transform: (_code, ctx) => filterCode(ctx.args) } } },
  render: ({ groups, label, triggerIcon, mode, clearLabel, doneLabel, width, maxHeight }) => {
    const [value, setValue] = React.useState({ status: ['Waiting'] });
    return (
      <div style={{ maxWidth: 720 }}>
        <Filter
          groups={groups}
          label={label}
          icon={triggerIcon ? <TPLibraryIcon name={triggerIcon} size={16} /> : undefined}
          mode={mode}
          clearLabel={clearLabel}
          doneLabel={doneLabel}
          width={width || undefined}
          maxHeight={maxHeight || undefined}
          value={value}
          onChange={setValue}
        />
        <pre style={{ marginTop: "var(--tesseract-space-4)", fontSize: "var(--tesseract-text-body-xs)", color: 'var(--tesseract-slate-500, #717179)' }}>{JSON.stringify(value, null, 2)}</pre>
      </div>
    );
  },
};

// ── Single-select section — "type: single" turns a section into radio behavior ──
const SINGLE_GROUPS = [
  { id: 'view', label: 'View', type: 'single', options: [
    { value: 'All', label: 'All appointments' }, { value: 'Mine', label: 'My appointments' },
    { value: 'Unassigned', label: 'Unassigned' },
  ] },
  { id: 'status', label: 'Status', options: [
    { value: 'Confirmed', label: 'Confirmed' }, { value: 'Waiting', label: 'Waiting' },
    { value: 'No-show', label: 'No-show' }, { value: 'Completed', label: 'Completed' },
  ] },
  { id: 'doctor', label: 'Doctor', options: [
    { value: 'Dr. Mehra', label: 'Dr. Mehra' }, { value: 'Dr. Sharma', label: 'Dr. Sharma' },
    { value: 'Dr. Kapoor', label: 'Dr. Kapoor' }, { value: 'Dr. Gupta', label: 'Dr. Gupta' },
  ] },
];

/** A single-select section ("View" = radio, one value) above multi-select sections. */
export const SingleSelectSection = {
  name: 'Single-select section',
  args: { groups: SINGLE_GROUPS, label: 'Filter' },
  render: ({ groups, label }) => {
    const [value, setValue] = React.useState({ view: ['All'] });
    return (
      <div style={{ maxWidth: 720 }}>
        <Filter groups={groups} label={label} value={value} onChange={setValue} />
        <pre style={{ marginTop: "var(--tesseract-space-4)", fontSize: "var(--tesseract-text-body-xs)", color: 'var(--tesseract-slate-500, #717179)' }}>{JSON.stringify(value, null, 2)}</pre>
      </div>
    );
  },
};

/** Apply mode — toggling stages a draft; onChange only fires on "Apply". */
export const ApplyMode = {
  name: 'Apply mode (staged)',
  render: () => {
    const [value, setValue] = React.useState({ status: ['Waiting'] });
    return (
      <div style={{ maxWidth: 720 }}>
        <Filter groups={GROUPS} mode="apply" doneLabel="Apply" value={value} onChange={setValue} />
        <pre style={{ marginTop: "var(--tesseract-space-4)", fontSize: "var(--tesseract-text-body-xs)", color: 'var(--tesseract-slate-500, #717179)' }}>{JSON.stringify(value, null, 2)}</pre>
      </div>
    );
  },
};

// ── Filter + DataTable — selection filters the rows ───────────────────────────
const DOCTORS = ['Dr. Mehra', 'Dr. Sharma', 'Dr. Kapoor', 'Dr. Gupta'];
const TYPES = ['Follow-up', 'Consultation', 'New Patient', 'Lab Review'];
const STATUSES = ['Confirmed', 'Waiting', 'No-show', 'Completed'];
const NAMES = ['Aarav Sharma', 'Diya Patel', 'Vihaan Reddy', 'Ananya Singh', 'Rohan Mehta', 'Priya Nair', 'Arjun Verma', 'Kavya Iyer', 'Siddharth Rao', 'Meera Joshi', 'Kabir Khanna', 'Ishita Bose'];
const DATA = NAMES.map((name, i) => ({
  id: `r${i}`, name, initials: name.split(' ').map((w) => w[0]).join(''),
  mrn: `MRN-${10231 + i}`, doctor: DOCTORS[i % 4], type: TYPES[i % 4], status: STATUSES[i % 4],
  appt: `Today, ${String(((9 + i) % 12) || 12).padStart(2, '0')}:${i % 2 ? '30' : '00'} ${9 + i < 12 ? 'AM' : 'PM'}`,
}));

const STATUS_TONE = { Confirmed: ['--tesseract-success-50', '--tesseract-success-700'], Waiting: ['--tesseract-warning-50', '--tesseract-warning-700'], 'No-show': ['--tesseract-error-50', '--tesseract-error-700'], Completed: ['--tesseract-slate-100', '--tesseract-slate-600'] };
const Pill = ({ status }) => {
  const [bg, fg] = STATUS_TONE[status];
  return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: "var(--tesseract-text-body-xs)", fontWeight: "var(--tesseract-weight-semibold)", background: `var(${bg})`, color: `var(${fg})` }}>{status}</span>;
};

export const WithDataTable = {
  name: 'Filter + DataTable',
  render: () => {
    const [sel, setSel] = React.useState({});
    const matches = (row) =>
      GROUPS.every((g) => {
        const picked = sel[g.id] || [];
        return picked.length === 0 || picked.includes(row[g.id]);
      });
    const rows = DATA.filter(matches);
    const columns = [
      { id: 'patient', header: 'Patient', minWidth: 200, cell: (r) => <DataCell primary={r.name} secondary={r.mrn} /> },
      { id: 'appt', header: 'Appointment', minWidth: 180, cell: (r) => <DataCell primary={r.appt} primaryLeftIcon={<TPIcon name="calendar" size={16} />} /> },
      { id: 'doctor', header: 'Doctor', minWidth: 150, cell: (r) => <DataCell primary={r.doctor} primaryLeftIcon={<TPIcon name="profile" variant="bulk" size={18} />} /> },
      { id: 'status', header: 'Status', minWidth: 120, cell: (r) => <Pill status={r.status} /> },
    ];
    return (
      <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: "var(--tesseract-space-3-5)" }}>
        <Filter groups={GROUPS} value={sel} onChange={setSel} />
        <DataTable columns={columns} data={rows} pageSize={6} zebra emptyState="No rows match the selected filters." />
      </div>
    );
  },
};
