import React from 'react';
import { ClinicalTable } from './ClinicalTable';

const meta = {
  title: 'Molecules/ClinicalTable',
  component: ClinicalTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Editable RxPad table — like DataTable, but every cell is editable inline (free-text input or a combobox dropdown: type a value or pick from `options`). Optional side columns for drag-to-reorder and delete, plus an auto-appended empty row so there is always a place to add the next entry. Columns are fully configurable (type / options / placeholder / width).' } },
  },
  argTypes: {
    reorderable: { control: 'boolean' },
    deletable: { control: 'boolean' },
    autoRow: { control: 'boolean', name: 'auto empty row' },
  },
  args: { reorderable: true, deletable: true, autoRow: true },
};

export default meta;

// The Symptoms module columns: name + note are free text; since + status are
// comboboxes (type or pick).
const SYMPTOM_COLUMNS = [
  { id: 'name', header: 'Symptoms Name', type: 'text', placeholder: 'e.g. Fever', minWidth: 220, maxWidth: 320 },
  { id: 'since', header: 'Since', type: 'select', placeholder: 'e.g. 2 days', minWidth: 120, maxWidth: 140,
    options: ['1 day', '2 days', '3 days', '1 week', '2 weeks', '1 month'] },
  { id: 'status', header: 'Status', type: 'select', placeholder: 'e.g. Moderate', minWidth: 135, maxWidth: 170,
    options: ['Mild', 'Moderate', 'Severe', 'Improving', 'Worsening'] },
  { id: 'note', header: 'Note', type: 'text', placeholder: 'Notes', minWidth: 140, maxWidth: 220 },
];

const SEED = [
  { id: 's1', name: 'Chest pain', since: '2 days', status: 'Moderate', note: 'On exertion' },
  { id: 's2', name: 'Shortness of breath', since: '1 week', status: 'Mild', note: '' },
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

/** Empty table — just the auto-row, ready to type into. */
export const Empty = {
  render: () => {
    const [rows, setRows] = React.useState([]);
    return <div style={{ maxWidth: 760 }}><ClinicalTable columns={SYMPTOM_COLUMNS} rows={rows} onChange={setRows} /></div>;
  },
};

/** Read-only-ish: no reorder / delete / auto-row (display + edit values only). */
export const Plain = {
  render: () => {
    const [rows, setRows] = React.useState(SEED);
    return <div style={{ maxWidth: 680 }}><ClinicalTable columns={SYMPTOM_COLUMNS} rows={rows} onChange={setRows} reorderable={false} deletable={false} autoRow={false} /></div>;
  },
};
