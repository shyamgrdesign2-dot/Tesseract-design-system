import React from 'react';
import { ClinicalTable } from './ClinicalTable';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/ClinicalTable',
  component: ClinicalTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Editable RxPad table — every cell is its own input box, composed from the design-system atoms: free-text / numeric cells reuse the **InputBox** atom (`variant="seamless"`); dropdown + search cells reuse the **Dropdown** molecule (`variant="seamless"`). A `search` cell is an editable combobox (type to filter, a "Frequently used" header, "Add ‹custom›", ↑↓↵Esc) with **no chevron**; a `select` cell is pick-from-list **with** a chevron. Cells show a blue focus ring + per-cell status rings (success / error / warning) via `column.validate`.\n\nFixed skeleton (always present): drag-reorder · **Name** (primary search) · …configurable `columns`… · **Notes** (free text) · **Action** (⋯ menu + delete). **Name** is the primary key — a row\'s other cells stay locked until it is filled, and the next draft row only opens after it. The action column pins right with a left fade that appears only while content is scrolled behind it.' } },
  },
  argTypes: {
    reorderable: { control: 'boolean', table: { category: 'Actions' } },
    deletable: { control: 'boolean', description: 'Delete button in the action column', table: { category: 'Actions' } },
    showRowMenu: { control: 'boolean', name: 'row ⋯ menu', description: 'Show the three-dots row-actions menu (independent of delete)', table: { category: 'Actions' } },
    autoRow: { control: 'boolean', name: 'auto empty row' },
    flagCustom: { control: 'boolean', name: 'flag custom names', description: 'Ring the Symptoms Name cell when the entry is not in the frequently-used list (a custom / off-database value)' },
  },
  args: { reorderable: true, deletable: true, showRowMenu: true, autoRow: true, flagCustom: false },
};

export default meta;

const FREQUENT_SYMPTOMS = ['Fever', 'Cough', 'Chest pain', 'Shortness of breath', 'Headache', 'Fatigue', 'Nausea', 'Abdominal pain', 'Dizziness', 'Joint pain'];
const SINCE = ['1 day', '2 days', '3 days', '1 week', '2 weeks', '1 month'];
const STATUS = ['Mild', 'Moderate', 'Severe', 'Improving', 'Worsening'];

// The primary "Name" + trailing "Notes" columns are part of the fixed skeleton —
// pass only the CONFIGURABLE middle columns here.
const SYMPTOM_NAME = { header: 'Symptoms Name', options: FREQUENT_SYMPTOMS, frequentlyUsedLabel: 'Frequently used' };
const MIDDLE_COLUMNS = [
  { id: 'since', header: 'Since', type: 'select', placeholder: 'Select', options: SINCE, minWidth: 120, maxWidth: 140 },
  { id: 'status', header: 'Status', type: 'select', placeholder: 'Select', options: STATUS, minWidth: 135, maxWidth: 170 },
];

const SEED = [
  { id: 's1', name: 'Chest pain', since: '2 days', status: 'Moderate', notes: 'On exertion' },
  { id: 's2', name: 'Shortness of breath', since: '1 week', status: 'Mild', notes: '' },
  { id: 's3', name: 'Dizziness', since: '3 days', status: 'Severe', notes: 'Morning' },
];

export const Playground = {
  render: ({ flagCustom, ...args }) => {
    const [rows, setRows] = React.useState(SEED);
    // `flagCustom` is opt-in: when on, a Name not in the frequently-used list
    // (custom / off-database) gets a warning ring.
    const nameCol = { ...SYMPTOM_NAME, flagCustom: flagCustom ? 'warning' : undefined };
    return (
      <div style={{ maxWidth: 820 }}>
        <ClinicalTable {...args} name={nameCol} columns={MIDDLE_COLUMNS} rows={rows} onChange={setRows} />
        <pre style={{ marginTop: 16, fontSize: 12, color: 'var(--tp-slate-500, #717179)' }}>{JSON.stringify(rows, null, 2)}</pre>
      </div>
    );
  },
};

/** Configurable middle columns — free text · numeric · date · dropdown ·
 *  searchable dropdown · icon. Name (search) and Notes (text) are fixed. */
export const ColumnTypes = {
  render: () => {
    const [rows, setRows] = React.useState([
      { id: 'm1', name: 'Amoxicillin', dose: '500', freq: '1-0-1', start: '2026-06-09', since: '3 days', notes: 'After food' },
    ]);
    const columns = [
      { id: 'dose', header: 'Dose (mg)', type: 'number', placeholder: '0', align: 'right', minWidth: 96, maxWidth: 110 },
      { id: 'freq', header: 'Frequency', type: 'select', searchable: true, placeholder: 'e.g. 1-0-1', options: ['1-0-0', '0-0-1', '1-0-1', '1-1-1'], minWidth: 120, maxWidth: 140 },
      { id: 'start', header: 'Start date', type: 'date', minWidth: 150, maxWidth: 170 },
      { id: 'since', header: 'Since', type: 'select', placeholder: 'Select', options: SINCE, icon: <TPLibraryIcon name="calendar-1" size={15} />, minWidth: 140, maxWidth: 160 },
    ];
    return (
      <div style={{ maxWidth: 980 }}>
        <ClinicalTable name={{ header: 'Medicine', options: ['Amoxicillin', 'Paracetamol', 'Azithromycin', 'Ibuprofen'], frequentlyUsedLabel: 'Frequently used' }} columns={columns} rows={rows} onChange={setRows} />
      </div>
    );
  },
};

/** Action column — pins right with a left fade/shadow that appears ONLY while
 *  content is scrolled behind it. Shrink the 460px frame and scroll sideways. */
export const StickyActions = {
  render: () => {
    const [rows, setRows] = React.useState(SEED);
    return (
      <div style={{ maxWidth: 460, border: '1px dashed var(--tp-slate-200,#e2e2ea)', padding: 8, borderRadius: 12 }}>
        <ClinicalTable name={SYMPTOM_NAME} columns={MIDDLE_COLUMNS} rows={rows} onChange={setRows} rowMenu={[{ label: 'Duplicate', icon: <TPLibraryIcon name="copy" size={15} /> }, { label: 'Clear row', icon: <TPLibraryIcon name="eraser" size={15} />, danger: true, onClick: () => {} }]} />
        <p style={{ fontSize: 12, color: 'var(--tp-slate-500,#717179)', marginTop: 8 }}>Scroll the table sideways — the actions column stays pinned and the left fade appears only while content sits behind it.</p>
      </div>
    );
  },
};

/** Empty table — just the auto draft row. The Name cell (a search, no chevron)
 *  is the only editable cell until it is filled; the rest stay locked. */
export const Empty = {
  render: () => {
    const [rows, setRows] = React.useState([]);
    return <div style={{ maxWidth: 820 }}><ClinicalTable name={SYMPTOM_NAME} columns={MIDDLE_COLUMNS} rows={rows} onChange={setRows} /></div>;
  },
};

/** Opt-in custom-entry flag — set `flagCustom` on the search column to ring any
 *  Name that isn't in the frequently-used list (a custom / off-database value).
 *  Here "Chest pain" is known (no ring) while "Random ache xyz" is flagged. */
export const FlaggedCustomEntry = {
  name: 'Flag custom (off-database) names',
  render: () => {
    const [rows, setRows] = React.useState([
      { id: 'f1', name: 'Chest pain', since: '2 days', status: 'Moderate', notes: '' },
      { id: 'f2', name: 'Random ache xyz', since: '1 day', status: 'Mild', notes: 'Not in list' },
    ]);
    const nameCol = { ...SYMPTOM_NAME, flagCustom: 'warning' };
    return <div style={{ maxWidth: 820 }}><ClinicalTable name={nameCol} columns={MIDDLE_COLUMNS} rows={rows} onChange={setRows} /></div>;
  },
};

/**
 * Configuring columns — the middle columns are driven entirely by a JSON-able
 * array passed to `columns`. Each entry sets a `type` (the cell renderer) plus a
 * few optional keys. Copy the shape below to add your own column. (Name = search
 * and Notes = free-text are part of the fixed skeleton; override them via the
 * `name` / `notes` props.)
 */
const COLUMN_TYPES = [
  ['text', 'Free-text input (InputBox).'],
  ['number', 'Numeric input (digits only).'],
  ['date', 'Native date picker (type="date").'],
  ['select', 'Pick-from-list dropdown (chevron). Add `searchable` to filter.'],
  ['search', 'Editable combobox: type to filter, "Frequently used" header, "Add ‹custom›", key hints. Set `allowCustom`/`flagCustom`.'],
];
// The exact config rendered by the live table below — copy this to add a column.
const EXAMPLE_COLUMNS = [
  { id: 'dose', header: 'Dose (mg)', type: 'number', placeholder: '0', align: 'right' },
  { id: 'route', header: 'Route', type: 'select', placeholder: 'Select', options: ['Oral', 'IV', 'Topical', 'Inhaled'] },
  { id: 'start', header: 'Start date', type: 'date' },
];
export const ConfiguringColumns = {
  name: 'Configuring columns (how-to)',
  render: () => {
    const [rows, setRows] = React.useState([{ id: 'c1', name: 'Amoxicillin', dose: '500', route: 'Oral', start: '2026-06-09', notes: '' }]);
    const code = `<ClinicalTable\n  name={{ header: 'Medicine', options: [...], frequentlyUsedLabel: 'Frequently used' }}\n  columns={${JSON.stringify(EXAMPLE_COLUMNS, null, 2)}}\n  rows={rows} onChange={setRows}\n/>`;
    const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 };
    return (
      <div style={{ maxWidth: 920, display: 'grid', gap: 16 }}>
        <ClinicalTable name={{ header: 'Medicine', options: ['Amoxicillin', 'Paracetamol', 'Azithromycin', 'Ibuprofen'], frequentlyUsedLabel: 'Frequently used' }} columns={EXAMPLE_COLUMNS} rows={rows} onChange={setRows} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--tp-slate-500,#717179)', marginBottom: 6 }}>Available column types</div>
          <ul style={{ ...mono, margin: 0, paddingLeft: 18, color: 'var(--tp-slate-700,#454551)', lineHeight: 1.7 }}>
            {COLUMN_TYPES.map(([t, desc]) => (<li key={t}><strong>{t}</strong> — {desc}</li>))}
          </ul>
        </div>
        <pre style={{ ...mono, margin: 0, padding: 14, borderRadius: 10, background: 'var(--tp-slate-50,#f8fafc)', border: '1px solid var(--tp-slate-100,#f1f1f5)', color: 'var(--tp-slate-800,#27272a)', overflowX: 'auto' }}>{code}</pre>
      </div>
    );
  },
};
