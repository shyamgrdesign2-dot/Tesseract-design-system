import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from './Table';
import { Eye, Pencil, Trash2, ClipboardList } from '@/src/components/atoms/icons/lucide';

const meta = {
  title: 'Molecules/Table',
  component: Table,
  tags: ['autodocs', 'ai-generated'],
};

export default meta;

const PATIENTS = [
  { id: 1, name: 'Aarav Sharma',    mrn: 'MRN-001', age: 42, gender: 'M', blood: 'B+',  visit: '12 May 2026', doctor: 'Dr. Mehta',  status: 'Active',     dept: 'Cardiology' },
  { id: 2, name: 'Diya Patel',      mrn: 'MRN-002', age: 35, gender: 'F', blood: 'O+',  visit: '08 May 2026', doctor: 'Dr. Sharma', status: 'Follow-up',  dept: 'Neurology'  },
  { id: 3, name: 'Vihaan Reddy',    mrn: 'MRN-003', age: 57, gender: 'M', blood: 'A+',  visit: '02 May 2026', doctor: 'Dr. Singh',  status: 'Discharged', dept: 'Ortho'      },
  { id: 4, name: 'Ananya Krishnan', mrn: 'MRN-004', age: 29, gender: 'F', blood: 'AB-', visit: '28 Apr 2026', doctor: 'Dr. Gupta',  status: 'Active',     dept: 'Gynecology' },
  { id: 5, name: 'Rohan Nair',      mrn: 'MRN-005', age: 63, gender: 'M', blood: 'O-',  visit: '25 Apr 2026', doctor: 'Dr. Mehta',  status: 'Critical',   dept: 'ICU'        },
];

const STATUS_STYLES = {
  Active:     { background: '#DCFCE7', color: '#15803D' },
  'Follow-up':{ background: '#FEF3C7', color: '#B45309' },
  Discharged: { background: '#F1F5F9', color: '#475569' },
  Critical:   { background: '#FEE2E2', color: '#B91C1C' },
};

const StatusChip = ({ status, rounded }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: rounded ? 99 : 4,
      fontSize: 12,
      fontWeight: 600,
      ...STATUS_STYLES[status],
    }}
  >
    {status}
  </span>
);

const COLS = ['Name', 'MRN', 'Age', 'Dept', 'Doctor', 'Last Visit', 'Status'];

const HeaderRow = () => (
  <TableRow>
    {COLS.map((col) => (
      <TableCell
        key={col}
        component="th"
        align={col === 'Age' ? 'right' : 'left'}
        style={{
          fontWeight: 700,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--tp-slate-500, #54545C)',
          background: 'var(--tp-slate-50, #F8FAFC)',
        }}
      >
        {col}
      </TableCell>
    ))}
  </TableRow>
);

/** Full patient table with status chips. */
export const Playground = {
  render: () => (
    <Table>
      <TableHead>
        <HeaderRow />
      </TableHead>
      <TableBody>
        {PATIENTS.map((p) => (
          <TableRow key={p.id}>
            <TableCell style={{ fontWeight: 600 }}>{p.name}</TableCell>
            <TableCell style={{ color: 'var(--tp-slate-400, #A1A1AA)', fontFamily: 'monospace' }}>{p.mrn}</TableCell>
            <TableCell align="right">{p.age}</TableCell>
            <TableCell>{p.dept}</TableCell>
            <TableCell>{p.doctor}</TableCell>
            <TableCell>{p.visit}</TableCell>
            <TableCell><StatusChip status={p.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Status chips with pill (border-radius 99px) styling. */
export const WithStatusChips = {
  render: () => (
    <Table>
      <TableHead>
        <HeaderRow />
      </TableHead>
      <TableBody>
        {PATIENTS.map((p) => (
          <TableRow key={p.id}>
            <TableCell style={{ fontWeight: 600 }}>{p.name}</TableCell>
            <TableCell style={{ color: 'var(--tp-slate-400, #A1A1AA)', fontFamily: 'monospace' }}>{p.mrn}</TableCell>
            <TableCell align="right">{p.age}</TableCell>
            <TableCell>{p.dept}</TableCell>
            <TableCell>{p.doctor}</TableCell>
            <TableCell>{p.visit}</TableCell>
            <TableCell><StatusChip status={p.status} rounded /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Rohan Nair's row is selected (highlighted). */
export const WithSelectedRow = {
  render: () => (
    <Table>
      <TableHead>
        <HeaderRow />
      </TableHead>
      <TableBody>
        {PATIENTS.map((p) => (
          <TableRow key={p.id} selected={p.name === 'Rohan Nair'}>
            <TableCell style={{ fontWeight: 600 }}>{p.name}</TableCell>
            <TableCell style={{ color: 'var(--tp-slate-400, #A1A1AA)', fontFamily: 'monospace' }}>{p.mrn}</TableCell>
            <TableCell align="right">{p.age}</TableCell>
            <TableCell>{p.dept}</TableCell>
            <TableCell>{p.doctor}</TableCell>
            <TableCell>{p.visit}</TableCell>
            <TableCell><StatusChip status={p.status} rounded /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Table with icon action buttons (View, Edit, Delete) per row. */
export const WithActions = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          {[...COLS, 'Actions'].map((col) => (
            <TableCell
              key={col}
              component="th"
              align={col === 'Age' ? 'right' : 'left'}
              style={{
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--tp-slate-500, #54545C)',
                background: 'var(--tp-slate-50, #F8FAFC)',
              }}
            >
              {col}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {PATIENTS.map((p) => (
          <TableRow key={p.id}>
            <TableCell style={{ fontWeight: 600 }}>{p.name}</TableCell>
            <TableCell style={{ color: 'var(--tp-slate-400, #A1A1AA)', fontFamily: 'monospace' }}>{p.mrn}</TableCell>
            <TableCell align="right">{p.age}</TableCell>
            <TableCell>{p.dept}</TableCell>
            <TableCell>{p.doctor}</TableCell>
            <TableCell>{p.visit}</TableCell>
            <TableCell><StatusChip status={p.status} rounded /></TableCell>
            <TableCell>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  title="View"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--tp-slate-500, #54545C)', display: 'flex' }}
                >
                  <Eye size={14} />
                </button>
                <button
                  title="Edit"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--tp-slate-500, #54545C)', display: 'flex' }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  title="Delete"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#B91C1C', display: 'flex' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Click Name or Age column headers to sort. */
export const WithSortHeaders = {
  render: () => {
    const [sortCol, setSortCol] = React.useState(null);
    const [sortDir, setSortDir] = React.useState('asc');

    const handleSort = (col) => {
      if (sortCol === col) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortCol(col);
        setSortDir('asc');
      }
    };

    const sorted = [...PATIENTS].sort((a, b) => {
      if (!sortCol) return 0;
      const key = sortCol === 'Name' ? 'name' : 'age';
      const va = a[key];
      const vb = b[key];
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    const SortableHeader = ({ col, children, align }) => {
      const active = sortCol === col;
      return (
        <TableCell
          component="th"
          align={align || 'left'}
          style={{
            fontWeight: 700,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: active ? 'var(--tp-blue-600, #2563EB)' : 'var(--tp-slate-500, #54545C)',
            background: 'var(--tp-slate-50, #F8FAFC)',
            cursor: 'pointer',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
          onClick={() => handleSort(col)}
        >
          {children}
          {active && (
            <span style={{ marginLeft: 4, fontSize: 10 }}>
              {sortDir === 'asc' ? '▲' : '▼'}
            </span>
          )}
          {!active && <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.3 }}>⇅</span>}
        </TableCell>
      );
    };

    return (
      <Table>
        <TableHead>
          <TableRow>
            <SortableHeader col="Name">Name</SortableHeader>
            <TableCell
              component="th"
              style={{
                fontWeight: 700, fontSize: 12, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--tp-slate-500, #54545C)',
                background: 'var(--tp-slate-50, #F8FAFC)',
              }}
            >
              MRN
            </TableCell>
            <SortableHeader col="Age" align="right">Age</SortableHeader>
            {['Dept', 'Doctor', 'Last Visit', 'Status'].map((col) => (
              <TableCell
                key={col}
                component="th"
                style={{
                  fontWeight: 700, fontSize: 12, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: 'var(--tp-slate-500, #54545C)',
                  background: 'var(--tp-slate-50, #F8FAFC)',
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((p) => (
            <TableRow key={p.id}>
              <TableCell style={{ fontWeight: 600 }}>{p.name}</TableCell>
              <TableCell style={{ color: 'var(--tp-slate-400, #A1A1AA)', fontFamily: 'monospace' }}>{p.mrn}</TableCell>
              <TableCell align="right">{p.age}</TableCell>
              <TableCell>{p.dept}</TableCell>
              <TableCell>{p.doctor}</TableCell>
              <TableCell>{p.visit}</TableCell>
              <TableCell><StatusChip status={p.status} rounded /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

/** No data empty state with icon and clear filters button. */
export const Empty = {
  render: () => (
    <Table>
      <TableHead>
        <HeaderRow />
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell
            align="center"
            colSpan={7}
            style={{ padding: '48px 12px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <ClipboardList size={36} style={{ color: 'var(--tp-slate-300, #D4D4D8)' }} />
              <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: 'var(--tp-slate-500, #54545C)' }}>
                No patients found
              </p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--tp-slate-400, #A1A1AA)' }}>
                Try adjusting your search or filter criteria.
              </p>
              <button
                style={{
                  marginTop: 4,
                  padding: '6px 16px',
                  borderRadius: 6,
                  border: '1px solid var(--tp-slate-300, #D4D4D8)',
                  background: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--tp-slate-700, #3F3F46)',
                }}
              >
                Clear filters
              </button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/** Same data with compact 12px font and tighter row padding. */
export const CompactDense = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          {COLS.map((col) => (
            <TableCell
              key={col}
              component="th"
              align={col === 'Age' ? 'right' : 'left'}
              style={{
                fontWeight: 700,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--tp-slate-500, #54545C)',
                background: 'var(--tp-slate-50, #F8FAFC)',
                padding: '6px 10px',
              }}
            >
              {col}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {PATIENTS.map((p) => (
          <TableRow key={p.id}>
            <TableCell padding="none" style={{ padding: '5px 10px', fontSize: 12, fontWeight: 600 }}>{p.name}</TableCell>
            <TableCell padding="none" style={{ padding: '5px 10px', fontSize: 12, color: 'var(--tp-slate-400, #A1A1AA)', fontFamily: 'monospace' }}>{p.mrn}</TableCell>
            <TableCell padding="none" style={{ padding: '5px 10px', fontSize: 12, textAlign: 'right' }}>{p.age}</TableCell>
            <TableCell padding="none" style={{ padding: '5px 10px', fontSize: 12 }}>{p.dept}</TableCell>
            <TableCell padding="none" style={{ padding: '5px 10px', fontSize: 12 }}>{p.doctor}</TableCell>
            <TableCell padding="none" style={{ padding: '5px 10px', fontSize: 12 }}>{p.visit}</TableCell>
            <TableCell padding="none" style={{ padding: '5px 10px', fontSize: 12 }}>
              <StatusChip status={p.status} rounded />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
