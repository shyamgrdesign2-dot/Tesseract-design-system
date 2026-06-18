import React from 'react';
import { DataTable, DataCell, CellTag, TableActions } from './DataTable';
import { TPAnalyticsProvider } from '@/src/analytics';
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

// Library icon node (pickable in the Tesseract Icons panel; empty = none).
const lib = (name, size = 16) => (name && String(name).trim() ? <TPLibraryIcon name={String(name).trim()} size={size} /> : undefined);

// Status pill (semantic Tesseract tokens).
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

// Action cell — a split "View" CTA + a kebab (3-dots-more) icon button, built
// from the reusable, trackable <TableActions>. Each button emits a track event
// to a TPAnalyticsProvider when one is present (see the Action Tracking story).
const Actions = () => (
  <TableActions
    primary={{
      label: 'View',
      icon: 'eye',
      track: 'patient.view',
      menu: [
        { id: 'view', label: 'View details', icon: <TPIcon name="eye" size={16} />, track: 'patient.view_details' },
        { id: 'history', label: 'Visit history', icon: <TPIcon name="clipboard" size={16} />, track: 'patient.history' },
        { id: 'print', label: 'Print', icon: <TPIcon name="printer" size={16} />, track: 'patient.print' },
      ],
    }}
    actions={[
      { icon: <TPLibraryIcon name="3-dots-more" size={18} />, label: 'More actions', track: 'patient.more' },
    ]}
  />
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
    <DataTable columns={columns} data={rows} rowKey={(r) => r.mrn} rowHeight={args.rowHeight} stickyHeader={args.stickyHeader}
      maxHeight={maxHeight || 360} zebra={args.zebra} hoverable={args.hoverable} bordered={args.bordered} sortable={args.sortable}
      selectionMode={args.selectionMode} loading={loading} hasMore={hasMore} onLoadMore={onLoadMore} />
  );
}

// A fixed, sensible column set for the Playground (Patient · Appointment ·
// Status · Actions). The Playground only exposes TABLE-level knobs — per-column
// authoring lives in the "Column Configurator" story.
const basicColumns = (args) => {
  const cols = [
    { id: 'patient', header: 'Patient', type: 'text', minWidth: 220, sortable: true, sortAccessor: (r) => r.name,
      primary: (r) => r.name, secondary: (r) => r.mrn, leftIcon: <TPIcon name="profile" variant="bulk" size={18} />, subLeftIcon: <TPIcon name="clipboard" size={12} /> },
    { id: 'appt', header: 'Appointment', type: 'text', minWidth: 190, sortable: true, sortAccessor: (r) => r.minutes,
      primary: (r) => r.appt, secondary: (r) => r.doctor, leftIcon: <TPIcon name="calendar-1" size={16} /> },
  ];
  if (args.showStatus) cols.push({ id: 'status', header: 'Status', type: 'tag', minWidth: 130, sortable: true, sortAccessor: (r) => r.status, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) });
  if (args.showActions) cols.push({ id: 'actions', header: 'Actions', type: 'action', sticky: 'right', width: 200, align: 'right', actions: () => <Actions /> });
  return cols;
};

// ── Playground — basic, table-level configuration only ────────────────────────
export const Playground = {
  parameters: { docs: { description: { story: 'The everyday table with **table-level** controls (density, data mode, selection, sticky header, zebra, borders, …). For deep per-column authoring — cell types, icons, tags, sticky, the action column — see **Column Configurator**. Each capability (selection, sticky columns, row states, nesting, grouping, spanning) has its own dedicated story.' } } },
  args: {
    rowHeight: 'lg',
    dataMode: 'pagination',
    pageSize: 6,
    sortable: true,
    selectionMode: 'none',
    stickyHeader: false,
    maxHeight: 360,
    zebra: false,
    hoverable: true,
    bordered: false,
    showStatus: true,
    showActions: true,
  },
  argTypes: {
    rowHeight:     { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'], name: 'density', table: { category: 'Table' } },
    dataMode:      { control: 'inline-radio', options: ['none', 'pagination', 'infinite'], name: 'data mode', table: { category: 'Table' } },
    pageSize:      { control: { type: 'range', min: 3, max: 12, step: 1 }, name: 'page size', table: { category: 'Table' }, if: { arg: 'dataMode', eq: 'pagination' } },
    sortable:      { control: 'boolean', name: 'sort enabled', table: { category: 'Table' } },
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'], name: 'selection', table: { category: 'Table' } },
    stickyHeader:  { control: 'boolean', name: 'sticky header', table: { category: 'Table' } },
    maxHeight:     { control: { type: 'range', min: 200, max: 600, step: 20 }, name: 'scroll height', table: { category: 'Table' }, if: { arg: 'stickyHeader' } },
    zebra:         { control: 'boolean', table: { category: 'Table' } },
    hoverable:     { control: 'boolean', table: { category: 'Table' } },
    bordered:      { control: 'boolean', table: { category: 'Table' } },
    showStatus:    { control: 'boolean', name: 'status column', table: { category: 'Columns' } },
    showActions:   { control: 'boolean', name: 'actions column', table: { category: 'Columns' } },
  },
  render: (args) => {
    const columns = basicColumns(args);
    const sharedHeight = args.stickyHeader ? args.maxHeight : undefined;
    const common = {
      rowHeight: args.rowHeight, stickyHeader: args.stickyHeader, zebra: args.zebra,
      hoverable: args.hoverable, bordered: args.bordered, sortable: args.sortable,
      selectionMode: args.selectionMode, rowKey: (r) => r.mrn,
    };
    return (
      <div style={{ maxWidth: 960 }}>
        {args.dataMode === 'infinite' ? (
          <InfiniteTable columns={columns} args={args} maxHeight={sharedHeight || args.maxHeight} />
        ) : (
          <DataTable columns={columns} data={ROWS} {...common}
            maxHeight={sharedHeight}
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

// ── Row selection — leading checkbox column + header select-all ───────────────
export const RowSelection = {
  name: 'Row Selection (checkboxes)',
  render: () => {
    const columns = [
      { id: 'patient', header: 'Patient', type: 'text', minWidth: 220,
        primary: (r) => r.name, secondary: (r) => r.mrn,
        leftIcon: <TPIcon name="profile" variant="bulk" size={18} />, subLeftIcon: <TPIcon name="clipboard" size={12} /> },
      { id: 'appt', header: 'Appointment', type: 'text', minWidth: 190,
        primary: (r) => r.appt, secondary: (r) => r.doctor, leftIcon: <TPIcon name="calendar" size={16} /> },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 130, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
    ];
    const [selected, setSelected] = React.useState(['MRN-10232']);
    return (
      <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 13, color: '#454551' }}>
          <strong style={{ color: '#171725' }}>{selected.length}</strong> selected
        </div>
        <DataTable
          columns={columns}
          data={ROWS.slice(0, 8)}
          rowKey={(r) => r.mrn}
          selectable
          selectedKeys={selected}
          onSelectionChange={setSelected}
          pageSize={6}
        />
      </div>
    );
  },
};

// ── Column Configurator ───────────────────────────────────────────────────────
// One fully configurable column: its content can be TEXT, a TAG, or ACTION
// BUTTONS, with an optional subline that is independently text or a tag. Tags can
// be non-actionable (Badge) or actionable (Chip — hover + press). Text/subtext
// can carry a left or right icon. The same column config applies to every column;
// this story exposes it for a single column to keep the Controls panel readable.
const TONES = ['neutral', 'primary', 'success', 'warning', 'error'];

// One text line with an optional left/right icon (composes nothing extra — plain
// inline layout matching the DataCell line metrics).
function TextLine({ text, icon, side, kind }) {
  const ic = icon ? <span style={{ display: 'inline-flex', flexShrink: 0, color: 'var(--tp-slate-400)' }}>{icon}</span> : null;
  const secondary = kind === 'secondary';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0, maxWidth: '100%',
      fontSize: secondary ? 12 : 14, fontWeight: secondary ? 400 : 500,
      color: secondary ? 'var(--tp-slate-500)' : 'var(--tp-slate-900)',
    }}>
      {side === 'left' && ic}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
      {side === 'right' && ic}
    </span>
  );
}

// Build the configurable cell from the flat control args.
function configCell(row, a) {
  if (a.kind === 'actions') return <Actions />;

  const primary = a.kind === 'tag'
    ? <CellTag label={fieldVal(row, a.field)} tone={a.tagTone} actionable={a.tagActionable} icon={a.tagIcon === 'left' ? lib(a.iconName, 14) : undefined} />
    : <TextLine text={fieldVal(row, a.field)} icon={lib(a.iconName, 16)} side={a.primaryIcon} kind="primary" />;

  let sub = null;
  if (a.withSub) {
    sub = a.subKind === 'tag'
      ? <CellTag label={fieldVal(row, a.subField)} tone={a.subTagTone} actionable={a.subTagActionable} />
      : <TextLine text={fieldVal(row, a.subField)} icon={lib(a.subIconName, 12)} side={a.subIcon} kind="secondary" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start', minWidth: 0 }}>
      {primary}
      {sub}
    </div>
  );
}

export const SingleColumnConfigurator = {
  name: 'Single Column Configurator (text · tag · actions)',
  args: {
    headerLabel: 'Patient',
    kind: 'text',
    field: 'name',
    primaryIcon: 'left',
    iconName: 'profile',
    tagTone: 'primary',
    tagActionable: false,
    tagIcon: 'none',
    withSub: true,
    subKind: 'text',
    subField: 'mrn',
    subIcon: 'left',
    subIconName: 'clipboard',
    subTagTone: 'neutral',
    subTagActionable: false,
  },
  argTypes: {
    headerLabel:      { control: 'text', name: 'column header', table: { category: 'Column' } },
    kind:             { control: 'inline-radio', options: ['text', 'tag', 'actions'], name: 'cell content', table: { category: 'Column' } },
    field:            { control: 'select', options: FIELDS, name: 'value field', table: { category: 'Column' } },

    primaryIcon:      { control: 'inline-radio', options: ['none', 'left', 'right'], name: 'text · icon side', table: { category: 'Text' } },
    iconName:         { control: 'text', tpIcon: true, name: 'text · icon', table: { category: 'Text' } },

    tagTone:          { control: 'select', options: TONES, name: 'tag · tone', table: { category: 'Tag' } },
    tagActionable:    { control: 'boolean', name: 'tag · actionable (Chip)', table: { category: 'Tag' } },
    tagIcon:          { control: 'inline-radio', options: ['none', 'left'], name: 'tag · icon', table: { category: 'Tag' } },

    withSub:          { control: 'boolean', name: 'subline · enabled', table: { category: 'Subline' } },
    subKind:          { control: 'inline-radio', options: ['text', 'tag'], name: 'subline · type', table: { category: 'Subline' } },
    subField:         { control: 'select', options: FIELDS, name: 'subline · field', table: { category: 'Subline' } },
    subIcon:          { control: 'inline-radio', options: ['none', 'left', 'right'], name: 'subline text · icon side', table: { category: 'Subline' } },
    subIconName:      { control: 'text', tpIcon: true, name: 'subline text · icon', table: { category: 'Subline' } },
    subTagTone:       { control: 'select', options: TONES, name: 'subline tag · tone', table: { category: 'Subline' } },
    subTagActionable: { control: 'boolean', name: 'subline tag · actionable', table: { category: 'Subline' } },
  },
  render: (a) => {
    const columns = [
      // The fully configurable column.
      { id: 'config', header: a.headerLabel, minWidth: 240, align: a.kind === 'actions' ? 'right' : 'left', cell: (r) => configCell(r, a) },
      // Static context columns so the table reads like a real surface.
      { id: 'appt', header: 'Appointment', type: 'text', minWidth: 190,
        primary: (r) => r.appt, secondary: (r) => r.doctor, leftIcon: <TPIcon name="calendar-1" size={16} /> },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 130, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
    ];
    return (
      <div style={{ maxWidth: 820 }}>
        <DataTable columns={columns} data={ROWS.slice(0, 8)} rowKey={(r) => r.mrn} hoverable />
      </div>
    );
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
// Column Configurator — Storybook Controls per column
// ═══════════════════════════════════════════════════════════════════════════════

const TAG_TONES = ['auto', 'neutral', 'primary', 'success', 'warning', 'error'];
const AUTO_TONE = { Confirmed: 'success', Waiting: 'warning', 'No-show': 'error', Completed: 'neutral', 'General Check-up': 'primary', 'Follow-up': 'neutral', Consultation: 'primary', 'Prescription Refill': 'warning', 'New Patient': 'success', 'Lab Review': 'neutral' };

const dtColArgTypes = (n) => {
  const cat = `Column ${n}`;
  return {
    [`c${n}Name`]:           { control: 'text', name: 'header', table: { category: cat } },
    [`c${n}Type`]:           { control: 'inline-radio', options: ['text', 'tag', 'actions'], name: 'cell type', table: { category: cat } },
    [`c${n}Field`]:          { control: 'select', options: FIELDS, name: 'data field', table: { category: cat }, if: { arg: `c${n}Type`, neq: 'actions' } },
    [`c${n}Sortable`]:       { control: 'boolean', name: 'sortable', table: { category: cat }, if: { arg: `c${n}Type`, neq: 'actions' } },
    [`c${n}Sticky`]:         { control: 'boolean', name: 'sticky (rightmost)', table: { category: cat } },

    // ── Text: primary line ──
    [`c${n}LeftIcon`]:       { control: 'text', tpIcon: true, name: '↳ primary left icon', table: { category: cat, subcategory: 'Primary' }, if: { arg: `c${n}Type`, eq: 'text' } },
    [`c${n}RightIcon`]:      { control: 'text', tpIcon: true, name: '↳ primary right icon', table: { category: cat, subcategory: 'Primary' }, if: { arg: `c${n}Type`, eq: 'text' } },

    // ── Text: secondary line ──
    [`c${n}WithSub`]:        { control: 'boolean', name: '↳ show secondary', table: { category: cat, subcategory: 'Secondary' }, if: { arg: `c${n}Type`, eq: 'text' } },
    [`c${n}SubField`]:       { control: 'select', options: FIELDS, name: '↳ secondary field', table: { category: cat, subcategory: 'Secondary' }, if: { arg: `c${n}Type`, eq: 'text' } },
    [`c${n}SubLeftIcon`]:    { control: 'text', tpIcon: true, name: '↳ secondary left icon', table: { category: cat, subcategory: 'Secondary' }, if: { arg: `c${n}Type`, eq: 'text' } },
    [`c${n}SubRightIcon`]:   { control: 'text', tpIcon: true, name: '↳ secondary right icon', table: { category: cat, subcategory: 'Secondary' }, if: { arg: `c${n}Type`, eq: 'text' } },

    // ── Tag ──
    [`c${n}TagTone`]:        { control: 'select', options: TAG_TONES, name: '↳ tag tone', table: { category: cat, subcategory: 'Tag' }, if: { arg: `c${n}Type`, eq: 'tag' } },
    [`c${n}TagActionable`]:  { control: 'boolean', name: '↳ actionable (Chip)', table: { category: cat, subcategory: 'Tag' }, if: { arg: `c${n}Type`, eq: 'tag' } },
    [`c${n}TagIcon`]:        { control: 'text', tpIcon: true, name: '↳ tag icon', table: { category: cat, subcategory: 'Tag' }, if: { arg: `c${n}Type`, eq: 'tag' } },

    // ── Actions (configurable action column) ──
    [`c${n}ActLabel`]:       { control: 'text', name: '↳ primary label', table: { category: cat, subcategory: 'Actions' }, if: { arg: `c${n}Type`, eq: 'actions' } },
    [`c${n}ActIcon`]:        { control: 'text', tpIcon: true, name: '↳ primary icon', table: { category: cat, subcategory: 'Actions' }, if: { arg: `c${n}Type`, eq: 'actions' } },
    [`c${n}ActSplit`]:       { control: 'boolean', name: '↳ split menu', table: { category: cat, subcategory: 'Actions' }, if: { arg: `c${n}Type`, eq: 'actions' } },
    [`c${n}ActMore`]:        { control: 'boolean', name: '↳ kebab button', table: { category: cat, subcategory: 'Actions' }, if: { arg: `c${n}Type`, eq: 'actions' } },
    [`c${n}ActMoreIcon`]:    { control: 'text', tpIcon: true, name: '↳ kebab icon', table: { category: cat, subcategory: 'Actions' }, if: { arg: `c${n}Type`, eq: 'actions' } },
  };
};

const dtColDefaults = (n, o) => ({
  [`c${n}Name`]: o.name, [`c${n}Type`]: o.type || 'text', [`c${n}Field`]: o.field || 'name',
  [`c${n}Sortable`]: o.sortable || false, [`c${n}Sticky`]: o.sticky || false,
  // Text primary
  [`c${n}LeftIcon`]: o.leftIcon || '', [`c${n}RightIcon`]: o.rightIcon || '',
  // Text secondary
  [`c${n}WithSub`]: o.withSub || false, [`c${n}SubField`]: o.subField || 'mrn',
  [`c${n}SubLeftIcon`]: o.subLeftIcon || '', [`c${n}SubRightIcon`]: o.subRightIcon || '',
  // Tag
  [`c${n}TagTone`]: o.tagTone || 'auto', [`c${n}TagActionable`]: o.tagActionable || false,
  [`c${n}TagIcon`]: o.tagIcon || '',
  // Actions
  [`c${n}ActLabel`]: o.actLabel || 'View', [`c${n}ActIcon`]: o.actIcon || 'eye',
  [`c${n}ActSplit`]: o.actSplit ?? true, [`c${n}ActMore`]: o.actMore ?? true,
  [`c${n}ActMoreIcon`]: o.actMoreIcon || '3-dots-more',
});

function buildDTColumn(n, a, isSticky) {
  const type = a[`c${n}Type`] || 'text';
  const field = a[`c${n}Field`] || 'name';
  const base = {
    id: `dc_${n}`, header: a[`c${n}Name`] || `Column ${n}`,
    sortable: a[`c${n}Sortable`], sortAccessor: sortAccessorFor(field),
    ...(isSticky ? { sticky: 'right' } : {}),
  };

  if (type === 'actions') {
    const split = a[`c${n}ActSplit`];
    const showMore = a[`c${n}ActMore`];
    const primary = {
      label: a[`c${n}ActLabel`] || 'View',
      icon: a[`c${n}ActIcon`] || 'eye',
      track: `${base.id}.primary`,
      menu: split ? [
        { id: 'view', label: 'View details', icon: <TPIcon name="eye" size={16} />, track: `${base.id}.view` },
        { id: 'edit', label: 'Edit', icon: <TPIcon name="edit" size={16} />, track: `${base.id}.edit` },
        { id: 'print', label: 'Print', icon: <TPIcon name="printer" size={16} />, track: `${base.id}.print` },
      ] : undefined,
    };
    const actions = showMore ? [{ icon: a[`c${n}ActMoreIcon`] || '3-dots-more', label: 'More actions', track: `${base.id}.more` }] : [];
    return { ...base, type: 'action', sticky: 'right', align: 'right', minWidth: 190, sortable: false, actions: () => <TableActions primary={primary} actions={actions} /> };
  }
  if (type === 'tag') {
    const tone = a[`c${n}TagTone`] || 'auto';
    const actionable = a[`c${n}TagActionable`] || false;
    const tagIcon = lib(a[`c${n}TagIcon`], 14);
    return { ...base, type: 'tag', minWidth: 130, tag: (r) => ({
      label: fieldVal(r, field),
      tone: tone === 'auto' ? (AUTO_TONE[fieldVal(r, field)] || 'neutral') : tone,
      actionable, icon: tagIcon,
    })};
  }
  // text
  const leftIcon = lib(a[`c${n}LeftIcon`], 16);
  const rightIcon = lib(a[`c${n}RightIcon`], 14);
  if (a[`c${n}WithSub`]) {
    const sub = a[`c${n}SubField`] || 'mrn';
    return { ...base, type: 'text', minWidth: 200, primary: (r) => fieldVal(r, field), secondary: (r) => fieldVal(r, sub),
      leftIcon, rightIcon, subLeftIcon: lib(a[`c${n}SubLeftIcon`], 12), subRightIcon: lib(a[`c${n}SubRightIcon`], 12) };
  }
  return { ...base, type: 'text', minWidth: leftIcon ? 180 : 140, primary: (r) => fieldVal(r, field), leftIcon, rightIcon };
}

export const ColumnConfigurator = {
  name: 'Column Configurator',
  parameters: {
    docs: { description: { story: 'Set the **number of columns** in Controls, then configure each column\'s name, cell type, data field, and sub-options.\n\n**Cell types:** `text` (with optional primary/secondary icons and secondary line) · `tag` (tone, actionable Chip vs Badge, icon) · `actions`.' } },
  },
  args: {
    columnCount: 5,
    ...dtColDefaults(1,  { name: 'Patient',     type: 'text',    field: 'name',   sortable: true,  leftIcon: 'profile', withSub: true, subField: 'mrn', subLeftIcon: 'clipboard' }),
    ...dtColDefaults(2,  { name: 'Appointment', type: 'text',    field: 'appt',   sortable: true,  leftIcon: 'calendar-1' }),
    ...dtColDefaults(3,  { name: 'Type',        type: 'tag',     field: 'type',   sortable: false, tagTone: 'auto' }),
    ...dtColDefaults(4,  { name: 'Status',      type: 'tag',     field: 'status', sortable: true,  tagTone: 'auto' }),
    ...dtColDefaults(5,  { name: 'Actions',     type: 'actions', field: 'name',   sortable: false, sticky: true }),
    ...dtColDefaults(6,  { name: 'Doctor',      type: 'text',    field: 'doctor' }),
    ...dtColDefaults(7,  { name: 'Phone',       type: 'text',    field: 'phone',  leftIcon: 'call' }),
    ...dtColDefaults(8,  { name: 'Blood',       type: 'tag',     field: 'blood',  tagTone: 'neutral' }),
    ...dtColDefaults(9,  { name: 'Notes',       type: 'text',    field: 'notes' }),
    ...dtColDefaults(10, { name: 'Column 10',   type: 'text',    field: 'name' }),
  },
  argTypes: {
    columnCount: { control: { type: 'range', min: 1, max: 10, step: 1 }, name: 'number of columns', table: { category: 'Table' } },
    ...dtColArgTypes(1), ...dtColArgTypes(2), ...dtColArgTypes(3), ...dtColArgTypes(4), ...dtColArgTypes(5),
    ...dtColArgTypes(6), ...dtColArgTypes(7), ...dtColArgTypes(8), ...dtColArgTypes(9), ...dtColArgTypes(10),
  },
  render: (args) => {
    // Find the last column with sticky enabled (max one sticky).
    let stickyIdx = -1;
    for (let n = args.columnCount; n >= 1; n--) {
      if (args[`c${n}Sticky`]) { stickyIdx = n; break; }
    }
    const columns = [];
    for (let n = 1; n <= args.columnCount; n++) {
      columns.push(buildDTColumn(n, args, n === stickyIdx));
    }
    return (
      <div style={{ maxWidth: 1060 }}>
        <DataTable columns={columns} data={ROWS} rowKey={(r) => r.mrn} sortable hoverable pageSize={8} />
      </div>
    );
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Capability showcase — selection · sticky columns · row state · nesting ·
// grouping · spanning. Each demonstrates one prop surface in isolation.
// ═══════════════════════════════════════════════════════════════════════════════

// Reusable Patient column (text primary + MRN subtext).
const patientCol = (over = {}) => ({
  id: 'patient', header: 'Patient', type: 'text', minWidth: 220,
  primary: (r) => r.name, secondary: (r) => r.mrn,
  leftIcon: <TPIcon name="profile" variant="bulk" size={18} />, subLeftIcon: <TPIcon name="clipboard" size={12} />,
  ...over,
});

// ── Selection modes — none · single (radio) · multiple (checkbox) + disabled ──
export const SelectionModes = {
  name: 'Selection (single · multiple · disabled)',
  parameters: { docs: { description: { story: '`selectionMode` adds a leading control column: `"single"` renders radios (one row at a time), `"multiple"` renders checkboxes with a header select-all. `isRowDisabled` mutes a row and blocks its selection. Try the control below.' } } },
  args: { selectionMode: 'multiple', disableNoShows: true, zebra: false },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'], name: 'selection mode', table: { category: 'Table' } },
    disableNoShows: { control: 'boolean', name: 'disable "No-show" rows', table: { category: 'Table' } },
    zebra: { control: 'boolean', table: { category: 'Table' } },
  },
  render: (args) => {
    const [sel, setSel] = React.useState(['MRN-10232']);
    const columns = [
      patientCol(),
      { id: 'appt', header: 'Appointment', type: 'text', minWidth: 190, primary: (r) => r.appt, secondary: (r) => r.doctor, leftIcon: <TPIcon name="calendar-1" size={16} /> },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 130, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
    ];
    return (
      <div style={{ maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 13, color: '#454551' }}>
          <strong style={{ color: '#171725' }}>{sel.length}</strong> selected
        </div>
        <DataTable
          columns={columns}
          data={ROWS.slice(0, 8)}
          rowKey={(r) => r.mrn}
          selectionMode={args.selectionMode}
          selectedKeys={sel}
          onSelectionChange={setSel}
          isRowDisabled={args.disableNoShows ? (r) => r.status === 'No-show' : undefined}
          zebra={args.zebra}
        />
      </div>
    );
  },
};

// ── Sticky columns — pin the first column left and the actions column right ────
export const StickyColumns = {
  name: 'Sticky Columns (left + right)',
  parameters: { docs: { description: { story: 'Set `sticky: "left"` or `sticky: "right"` on any column — they reorder to the correct edge and stack with cumulative offsets. Scroll horizontally: the pinned Patient column (left) and Actions column (right) stay put, each casting a divider shadow only while content hides behind it. The selection column pins alongside the left band.' } } },
  render: () => {
    const columns = [
      patientCol({ sticky: 'left', width: 230 }),
      { id: 'appt', header: 'Appointment', type: 'text', minWidth: 180, primary: (r) => r.appt, leftIcon: <TPIcon name="calendar-1" size={16} /> },
      { id: 'doctor', header: 'Doctor', type: 'text', minWidth: 160, primary: (r) => r.doctor },
      { id: 'type', header: 'Type', type: 'tag', minWidth: 170, tag: (r) => ({ label: r.type, tone: 'neutral' }) },
      { id: 'phone', header: 'Contact', type: 'text', minWidth: 180, primary: (r) => r.phone, leftIcon: <TPIcon name="call" size={16} /> },
      { id: 'blood', header: 'Blood', type: 'text', minWidth: 120, primary: (r) => r.blood },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 140, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
      { id: 'actions', header: 'Actions', type: 'action', sticky: 'right', width: 200, align: 'right', actions: () => <Actions /> },
    ];
    return (
      <div style={{ maxWidth: 720 }}>
        <DataTable columns={columns} data={ROWS.slice(0, 7)} rowKey={(r) => r.mrn} selectionMode="multiple" hoverable />
      </div>
    );
  },
};

// ── Row states — semantic background tint + leading accent ────────────────────
export const RowStates = {
  name: 'Row States (info · success · warning · error · reference)',
  parameters: { docs: { description: { story: '`rowState(row)` tints a row with a semantic background and a leading accent bar — for inline validation, highlighting, or marking a reference/baseline row. Works alongside selection, zebra and hover.' } } },
  render: () => {
    const STATE_BY_INDEX = ['reference', undefined, 'success', undefined, 'warning', 'error', undefined, 'info'];
    const columns = [
      patientCol(),
      { id: 'appt', header: 'Appointment', type: 'text', minWidth: 190, primary: (r) => r.appt, secondary: (r) => r.doctor, leftIcon: <TPIcon name="calendar-1" size={16} /> },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 130, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
      { id: 'note', header: 'Flag', type: 'text', minWidth: 200, primary: (r, i) => ({ reference: 'Baseline visit', success: 'Vitals normal', warning: 'Review pending', error: 'Critical value', info: 'New note added' }[STATE_BY_INDEX[i]] || '—') },
    ];
    return (
      <div style={{ maxWidth: 860 }}>
        <DataTable columns={columns} data={ROWS.slice(0, 8)} rowKey={(r) => r.mrn} rowState={(r, i) => STATE_BY_INDEX[i]} hoverable />
      </div>
    );
  },
};

// ── Nested rows — expandable tree ─────────────────────────────────────────────
const NESTED = [
  { id: 'v1', name: 'Aarav Sharma', mrn: 'Care episode', appt: 'Cardiology', doctor: 'Dr. Mehra', status: 'Confirmed', children: [
    { id: 'v1a', name: 'Echocardiogram', mrn: 'Imaging', appt: 'Mar 02', doctor: 'Dr. Mehra', status: 'Completed' },
    { id: 'v1b', name: 'Lipid panel', mrn: 'Lab', appt: 'Mar 02', doctor: 'Dr. Mehra', status: 'Completed' },
    { id: 'v1c', name: 'Stress test', mrn: 'Procedure', appt: 'Mar 09', doctor: 'Dr. Mehra', status: 'Waiting' },
  ] },
  { id: 'v2', name: 'Diya Patel', mrn: 'Care episode', appt: 'Endocrinology', doctor: 'Dr. Sharma', status: 'Waiting', children: [
    { id: 'v2a', name: 'HbA1c', mrn: 'Lab', appt: 'Mar 05', doctor: 'Dr. Sharma', status: 'Completed' },
    { id: 'v2b', name: 'Diet counselling', mrn: 'Consult', appt: 'Mar 12', doctor: 'Dr. Sharma', status: 'Confirmed' },
  ] },
  { id: 'v3', name: 'Vihaan Reddy', mrn: 'Care episode', appt: 'General', doctor: 'Dr. Kapoor', status: 'Completed', children: [] },
];
export const NestedRows = {
  name: 'Nested Rows (expandable tree)',
  parameters: { docs: { description: { story: 'Pass `getSubRows(row)` to make rows expandable. A chevron appears in the first column (configurable via `expandColumnId`); children indent by depth and carry a faint tint. Selection cascades to descendants.' } } },
  render: () => {
    const columns = [
      { id: 'name', header: 'Episode / Visit', type: 'text', minWidth: 260, primary: (r) => r.name, secondary: (r) => r.mrn, leftIcon: <TPIcon name="profile" variant="bulk" size={18} /> },
      { id: 'appt', header: 'Detail', type: 'text', minWidth: 180, primary: (r) => r.appt },
      { id: 'doctor', header: 'Doctor', type: 'text', minWidth: 150, primary: (r) => r.doctor },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 130, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
    ];
    return (
      <div style={{ maxWidth: 880 }}>
        <DataTable columns={columns} data={NESTED} getSubRows={(r) => r.children} defaultExpandedKeys={['v1']} selectionMode="multiple" hoverable />
      </div>
    );
  },
};

// ── Grouped rows — collapsible group headers ──────────────────────────────────
export const GroupedRows = {
  name: 'Grouped Rows (collapsible)',
  parameters: { docs: { description: { story: 'Pass `groupBy(row)` to insert collapsible group header rows with a live count. `groupLabel` formats the header; group checkboxes (in multiple-select mode) toggle the whole group.' } } },
  render: () => {
    const columns = [
      patientCol(),
      { id: 'appt', header: 'Appointment', type: 'text', minWidth: 190, primary: (r) => r.appt, leftIcon: <TPIcon name="calendar-1" size={16} /> },
      { id: 'type', header: 'Type', type: 'tag', minWidth: 160, tag: (r) => ({ label: r.type, tone: 'neutral' }) },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 130, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
    ];
    return (
      <div style={{ maxWidth: 880 }}>
        <DataTable
          columns={columns}
          data={ROWS.slice(0, 12)}
          rowKey={(r) => r.mrn}
          groupBy={(r) => r.doctor}
          groupLabel={(g, rows) => `${g} · ${rows.length} patient${rows.length === 1 ? '' : 's'}`}
          selectionMode="multiple"
          hoverable
        />
      </div>
    );
  },
};

// ── Spanning rows — merge vertically-adjacent equal values ────────────────────
export const SpanningRows = {
  name: 'Spanning Rows (merged cells)',
  parameters: { docs: { description: { story: 'Set `spanRows` on a column to merge vertically-adjacent cells that share the same value into one tall cell — ideal for a repeated grouping key. Data is sorted by doctor first so the runs are contiguous.' } } },
  render: () => {
    const byDoctor = [...ROWS].sort((a, b) => a.doctor.localeCompare(b.doctor)).slice(0, 12);
    const columns = [
      { id: 'doctor', header: 'Doctor', type: 'text', minWidth: 160, spanRows: true, spanAccessor: (r) => r.doctor, cellClassName: undefined,
        primary: (r) => r.doctor, leftIcon: <TPIcon name="profile" variant="bulk" size={18} /> },
      patientCol(),
      { id: 'appt', header: 'Appointment', type: 'text', minWidth: 180, primary: (r) => r.appt },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 130, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
    ];
    return (
      <div style={{ maxWidth: 900 }}>
        <DataTable columns={columns} data={byDoctor} rowKey={(r) => r.mrn} bordered hoverable />
      </div>
    );
  },
};

// ── Action tracking — opt-in analytics across the whole table ──────────────────
export const ActionTracking = {
  name: 'Action Tracking (analytics)',
  parameters: { docs: { description: { story: 'Wrap any subtree in `<TPAnalyticsProvider onTrack={…}>` and every interaction flows to your sink — for free. The `DataTable` emits `sort` / `select_row` / `select_all` / `row_click` / `page_change` (gated by `analyticsId`); each `Button` in the action cell emits `click` / `menu_select` (via its `track` id). No provider → zero events, zero overhead. Interact with the table below to watch the live event stream.' } } },
  render: () => {
    const [log, setLog] = React.useState([]);
    const columns = [
      patientCol(),
      { id: 'appt', header: 'Appointment', type: 'text', minWidth: 190, sortable: true, sortAccessor: (r) => r.minutes, primary: (r) => r.appt, secondary: (r) => r.doctor, leftIcon: <TPIcon name="calendar-1" size={16} /> },
      { id: 'status', header: 'Status', type: 'tag', minWidth: 130, sortable: true, sortAccessor: (r) => r.status, tag: (r) => ({ label: r.status, tone: STATUS_TO_TONE[r.status] }) },
      { id: 'actions', header: 'Actions', type: 'action', sticky: 'right', width: 200, align: 'right', actions: () => <Actions /> },
    ];
    return (
      <TPAnalyticsProvider
        context={{ surface: 'rxpad.patients' }}
        onTrack={(e) => setLog((l) => [{ ...e, at: new Date(e.timestamp).toLocaleTimeString() }, ...l].slice(0, 12))}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 16, alignItems: 'start', maxWidth: 1100 }}>
          <DataTable
            columns={columns}
            data={ROWS.slice(0, 8)}
            rowKey={(r) => r.mrn}
            analyticsId="patients_table"
            selectionMode="multiple"
            sortable
            hoverable
            onRowClick={() => {}}
          />
          <div style={{ fontFamily: 'Inter, sans-serif', border: '1px solid var(--tp-slate-200, #e2e2ea)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '10px 12px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--tp-slate-600,#56566a)', background: 'var(--tp-slate-50,#fafafb)', borderBottom: '1px solid var(--tp-slate-200,#e2e2ea)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Event stream</span>
              {log.length > 0 && <button type="button" onClick={() => setLog([])} style={{ border: 'none', background: 'none', color: 'var(--tp-blue-500,#2f6fed)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Clear</button>}
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {log.length === 0 ? (
                <div style={{ padding: 16, fontSize: 13, color: 'var(--tp-slate-400,#9c9caa)' }}>Sort, select, click a row, or use the action buttons…</div>
              ) : log.map((e, i) => (
                <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid var(--tp-slate-100,#f1f1f4)', fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: 'var(--tp-slate-800,#2c2c38)' }}>{e.component}·{e.action}</span>
                    <span style={{ color: 'var(--tp-slate-400,#9c9caa)', fontVariantNumeric: 'tabular-nums' }}>{e.at}</span>
                  </div>
                  <div style={{ color: 'var(--tp-slate-500,#717185)', marginTop: 2, fontFamily: 'ui-monospace, monospace', fontSize: 11, wordBreak: 'break-all' }}>
                    {[e.id, e.label, e.value != null ? `=${e.value}` : null].filter(Boolean).join(' · ') || '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TPAnalyticsProvider>
    );
  },
};
