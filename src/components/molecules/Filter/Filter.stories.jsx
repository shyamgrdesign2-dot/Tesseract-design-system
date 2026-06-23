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
    groups: { control: 'object', description: 'Filter sections: [{ id, label, options: [{ value, label }] }]' },
    label: { control: 'text', description: 'Trigger label' },
    triggerIcon: { control: 'text', tpIcon: true, name: 'trigger icon', description: 'Tesseract icon on the Filter trigger (defaults to a funnel)' },
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
  args: { groups: GROUPS, label: 'Filter', triggerIcon: '' },
  render: ({ groups, label, triggerIcon }) => {
    const [value, setValue] = React.useState({ status: ['Waiting'] });
    return (
      <div style={{ maxWidth: 720 }}>
        <Filter
          groups={groups}
          label={label}
          icon={triggerIcon ? <TPLibraryIcon name={triggerIcon} size={16} /> : undefined}
          value={value}
          onChange={setValue}
        />
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
