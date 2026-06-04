import React from 'react';
import { ClinicalTable } from './ClinicalTable';
import { Button } from '@/src/components/atoms/Button';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

const meta = {
  title: 'Molecules/ClinicalTable',
  component: ClinicalTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Editable RxPad table — every cell is its own input box. Per column, configure the cell as free text, a dropdown (`select`), a search combobox (`search`: type / filter / frequently-used / custom-add, keyboard nav), or an `action` cell. Cells show a blue focus stroke and per-cell status strokes (success / error / warning) via `column.validate`. An `action` column (sticky:"right") pins on small screens with a left fade/shadow when the table overflows. Side columns for drag-reorder + delete; an auto-empty row to add the next entry.' } },
  },
  argTypes: {
    reorderable: { control: 'boolean' },
    deletable: { control: 'boolean' },
    autoRow: { control: 'boolean', name: 'auto empty row' },
  },
  args: { reorderable: true, deletable: true, autoRow: true },
};

export default meta;

const FREQUENT_SYMPTOMS = ['Fever', 'Cough', 'Chest pain', 'Shortness of breath', 'Headache', 'Fatigue', 'Nausea', 'Abdominal pain', 'Dizziness', 'Joint pain'];
const SINCE = ['1 day', '2 days', '3 days', '1 week', '2 weeks', '1 month'];
const STATUS = ['Mild', 'Moderate', 'Severe', 'Improving', 'Worsening'];

// Status validation → per-cell stroke colour (success / warning / error).
const statusStroke = (v) => {
  if (v === 'Severe' || v === 'Worsening') return 'error';
  if (v === 'Moderate') return 'warning';
  if (v === 'Mild' || v === 'Improving') return 'success';
  return undefined;
};

const SYMPTOM_COLUMNS = [
  { id: 'name', header: 'Symptoms Name', type: 'search', placeholder: 'Search & add', options: FREQUENT_SYMPTOMS, allowCustom: true, minWidth: 220, maxWidth: 320 },
  { id: 'since', header: 'Since', type: 'select', placeholder: 'Select', options: SINCE, minWidth: 120, maxWidth: 140 },
  { id: 'status', header: 'Status', type: 'select', placeholder: 'Select', options: STATUS, minWidth: 135, maxWidth: 170, validate: statusStroke },
  { id: 'note', header: 'Note', type: 'text', placeholder: 'Notes', minWidth: 140, maxWidth: 220 },
];

const SEED = [
  { id: 's1', name: 'Chest pain', since: '2 days', status: 'Moderate', note: 'On exertion' },
  { id: 's2', name: 'Shortness of breath', since: '1 week', status: 'Mild', note: '' },
  { id: 's3', name: 'Dizziness', since: '3 days', status: 'Severe', note: 'Morning' },
];

export const Playground = {
  render: (args) => {
    const [rows, setRows] = React.useState(SEED);
    return (
      <div style={{ maxWidth: 760 }}>
        <ClinicalTable {...args} columns={SYMPTOM_COLUMNS} rows={rows} onChange={setRows} />
        <pre style={{ marginTop: 16, fontSize: 12, color: 'var(--tp-slate-500, #717179)' }}>{JSON.stringify(rows, null, 2)}</pre>
      </div>
    );
  },
};

/** A configurable column set: free text · dropdown · search · status strokes. */
export const ColumnTypes = {
  render: () => {
    const [rows, setRows] = React.useState(SEED);
    return <div style={{ maxWidth: 760 }}><ClinicalTable columns={SYMPTOM_COLUMNS} rows={rows} onChange={setRows} /></div>;
  },
};

/** Action column — pins right with a left fade/shadow when the table overflows.
 *  Shrink the window (or the 460px frame) to see it stick. */
export const StickyActions = {
  render: () => {
    const [rows, setRows] = React.useState(SEED);
    const columns = [
      ...SYMPTOM_COLUMNS,
      {
        id: 'actions',
        header: '',
        type: 'action',
        sticky: 'right',
        width: 96,
        render: () => (
          <>
            <Button variant="ghost" theme="neutral" size="sm" aria-label="Notes" icon={<TPIcon name="document" size={16} />} />
            <Button variant="ghost" theme="neutral" size="sm" aria-label="More" icon={<TPIcon name="more" variant="bold" size={16} style={{ transform: 'rotate(90deg)' }} />} />
          </>
        ),
      },
    ];
    return (
      <div style={{ maxWidth: 460, border: '1px dashed var(--tp-slate-200,#e2e2ea)', padding: 8, borderRadius: 12 }}>
        <ClinicalTable columns={columns} rows={rows} onChange={setRows} />
        <p style={{ fontSize: 12, color: 'var(--tp-slate-500,#717179)', marginTop: 8 }}>Scroll the table sideways — the actions column stays pinned with a left shadow.</p>
      </div>
    );
  },
};

/** Empty table — just the auto-row, ready to type into. */
export const Empty = {
  render: () => {
    const [rows, setRows] = React.useState([]);
    return <div style={{ maxWidth: 760 }}><ClinicalTable columns={SYMPTOM_COLUMNS} rows={rows} onChange={setRows} /></div>;
  },
};
