import React from 'react';
import { DataTable, DataCell } from './DataTable';
import { Button } from '@/src/components/atoms/Button';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;

// ── Data ─────────────────────────────────────────────────────────────────────
const FIRST = ['Aarav Sharma', 'Diya Patel', 'Vihaan Reddy', 'Ananya Singh', 'Rohan Mehta', 'Priya Nair', 'Arjun Verma', 'Kavya Iyer', 'Siddharth Rao', 'Meera Joshi', 'Kabir Khanna', 'Ishita Bose', 'Dev Malhotra', 'Sara Pillai', 'Yash Agarwal', 'Nisha Rao', 'Aditya Jain', 'Riya Sen', 'Karan Bhat', 'Tara Menon', 'Vivaan Das', 'Anjali Roy', 'Neil Kapoor', 'Mira Shah'];
const TYPES = ['General Check-up', 'Follow-up', 'Consultation', 'Prescription Refill', 'New Patient', 'Lab Review'];
const DOCTORS = ['Dr. Mehra', 'Dr. Sharma', 'Dr. Kapoor', 'Dr. Gupta'];
const STATUSES = ['Confirmed', 'Waiting', 'No-show', 'Completed'];
const NOTES = [
  'Patient reports mild chest discomfort on exertion; recommend stress test and lipid panel follow-up within two weeks.',
  'Routine follow-up — BP controlled, continue current medication.',
  'Awaiting lab results before adjusting dosage; flagged for review by the attending cardiologist tomorrow morning.',
  'No active complaints.',
];

const ROWS = FIRST.map((name, i) => {
  const h = 9 + (i % 9);
  const m = (i % 2) * 30;
  return {
    id: `r${i + 1}`,
    name,
    mrn: `MRN-${10231 + i}`,
    minutes: h * 60 + m,
    appt: `Today, ${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`,
    type: TYPES[i % TYPES.length],
    doctor: DOCTORS[i % DOCTORS.length],
    phone: `+91 98${String(7650000 + i * 137).slice(0, 7)}`,
    notes: NOTES[i % NOTES.length],
    blood: ['B+', 'O+', 'A-', 'AB+', 'O-'][i % 5],
    status: STATUSES[i % STATUSES.length],
  };
});

const FIELDS = ['name', 'mrn', 'appt', 'doctor', 'type', 'phone', 'notes', 'blood', 'status'];
const fieldVal = (r, f) => r[f];
const sortAccessorFor = (f) => (f === 'appt' ? (r) => r.minutes : (r) => r[f]);

// Library icon node (pickable in the TP Icons panel; empty = none).
const lib = (name, size = 16) => (name && String(name).trim() ? <TPLibraryIcon name={String(name).trim()} size={size} /> : undefined);

// Status pill (semantic TP tokens).
const STATUS_TONE = {
  Confirmed: ['--tp-success-50', '--tp-success-700'],
  Waiting: ['--tp-warning-50', '--tp-warning-700'],
  'No-show': ['--tp-error-50', '--tp-error-700'],
  Completed: ['--tp-slate-100', '--tp-slate-600'],
};
const StatusPill = ({ status }) => {
  const [bg, fg] = STATUS_TONE[status] || STATUS_TONE.Completed;
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: `var(${bg})`, color: `var(${fg})` }}>{status}</span>;
};

// Action cell: one secondary split CTA + two icon action buttons.
const Actions = () => (
  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
    <Button
      variant="outline"
      size="sm"
      icon={<TPIcon name="eye" size={16} />}
      menu={[
        { id: 'view', label: 'View details', icon: <TPIcon name="eye" size={16} /> },
        { id: 'history', label: 'Visit history', icon: <TPIcon name="clipboard" size={16} /> },
        { id: 'print', label: 'Print', icon: <TPIcon name="printer" size={16} /> },
      ]}
    >
      View
    </Button>
    <Button variant="ghost" theme="neutral" size="sm" aria-label="Edit" icon={<TPIcon name="edit" size={18} />} />
    <Button variant="ghost" theme="neutral" size="sm" aria-label="More" icon={<TPIcon name="more" variant="bold" size={18} style={{ transform: 'rotate(90deg)' }} />} />
  </div>
);

// Status → tag tone for declarative `type: "tag"` columns.
const STATUS_TO_TONE = { Confirmed: 'success', Waiting: 'warning', 'No-show': 'error', Completed: 'neutral' };

// Build a column from its flat per-column controls.
function makeCol(n, a) {
  const field = a[`c${n}Field`];
  const sub = a[`c${n}Subtext`];
  return {
    id: `c${n}`,
    header: a[`c${n}Header`],
    sortable: a[`c${n}Sortable`],
    minWidth: a[`c${n}MinWidth`] || 180,
    maxWidth: field === 'notes' ? 280 : undefined,
    sortAccessor: sortAccessorFor(field),
    cell: (r) => (
      <DataCell
        primary={fieldVal(r, field)}
        secondary={sub ? fieldVal(r, a[`c${n}SubField`]) : undefined}
        primaryLeftIcon={lib(a[`c${n}LeftIcon`], 16)}
        primaryRightIcon={lib(a[`c${n}RightIcon`], 14)}
        secondaryLeftIcon={lib(a[`c${n}SubLeftIcon`], 12)}
        secondaryRightIcon={lib(a[`c${n}SubRightIcon`], 12)}
      />
    ),
  };
}

function buildColumns(a) {
  const cols = [makeCol(1, a), makeCol(2, a), makeCol(3, a)];
  if (a.showStatus) cols.push({ id: 'status', header: 'Status', sortable: true, minWidth: 120, sortAccessor: (r) => r.status, cell: (r) => <StatusPill status={r.status} /> });
  if (a.showActions) cols.push({ id: 'actions', header: 'Actions', sticky: 'right', align: 'right', minWidth: 190, cell: () => <Actions /> });
  return cols;
}

// Per-column control group (saves repeating 9 lines × 3).
const colArgTypes = (n) => ({
  [`c${n}Header`]:     { control: 'text', name: `Col ${n} · header`, table: { category: `Column ${n}` } },
  [`c${n}Field`]:      { control: 'select', options: FIELDS, name: `Col ${n} · field`, table: { category: `Column ${n}` } },
  [`c${n}Sortable`]:   { control: 'boolean', name: `Col ${n} · sortable`, table: { category: `Column ${n}` } },
  [`c${n}LeftIcon`]:   { control: 'text', tpIcon: true, name: `Col ${n} · primary left icon`, table: { category: `Column ${n}` } },
  [`c${n}RightIcon`]:  { control: 'text', tpIcon: true, name: `Col ${n} · primary right icon`, table: { category: `Column ${n}` } },
  [`c${n}Subtext`]:    { control: 'boolean', name: `Col ${n} · with subtext`, table: { category: `Column ${n}` } },
  [`c${n}SubField`]:   { control: 'select', options: FIELDS, name: `Col ${n} · subtext field`, table: { category: `Column ${n}` } },
  [`c${n}SubLeftIcon`]:{ control: 'text', tpIcon: true, name: `Col ${n} · subtext left icon`, table: { category: `Column ${n}` } },
  [`c${n}SubRightIcon`]:{ control: 'text', tpIcon: true, name: `Col ${n} · subtext right icon`, table: { category: `Column ${n}` } },
});
const colArgs = (n, o) => ({
  [`c${n}Header`]: o.header, [`c${n}Field`]: o.field, [`c${n}Sortable`]: o.sortable,
  [`c${n}LeftIcon`]: o.left || '', [`c${n}RightIcon`]: o.right || '',
  [`c${n}Subtext`]: o.subtext, [`c${n}SubField`]: o.subField || 'doctor',
  [`c${n}SubLeftIcon`]: o.subLeft || '', [`c${n}SubRightIcon`]: o.subRight || '',
});

// Infinite-scroll wrapper (own component so hooks stay unconditional).
function InfiniteTable({ columns, args, maxHeight, step = 8 }) {
  const [count, setCount] = React.useState(step);
  const [loading, setLoading] = React.useState(false);
  const rows = ROWS.slice(0, count);
  const hasMore = count < ROWS.length;
  const onLoadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => { setCount((c) => Math.min(c + step, ROWS.length)); setLoading(false); }, 800);
  };
  return (
    <DataTable columns={columns} data={rows} rowHeight={args.rowHeight} stickyHeader={args.stickyHeader}
      maxHeight={maxHeight || 360} zebra={args.zebra} hoverable={args.hoverable} sortable={args.sortable}
      loading={loading} hasMore={hasMore} onLoadMore={onLoadMore} />
  );
}

// ── Playground — per-column settings + everything else in Controls ────────────
export const Playground = {
  args: {
    rowHeight: 'lg',
    dataMode: 'pagination',
    pageSize: 6,
    sortable: true,
    stickyHeader: false,
    maxHeight: 360,
    zebra: false,
    hoverable: true,
    showStatus: true,
    showActions: true,
    ...colArgs(1, { header: 'Patient', field: 'name', sortable: true, left: 'profile', subtext: true, subField: 'mrn', subLeft: 'clipboard' }),
    ...colArgs(2, { header: 'Appointment', field: 'appt', sortable: true, left: 'calendar-1', subtext: true, subField: 'doctor', subLeft: 'profile' }),
    ...colArgs(3, { header: 'Notes', field: 'notes', sortable: false, left: 'document', right: 'information', subtext: false }),
  },
  argTypes: {
    rowHeight:    { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'], name: 'density', table: { category: 'Table' } },
    dataMode:     { control: 'inline-radio', options: ['none', 'pagination', 'infinite'], name: 'data mode', table: { category: 'Table' } },
    pageSize:     { control: { type: 'range', min: 3, max: 12, step: 1 }, name: 'page size', table: { category: 'Table' } },
    sortable:     { control: 'boolean', name: 'sort enabled', table: { category: 'Table' } },
    stickyHeader: { control: 'boolean', name: 'sticky header', table: { category: 'Table' } },
    maxHeight:    { control: { type: 'range', min: 200, max: 600, step: 20 }, name: 'scroll height', table: { category: 'Table' } },
    zebra:        { control: 'boolean', table: { category: 'Table' } },
    hoverable:    { control: 'boolean', table: { category: 'Table' } },
    showStatus:   { control: 'boolean', name: 'status column', table: { category: 'Table' } },
    showActions:  { control: 'boolean', name: 'actions column', table: { category: 'Table' } },
    ...colArgTypes(1),
    ...colArgTypes(2),
    ...colArgTypes(3),
  },
  render: (args) => {
    const columns = buildColumns(args);
    const sharedHeight = args.stickyHeader ? args.maxHeight : undefined;

    return (
      <div style={{ maxWidth: 960 }}>
        {args.dataMode === 'infinite' ? (
          <InfiniteTable columns={columns} args={args} maxHeight={sharedHeight || args.maxHeight} />
        ) : (
          <DataTable columns={columns} data={ROWS} rowHeight={args.rowHeight} stickyHeader={args.stickyHeader}
            maxHeight={sharedHeight} zebra={args.zebra} hoverable={args.hoverable} sortable={args.sortable}
            pageSize={args.dataMode === 'pagination' ? args.pageSize : undefined} />
        )}
      </div>
    );
  },
};

// ── Truncation rule — subtext → 1-line primary; none → 2 lines ────────────────
export const TruncationRule = {
  name: 'Truncation Rule (subtext vs none)',
  parameters: { docs: { description: { story: 'With subtext the primary text truncates at one line; without subtext it may take two lines, then truncates. Overflow shows the full text in a tooltip on hover.' } } },
  render: () => {
    const columns = [
      { id: 'withSub', header: 'With subtext (primary → 1 line)', minWidth: 260, maxWidth: 280, cell: (r) => (
        <DataCell primary={r.notes} secondary={r.doctor} primaryLeftIcon={<TPLibraryIcon name="document" size={16} />} secondaryLeftIcon={<TPLibraryIcon name="profile" size={12} />} secondaryRightIcon={<TPLibraryIcon name="information" size={12} />} />
      ) },
      { id: 'noSub', header: 'No subtext (primary → 2 lines)', minWidth: 260, maxWidth: 280, cell: (r) => (
        <DataCell primary={r.notes} primaryLeftIcon={<TPLibraryIcon name="note" size={16} />} />
      ) },
      { id: 'status', header: 'Status', minWidth: 120, cell: (r) => <StatusPill status={r.status} /> },
    ];
    return <DataTable columns={columns} data={ROWS.slice(0, 5)} />;
  },
};

// ── Sticky header + lazy load ─────────────────────────────────────────────────
export const StickyHeaderLazyLoad = {
  name: 'Sticky Header + Lazy Load',
  render: () => {
    const [count, setCount] = React.useState(8);
    const [loading, setLoading] = React.useState(false);
    const rows = ROWS.slice(0, count);
    const hasMore = count < ROWS.length;
    const onLoadMore = () => {
      if (loading || !hasMore) return;
      setLoading(true);
      setTimeout(() => { setCount((c) => Math.min(c + 6, ROWS.length)); setLoading(false); }, 900);
    };
    const columns = [
      { id: 'patient', header: 'Patient', minWidth: 200, cell: (r) => <DataCell primary={r.name} secondary={r.mrn} primaryLeftIcon={<TPLibraryIcon name="profile" size={16} />} secondaryLeftIcon={<TPLibraryIcon name="clipboard" size={12} />} /> },
      { id: 'appt', header: 'Appointment', minWidth: 180, cell: (r) => <DataCell primary={r.appt} primaryLeftIcon={<TPLibraryIcon name="calendar-1" size={16} />} /> },
      { id: 'status', header: 'Status', minWidth: 120, cell: (r) => <StatusPill status={r.status} /> },
      { id: 'actions', header: 'Actions', sticky: 'right', align: 'right', minWidth: 190, cell: () => <Actions /> },
    ];
    return <DataTable columns={columns} data={rows} stickyHeader maxHeight={300} hoverable loading={loading} hasMore={hasMore} onLoadMore={onLoadMore} />;
  },
};

// ── Scroll + sticky shadow (Actions header left-aligned) ──────────────────────
export const StickyScrollShadow = {
  name: 'Scroll + Sticky Shadow',
  render: () => {
    const columns = buildColumns({
      showStatus: true, showActions: true,
      ...colArgs(1, { header: 'Patient', field: 'name', sortable: false, left: 'profile', subtext: true, subField: 'mrn', subLeft: 'clipboard' }),
      ...colArgs(2, { header: 'Appointment', field: 'appt', sortable: false, left: 'calendar-1', subtext: true, subField: 'doctor' }),
      ...colArgs(3, { header: 'Contact', field: 'phone', sortable: false, left: 'call', subtext: false }),
    });
    return (
      <div style={{ maxWidth: 540, border: '1px dashed var(--tp-slate-200, #e2e2ea)', borderRadius: 10, padding: 8 }}>
        <DataTable columns={columns} data={ROWS.slice(0, 6)} hoverable />
      </div>
    );
  },
};

// ── Declarative columns — type-driven, maps straight onto backend data ────────
export const DeclarativeColumns = {
  name: 'Declarative Columns (type-driven)',
  parameters: { docs: { description: { story: 'Columns are described by `type` (text · tag · action) + accessors, so a table is configured from backend data without writing JSX per cell. `type: "text"` → primary/subtext + icons + truncation rules; `type: "tag"` → a tone pill; `type: "action"` → the action cell.' } } },
  render: () => {
    const columns = [
      { id: 'patient', header: 'Patient', type: 'text', minWidth: 220,
        primary: (r) => r.name, secondary: (r) => r.mrn,
        leftIcon: <TPIcon name="profile" variant="bulk" size={18} />, subLeftIcon: <TPIcon name="clipboard" size={12} /> },
      // Only Appointment is sortable here (any column can opt in with `sortable`).
      { id: 'appt', header: 'Appointment', type: 'text', minWidth: 190, sortable: true, sortAccessor: (r) => r.minutes,
        primary: (r) => r.appt, secondary: (r) => r.doctor, leftIcon: <TPIcon name="calendar" size={16} /> },
      { id: 'type', header: 'Type', type: 'tag', minWidth: 150, tag: (r) => ({ label: r.type, tone: 'neutral' }) },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 130, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
      { id: 'actions', header: 'Actions', type: 'action', sticky: 'right', align: 'right', minWidth: 190, actions: () => <Actions /> },
    ];
    return <DataTable columns={columns} data={ROWS.slice(0, 7)} sortable defaultSort={{ id: 'appt', dir: 'asc' }} />;
  },
};
