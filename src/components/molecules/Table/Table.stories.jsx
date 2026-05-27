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

// ── Healthcare-specific tables ───────────────────────────────────────────────

const VITALS = [
  { date: '27 May 2026', bp: '128/84', hr: 78, spo2: 98, temp: '37.1', weight: '72 kg', rr: 16, flag: null },
  { date: '20 May 2026', bp: '134/88', hr: 82, spo2: 97, temp: '37.4', weight: '73 kg', rr: 17, flag: 'high-bp' },
  { date: '13 May 2026', bp: '126/82', hr: 76, spo2: 99, temp: '36.9', weight: '72 kg', rr: 15, flag: null },
  { date: '06 May 2026', bp: '142/92', hr: 88, spo2: 96, temp: '38.1', weight: '74 kg', rr: 18, flag: 'elevated' },
  { date: '29 Apr 2026', bp: '122/80', hr: 74, spo2: 98, temp: '37.0', weight: '72 kg', rr: 16, flag: null },
];

/** Vitals trend table — colour-coded readings for BP, HR, and temperature outliers. */
export const VitalsTrend = {
  name: '📈 Vitals Trend',
  render: () => (
    <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: 740 }}>
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#171725' }}>Vital Signs — Rohan Sharma</span>
        <span style={{ fontSize: 12, color: '#54545C', marginLeft: 10 }}>Last 5 visits</span>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {['Date', 'BP (mmHg)', 'HR (bpm)', 'SpO₂ (%)', 'Temp (°C)', 'Weight', 'RR'].map((h) => (
              <TableCell key={h} component="th" style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#54545C', background: '#F8FAFC', whiteSpace: 'nowrap' }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {VITALS.map((v) => {
            const bpHigh = v.flag === 'high-bp' || v.flag === 'elevated';
            const tempHigh = parseFloat(v.temp) >= 38;
            const hrHigh = v.hr > 85;
            return (
              <TableRow key={v.date} style={{ background: v.flag ? '#FFFBEB' : undefined }}>
                <TableCell style={{ fontSize: 13, color: '#54545C', whiteSpace: 'nowrap' }}>{v.date}</TableCell>
                <TableCell style={{ fontSize: 14, fontWeight: 600, color: bpHigh ? '#92400E' : '#171725' }}>{v.bp} {bpHigh && <span style={{ fontSize: 10, marginLeft: 4 }}>↑</span>}</TableCell>
                <TableCell style={{ fontSize: 14, fontWeight: 500, color: hrHigh ? '#92400E' : '#171725' }}>{v.hr}</TableCell>
                <TableCell style={{ fontSize: 14, fontWeight: 500, color: v.spo2 < 97 ? '#9F1239' : '#15803D' }}>{v.spo2}</TableCell>
                <TableCell style={{ fontSize: 14, fontWeight: 500, color: tempHigh ? '#9F1239' : '#171725' }}>{v.temp} {tempHigh && <span style={{ fontSize: 10 }}>↑</span>}</TableCell>
                <TableCell style={{ fontSize: 13, color: '#54545C' }}>{v.weight}</TableCell>
                <TableCell style={{ fontSize: 13, color: '#54545C' }}>{v.rr}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div style={{ marginTop: 8, fontSize: 11, color: '#8F8FA0', display: 'flex', gap: 14 }}>
        <span>↑ Above normal range</span>
        <span style={{ color: '#FEF3C7', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '1px 6px', borderRadius: 4, color: '#92400E' }}>Yellow row = flagged reading</span>
      </div>
    </div>
  ),
};

const BILLING = [
  { id: 'INV-001', service: 'Consultation — Dr. Ananya Mehta', date: '27 May 2026', amount: 800,  status: 'Paid',    mode: 'UPI' },
  { id: 'INV-002', service: 'ECG + Interpretation',             date: '27 May 2026', amount: 1200, status: 'Paid',    mode: 'Card' },
  { id: 'INV-003', service: 'Lipid Profile (Lab)',               date: '27 May 2026', amount: 950,  status: 'Pending', mode: '—' },
  { id: 'INV-004', service: 'Echocardiogram',                   date: '20 May 2026', amount: 3500, status: 'Paid',    mode: 'Cash' },
  { id: 'INV-005', service: 'Consultation — Dr. Ananya Mehta',  date: '13 May 2026', amount: 800,  status: 'Paid',    mode: 'UPI' },
];

const BILL_STATUS = {
  Paid:    { background: '#DCFCE7', color: '#15803D' },
  Pending: { background: '#FEF3C7', color: '#92400E' },
  Waived:  { background: '#F1F5F9', color: '#475569' },
};

/** Invoice / billing history for a patient visit. */
export const BillingHistory = {
  name: '💳 Billing History',
  render: () => {
    const total = BILLING.reduce((s, r) => s + r.amount, 0);
    const paid  = BILLING.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0);
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: 720 }}>
        {/* Summary strip */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
          {[['Total', `₹${total.toLocaleString('en-IN')}`, '#171725'], ['Paid', `₹${paid.toLocaleString('en-IN')}`, '#15803D'], ['Pending', `₹${(total - paid).toLocaleString('en-IN')}`, '#92400E']].map(([label, val, color]) => (
            <div key={label} style={{ flex: 1, padding: '10px 14px', border: '1px solid #E2E2EA', borderRadius: 10, background: '#fff' }}>
              <div style={{ fontSize: 12, color: '#54545C' }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
            </div>
          ))}
        </div>
        <Table>
          <TableHead>
            <TableRow>
              {['Invoice', 'Service', 'Date', 'Amount', 'Mode', 'Status'].map((h) => (
                <TableCell key={h} component="th" style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#54545C', background: '#F8FAFC' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {BILLING.map((b) => (
              <TableRow key={b.id}>
                <TableCell style={{ fontSize: 12, color: '#54545C', fontFamily: 'monospace' }}>{b.id}</TableCell>
                <TableCell style={{ fontSize: 14, color: '#171725', maxWidth: 220 }}>{b.service}</TableCell>
                <TableCell style={{ fontSize: 12, color: '#54545C', whiteSpace: 'nowrap' }}>{b.date}</TableCell>
                <TableCell style={{ fontSize: 14, fontWeight: 600, color: '#171725', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>₹{b.amount.toLocaleString('en-IN')}</TableCell>
                <TableCell style={{ fontSize: 13, color: '#54545C' }}>{b.mode}</TableCell>
                <TableCell>
                  <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, ...BILL_STATUS[b.status] }}>{b.status}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};
