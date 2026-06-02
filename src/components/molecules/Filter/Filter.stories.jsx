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
    docs: { description: { component: 'Chip-based multi-select filter bar. Each group is a dropdown; chosen options become removable chips. The group set changes per table — pass a different `groups` config. Pairs with DataTable to filter rows.' } },
  },
  argTypes: {
    groups: { control: 'object', description: 'Filter groups: [{ id, label, options: [{ value, label }] }]' },
    groupIcon: { control: 'text', tpIcon: true, name: 'group icon', description: 'TP icon shown on each filter dropdown' },
  },
};

export default meta;

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
  args: { groups: GROUPS, groupIcon: 'colorfilter' },
  render: ({ groups, groupIcon }) => {
    const [value, setValue] = React.useState({ status: ['Waiting'] });
    const withIcon = groupIcon
      ? groups.map((g) => ({ ...g, icon: <TPLibraryIcon name={groupIcon} size={16} /> }))
      : groups;
    return (
      <div style={{ maxWidth: 720 }}>
        <Filter groups={withIcon} value={value} onChange={setValue} />
        <pre style={{ marginTop: 16, fontSize: 12, color: 'var(--tp-slate-500, #717179)' }}>{JSON.stringify(value, null, 2)}</pre>
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

const STATUS_TONE = { Confirmed: ['--tp-success-50', '--tp-success-700'], Waiting: ['--tp-warning-50', '--tp-warning-700'], 'No-show': ['--tp-error-50', '--tp-error-700'], Completed: ['--tp-slate-100', '--tp-slate-600'] };
const Pill = ({ status }) => {
  const [bg, fg] = STATUS_TONE[status];
  return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: `var(${bg})`, color: `var(${fg})` }}>{status}</span>;
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
      <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Filter groups={GROUPS} value={sel} onChange={setSel} />
        <DataTable columns={columns} data={rows} pageSize={6} zebra emptyState="No rows match the selected filters." />
      </div>
    );
  },
};
