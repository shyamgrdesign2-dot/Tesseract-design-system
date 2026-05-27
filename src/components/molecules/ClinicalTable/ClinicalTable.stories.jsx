import React from 'react';
import { ClinicalTable } from './index.js';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/ClinicalTable',
  component: ClinicalTable,
  tags: ['autodocs', 'ai-generated'],
};

export default meta;

const DATA = [
  { id: 'p1', name: 'Aarav Sharma', age: 42, condition: 'Hypertension', visit: '12 May 2026' },
  { id: 'p2', name: 'Diya Patel', age: 35, condition: 'Diabetes', visit: '08 May 2026' },
  { id: 'p3', name: 'Vihaan Reddy', age: 57, condition: 'Asthma', visit: '02 May 2026' },
  { id: 'p4', name: 'Ananya Iyer', age: 29, condition: 'Migraine', visit: '28 Apr 2026' },
];

const COLUMNS = [
  {
    id: 'name',
    header: 'Patient',
    sortable: true,
    sortValue: (r) => r.name,
    accessor: (r) => r.name,
    minWidth: '180px',
  },
  {
    id: 'age',
    header: 'Age',
    align: 'right',
    sortable: true,
    sortValue: (r) => r.age,
    accessor: (r) => r.age,
    width: '80px',
  },
  {
    id: 'condition',
    header: 'Condition',
    accessor: (r) => r.condition,
    minWidth: '160px',
  },
  {
    id: 'visit',
    header: 'Last Visit',
    sortable: true,
    sortValue: (r) => r.visit,
    accessor: (r) => r.visit,
    minWidth: '140px',
  },
];

const rowKey = (r) => r.id;

/** Default sortable table. Click sortable headers to cycle asc/desc/off. */
export const Playground = {
  render: () => <ClinicalTable columns={COLUMNS} data={DATA} rowKey={rowKey} />,
};

/** Selectable rows with controlled selection state. */
export const Selectable = {
  render: () => {
    const [selected, setSelected] = React.useState(['p2']);
    return (
      <ClinicalTable
        columns={COLUMNS}
        data={DATA}
        rowKey={rowKey}
        selectable
        selectedRows={selected}
        onRowSelect={setSelected}
      />
    );
  },
};

/** Sticky action column on the right. */
export const WithActionColumn = {
  render: () => {
    const columns = [
      ...COLUMNS,
      {
        id: 'action',
        header: 'Action',
        sticky: true,
        accessor: () => (
          <Button variant="outline" size="sm">
            View
          </Button>
        ),
      },
    ];
    return <ClinicalTable columns={columns} data={DATA} rowKey={rowKey} />;
  },
};

/** Loading skeleton. */
export const Loading = {
  render: () => <ClinicalTable columns={COLUMNS} data={[]} rowKey={rowKey} loading />,
};

/** Empty state with custom message. */
export const Empty = {
  render: () => (
    <ClinicalTable
      columns={COLUMNS}
      data={[]}
      rowKey={rowKey}
      emptyMessage="No patients match your filters"
    />
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

const LAB_DATA = [
  { id: 'r1', test: 'Serum K+', result: '6.8', unit: 'mEq/L', ref: '3.5–5.0', status: 'critical', date: '15 May 2026' },
  { id: 'r2', test: 'HbA1c', result: '7.2', unit: '%', ref: '< 5.7', status: 'high', date: '15 May 2026' },
  { id: 'r3', test: 'Creatinine', result: '0.9', unit: 'mg/dL', ref: '0.7–1.3', status: 'normal', date: '15 May 2026' },
  { id: 'r4', test: 'LDL Cholesterol', result: '142', unit: 'mg/dL', ref: '< 100', status: 'high', date: '10 May 2026' },
  { id: 'r5', test: 'Haemoglobin', result: '13.8', unit: 'g/dL', ref: '13.5–17.5', status: 'normal', date: '10 May 2026' },
  { id: 'r6', test: 'Troponin I', result: '0.04', unit: 'ng/mL', ref: '< 0.04', status: 'critical', date: '15 May 2026' },
];

const statusChip = (status) => {
  const map = { critical: ['#E11D48', '#FFE4E6'], high: ['#D97706', '#FEF3C7'], normal: ['#16A34A', '#DCFCE7'] };
  const [color, bg] = map[status] || ['#717179', '#F1F5F9'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: bg, color, fontFamily: 'Inter, sans-serif' }}>
      {status === 'critical' ? '⚠ Critical' : status === 'high' ? '↑ High' : '✓ Normal'}
    </span>
  );
};

const LAB_COLUMNS = [
  { id: 'test', header: 'Test', accessor: (r) => r.test, minWidth: '160px', sortable: true, sortValue: (r) => r.test },
  { id: 'result', header: 'Result', align: 'right', accessor: (r) => <span style={{ fontWeight: 600, color: r.status === 'critical' ? '#E11D48' : r.status === 'high' ? '#D97706' : '#171725', fontFamily: 'Inter, sans-serif' }}>{r.result}</span>, width: '80px' },
  { id: 'unit', header: 'Unit', accessor: (r) => <span style={{ fontSize: 12, color: '#717179', fontFamily: 'Inter, sans-serif' }}>{r.unit}</span>, width: '80px' },
  { id: 'ref', header: 'Reference', accessor: (r) => <span style={{ fontSize: 12, color: '#A2A2A8', fontFamily: 'Inter, sans-serif' }}>{r.ref}</span>, minWidth: '120px' },
  { id: 'status', header: 'Status', accessor: (r) => statusChip(r.status), width: '110px' },
  { id: 'date', header: 'Date', accessor: (r) => <span style={{ fontSize: 12, color: '#717179', fontFamily: 'Inter, sans-serif' }}>{r.date}</span>, minWidth: '120px', sortable: true, sortValue: (r) => r.date },
];

/** Lab results with colour-coded status chips and sortable columns. */
export const LabResults = {
  name: '🧪 Lab Results',
  render: () => (
    <ClinicalTable
      columns={LAB_COLUMNS}
      data={LAB_DATA}
      rowKey={(r) => r.id}
    />
  ),
};

const RX_DATA = [
  { id: 'rx1', drug: 'Amlodipine', dose: '5 mg', freq: 'Once daily', duration: '30 days', status: 'Active', prescribed: '15 May 2026' },
  { id: 'rx2', drug: 'Atorvastatin', dose: '40 mg', freq: 'Once daily at night', duration: '90 days', status: 'Active', prescribed: '15 May 2026' },
  { id: 'rx3', drug: 'Aspirin', dose: '75 mg', freq: 'Once daily with food', duration: '90 days', status: 'Refill due', prescribed: '15 May 2026' },
  { id: 'rx4', drug: 'Metformin', dose: '500 mg', freq: 'Twice daily', duration: '60 days', status: 'Active', prescribed: '2 Apr 2026' },
  { id: 'rx5', drug: 'Simvastatin', dose: '20 mg', freq: 'Once daily', duration: '—', status: 'Discontinued', prescribed: '10 Jan 2026' },
];

const rxStatusChip = (status) => {
  const map = { Active: ['#16A34A', '#DCFCE7'], 'Refill due': ['#D97706', '#FEF3C7'], Discontinued: ['#717179', '#F1F5F9'] };
  const [color, bg] = map[status] || ['#717179', '#F1F5F9'];
  return <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: bg, color, fontFamily: 'Inter, sans-serif' }}>{status}</span>;
};

const RX_COLUMNS = [
  { id: 'drug', header: 'Drug', accessor: (r) => <span style={{ fontWeight: 600, color: '#171725', fontFamily: 'Inter, sans-serif' }}>{r.drug}</span>, minWidth: '140px', sortable: true, sortValue: (r) => r.drug },
  { id: 'dose', header: 'Dose', accessor: (r) => r.dose, width: '80px' },
  { id: 'freq', header: 'Frequency', accessor: (r) => <span style={{ fontSize: 12, color: '#454551', fontFamily: 'Inter, sans-serif' }}>{r.freq}</span>, minWidth: '160px' },
  { id: 'duration', header: 'Duration', accessor: (r) => r.duration, width: '90px' },
  { id: 'status', header: 'Status', accessor: (r) => rxStatusChip(r.status), width: '110px' },
  { id: 'action', header: '', sticky: true, accessor: () => <Button variant="ghost" size="sm">Refill</Button> },
];

/** Prescription list with status chips and refill CTA column. */
export const PrescriptionTable = {
  name: '💊 Prescription Table',
  render: () => {
    const [selected, setSelected] = React.useState([]);
    return (
      <ClinicalTable
        columns={RX_COLUMNS}
        data={RX_DATA}
        rowKey={(r) => r.id}
        selectable
        selectedRows={selected}
        onRowSelect={setSelected}
      />
    );
  },
};
