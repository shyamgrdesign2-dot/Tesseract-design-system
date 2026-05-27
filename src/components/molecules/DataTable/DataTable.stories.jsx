import React from 'react';
import { DataTable } from './DataTable';
import { TPButton, TPIconButton } from '@/src/components/atoms/Button/button-system/index.js';
import {
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  Search,
  Users,
  ArrowDown,
  ArrowUp,
} from '@/src/components/atoms/icons/lucide';

const meta = {
  title: 'Molecules/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export default meta;

// ─── Shared data ─────────────────────────────────────────────────────────────

const PATIENTS = [
  { id: 'p1', name: 'Aarav Sharma',   initials: 'AS', mrn: 'MRN-10231', age: 34, gender: 'Male',   blood: 'B+',  appt: 'Today, 10:30 AM', doctor: 'Dr. Mehra',   status: 'Confirmed' },
  { id: 'p2', name: 'Diya Patel',     initials: 'DP', mrn: 'MRN-10232', age: 28, gender: 'Female', blood: 'O+',  appt: 'Today, 11:15 AM', doctor: 'Dr. Sharma',  status: 'Waiting'   },
  { id: 'p3', name: 'Vihaan Reddy',   initials: 'VR', mrn: 'MRN-10233', age: 45, gender: 'Male',   blood: 'A-',  appt: 'Today, 12:00 PM', doctor: 'Dr. Kapoor',  status: 'No-show'   },
  { id: 'p4', name: 'Ananya Singh',   initials: 'AN', mrn: 'MRN-10234', age: 52, gender: 'Female', blood: 'AB+', appt: 'Today, 01:00 PM', doctor: 'Dr. Mehra',   status: 'Completed' },
  { id: 'p5', name: 'Rohan Mehta',    initials: 'RM', mrn: 'MRN-10235', age: 31, gender: 'Male',   blood: 'O-',  appt: 'Today, 02:15 PM', doctor: 'Dr. Sharma',  status: 'Confirmed' },
  { id: 'p6', name: 'Priya Nair',     initials: 'PN', mrn: 'MRN-10236', age: 40, gender: 'Female', blood: 'A+',  appt: 'Today, 03:00 PM', doctor: 'Dr. Gupta',   status: 'Waiting'   },
  { id: 'p7', name: 'Arjun Verma',    initials: 'AV', mrn: 'MRN-10237', age: 27, gender: 'Male',   blood: 'B-',  appt: 'Today, 03:45 PM', doctor: 'Dr. Kapoor',  status: 'Confirmed' },
  { id: 'p8', name: 'Kavya Iyer',     initials: 'KI', mrn: 'MRN-10238', age: 63, gender: 'Female', blood: 'O+',  appt: 'Today, 04:30 PM', doctor: 'Dr. Mehra',   status: 'Completed' },
];

const APPT_ROWS = [
  { id: 'a1',  name: 'Aarav Sharma',  initials: 'AS', mrn: 'MRN-10231', time: '09:00 AM', type: 'General Check-up',   status: 'Confirmed' },
  { id: 'a2',  name: 'Diya Patel',    initials: 'DP', mrn: 'MRN-10232', time: '09:30 AM', type: 'Follow-up',          status: 'Waiting'   },
  { id: 'a3',  name: 'Vihaan Reddy',  initials: 'VR', mrn: 'MRN-10233', time: '10:00 AM', type: 'Consultation',       status: 'No-show'   },
  { id: 'a4',  name: 'Ananya Singh',  initials: 'AN', mrn: 'MRN-10234', time: '10:30 AM', type: 'Prescription Refill', status: 'Completed' },
  { id: 'a5',  name: 'Rohan Mehta',   initials: 'RM', mrn: 'MRN-10235', time: '11:00 AM', type: 'New Patient',        status: 'Confirmed' },
  { id: 'a6',  name: 'Priya Nair',    initials: 'PN', mrn: 'MRN-10236', time: '11:30 AM', type: 'Follow-up',          status: 'Waiting'   },
  { id: 'a7',  name: 'Arjun Verma',   initials: 'AV', mrn: 'MRN-10237', time: '12:00 PM', type: 'Lab Review',         status: 'Confirmed' },
  { id: 'a8',  name: 'Kavya Iyer',    initials: 'KI', mrn: 'MRN-10238', time: '12:30 PM', type: 'General Check-up',   status: 'Completed' },
  { id: 'a9',  name: 'Siddharth Rao', initials: 'SR', mrn: 'MRN-10239', time: '01:00 PM', type: 'Consultation',       status: 'Confirmed' },
  { id: 'a10', name: 'Meera Joshi',   initials: 'MJ', mrn: 'MRN-10240', time: '01:30 PM', type: 'New Patient',        status: 'Waiting'   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Confirmed: { background: '#D1FAE5', color: '#065F46' },
  Waiting:   { background: '#FEF3C7', color: '#92400E' },
  'No-show': { background: '#FEE2E2', color: '#991B1B' },
  Completed: { background: '#F1F5F9', color: '#475569' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { background: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      ...s,
      padding: '2px 10px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

function Avatar({ initials }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: '#EEF2FF',
      color: '#4338CA',
      fontWeight: 700,
      fontSize: 13,
      flexShrink: 0,
    }}>
      {initials}
    </span>
  );
}

function PatientCell({ row }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Avatar initials={row.initials} />
      <span style={{ fontWeight: 600, fontSize: 14 }}>{row.name}</span>
    </div>
  );
}

// ─── 1. Playground ────────────────────────────────────────────────────────────

/** Full DataTable with 8 rows of realistic patient data and sticky action column. */
export const Playground = {
  render: () => {
    const columns = [
      {
        id: 'patient',
        header: 'Patient',
        minWidth: '200px',
        cell: (row) => <PatientCell row={row} />,
      },
      { id: 'mrn',    header: 'MRN',         minWidth: '120px', cell: (row) => row.mrn },
      { id: 'appt',   header: 'Appointment', minWidth: '160px', cell: (row) => row.appt },
      { id: 'status', header: 'Status',      minWidth: '120px', cell: (row) => <StatusBadge status={row.status} /> },
      {
        id: 'action',
        header: 'Action',
        sticky: 'right',
        cell: (row) => (
          <div style={{ display: 'flex', gap: 4 }}>
            <TPIconButton icon={Eye}    theme="neutral" size="sm" surface="light" />
            <TPIconButton icon={Pencil} theme="neutral" size="sm" surface="light" />
            <TPIconButton icon={Trash2} theme="error"   size="sm" surface="light" />
          </div>
        ),
      },
    ];
    return <DataTable columns={columns} data={PATIENTS} />;
  },
};

// ─── 2. AllColumns ────────────────────────────────────────────────────────────

/** Wide table with 8+ columns — scroll horizontally to see all. */
export const AllColumns = {
  render: () => {
    const columns = [
      {
        id: 'patient',
        header: 'Patient',
        minWidth: '200px',
        cell: (row) => <PatientCell row={row} />,
      },
      { id: 'mrn',    header: 'MRN',         minWidth: '120px', cell: (row) => row.mrn },
      { id: 'age',    header: 'Age',          minWidth: '70px',  cell: (row) => row.age },
      { id: 'gender', header: 'Gender',       minWidth: '90px',  cell: (row) => row.gender },
      { id: 'blood',  header: 'Blood Group',  minWidth: '100px', cell: (row) => row.blood },
      { id: 'appt',   header: 'Appointment',  minWidth: '170px', cell: (row) => row.appt },
      { id: 'doctor', header: 'Doctor',       minWidth: '140px', cell: (row) => row.doctor },
      { id: 'status', header: 'Status',       minWidth: '120px', cell: (row) => <StatusBadge status={row.status} /> },
      {
        id: 'action',
        header: 'Action',
        sticky: 'right',
        cell: () => (
          <div style={{ display: 'flex', gap: 4 }}>
            <TPIconButton icon={Eye}    theme="neutral" size="sm" surface="light" />
            <TPIconButton icon={Pencil} theme="neutral" size="sm" surface="light" />
          </div>
        ),
      },
    ];
    return (
      <div style={{ overflowX: 'auto' }}>
        <DataTable columns={columns} data={PATIENTS} />
      </div>
    );
  },
};

// ─── 3. WithHorizontalScrollShadow ────────────────────────────────────────────

/** Table in a scroll container with a right-edge gradient shadow over the sticky column. */
export const WithHorizontalScrollShadow = {
  render: () => {
    const columns = [
      {
        id: 'patient',
        header: 'Patient',
        minWidth: '200px',
        cell: (row) => <PatientCell row={row} />,
      },
      { id: 'mrn',    header: 'MRN',        minWidth: '130px', cell: (row) => row.mrn },
      { id: 'age',    header: 'Age',         minWidth: '80px',  cell: (row) => row.age },
      { id: 'gender', header: 'Gender',      minWidth: '100px', cell: (row) => row.gender },
      { id: 'blood',  header: 'Blood Group', minWidth: '110px', cell: (row) => row.blood },
      { id: 'appt',   header: 'Appointment', minWidth: '180px', cell: (row) => row.appt },
      { id: 'doctor', header: 'Doctor',      minWidth: '150px', cell: (row) => row.doctor },
      { id: 'status', header: 'Status',      minWidth: '130px', cell: (row) => <StatusBadge status={row.status} /> },
      {
        id: 'action',
        header: 'Action',
        sticky: 'right',
        cell: () => (
          <div style={{ display: 'flex', gap: 4 }}>
            <TPIconButton icon={Eye}    theme="neutral" size="sm" surface="light" />
            <TPIconButton icon={Pencil} theme="neutral" size="sm" surface="light" />
            <TPIconButton icon={Trash2} theme="error"   size="sm" surface="light" />
          </div>
        ),
      },
    ];
    return (
      <div style={{ position: 'relative', overflowX: 'auto' }}>
        <DataTable columns={columns} data={PATIENTS} />
        {/* Shadow overlay — fades over the sticky action column */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: 60,
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.95))',
          pointerEvents: 'none',
          zIndex: 30,
        }} />
      </div>
    );
  },
};

// ─── 4. WithFilters ───────────────────────────────────────────────────────────

/** Column headers with interactive sort icons and a visual "filtered" indicator on Status. */
export const WithFilters = {
  render: () => {
    const [sortCol, setSortCol] = React.useState(null);
    const [sortDir, setSortDir] = React.useState('asc');

    const toggleSort = (colId) => {
      if (sortCol === colId) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortCol(colId);
        setSortDir('asc');
      }
    };

    const SortableHeader = ({ colId, label }) => {
      const active = sortCol === colId;
      const Icon = active && sortDir === 'desc' ? ArrowUp : ArrowDown;
      return (
        <button
          onClick={() => toggleSort(colId)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: 12, textTransform: 'uppercase',
            color: active ? '#4338CA' : 'inherit', padding: 0,
          }}
        >
          {label}
          <Icon size={12} style={{ opacity: active ? 1 : 0.35 }} />
        </button>
      );
    };

    const columns = [
      {
        id: 'patient',
        header: <SortableHeader colId="patient" label="Patient" />,
        minWidth: '200px',
        cell: (row) => <PatientCell row={row} />,
      },
      { id: 'mrn',  header: <SortableHeader colId="mrn"  label="MRN" />,  minWidth: '120px', cell: (row) => row.mrn },
      { id: 'appt', header: <SortableHeader colId="appt" label="Appointment" />, minWidth: '160px', cell: (row) => row.appt },
      {
        id: 'status',
        header: (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <SortableHeader colId="status" label="Status" />
            <span style={{
              background: '#EEF2FF', color: '#4338CA',
              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
            }}>
              Filtered
            </span>
          </div>
        ),
        minWidth: '140px',
        cell: (row) => <StatusBadge status={row.status} />,
      },
      {
        id: 'action',
        header: 'Action',
        sticky: 'right',
        cell: () => (
          <div style={{ display: 'flex', gap: 4 }}>
            <TPIconButton icon={Eye}    theme="neutral" size="sm" surface="light" />
            <TPIconButton icon={Pencil} theme="neutral" size="sm" surface="light" />
          </div>
        ),
      },
    ];

    return <DataTable columns={columns} data={PATIENTS} />;
  },
};

// ─── 5. LoadingState ──────────────────────────────────────────────────────────

/** Skeleton shimmer rows while data is loading. */
export const LoadingState = {
  render: () => {
    const shimmerStyle = {
      height: 14,
      borderRadius: 6,
      background: 'linear-gradient(90deg, #F1F1F5 25%, #E2E2EA 50%, #F1F1F5 75%)',
      backgroundSize: '800px 100%',
      animation: 'shimmer 1.4s infinite',
    };

    const SkeletonRow = () => (
      <tr style={{ height: 64, borderBottom: '1px solid #F1F5F9' }}>
        <td style={{ padding: '0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ ...shimmerStyle, width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ ...shimmerStyle, width: 120 }} />
          </div>
        </td>
        <td style={{ padding: '0 12px' }}><div style={{ ...shimmerStyle, width: 80 }} /></td>
        <td style={{ padding: '0 12px' }}><div style={{ ...shimmerStyle, width: 130 }} /></td>
        <td style={{ padding: '0 12px' }}><div style={{ ...shimmerStyle, width: 70 }} /></td>
        <td style={{ padding: '0 12px', position: 'sticky', right: 0, background: 'white' }}>
          <div style={{ ...shimmerStyle, width: 60 }} />
        </td>
      </tr>
    );

    return (
      <>
        <style>{`@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }`}</style>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderRadius: 12 }}>
              {['Patient', 'MRN', 'Appointment', 'Status', 'Action'].map((h) => (
                <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#54545C' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </>
    );
  },
};

// ─── 6. EmptyState ────────────────────────────────────────────────────────────

/** Two empty-state variants: no data, and no search results. */
export const EmptyState = {
  render: () => {
    const [variant, setVariant] = React.useState('noData');

    const columns = [
      { id: 'patient', header: 'Patient',     minWidth: '200px', cell: (row) => row.name },
      { id: 'mrn',     header: 'MRN',          minWidth: '120px', cell: (row) => row.mrn },
      { id: 'appt',    header: 'Appointment',  minWidth: '160px', cell: (row) => row.appt },
      { id: 'status',  header: 'Status',       minWidth: '120px', cell: (row) => row.status },
      { id: 'action',  header: 'Action', sticky: 'right', cell: () => null },
    ];

    const noDataEmpty = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 0' }}>
        <Users size={40} style={{ color: '#CBD5E1' }} />
        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#334155' }}>No patients found</p>
        <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>Your patient list is currently empty.</p>
        <TPButton variant="ghost" theme="neutral" size="sm">Clear filters</TPButton>
      </div>
    );

    const noSearchEmpty = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 0' }}>
        <Search size={40} style={{ color: '#CBD5E1' }} />
        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#334155' }}>No results for &lsquo;abc&rsquo;</p>
        <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>Try a different name or MRN.</p>
        <TPButton variant="outline" theme="neutral" size="sm">Reset search</TPButton>
      </div>
    );

    return (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <TPButton
            variant={variant === 'noData' ? 'solid' : 'outline'}
            theme="primary" size="sm"
            onClick={() => setVariant('noData')}
          >
            No Data
          </TPButton>
          <TPButton
            variant={variant === 'noSearch' ? 'solid' : 'outline'}
            theme="primary" size="sm"
            onClick={() => setVariant('noSearch')}
          >
            No Search Results
          </TPButton>
        </div>
        <DataTable
          columns={columns}
          data={[]}
          emptyState={variant === 'noData' ? noDataEmpty : noSearchEmpty}
        />
      </div>
    );
  },
};

// ─── 7. WithStatusBadges ──────────────────────────────────────────────────────

/** All four status badge styles shown across patient rows. */
export const WithStatusBadges = {
  render: () => {
    const columns = [
      {
        id: 'patient',
        header: 'Patient',
        minWidth: '200px',
        cell: (row) => <PatientCell row={row} />,
      },
      { id: 'mrn',    header: 'MRN',         minWidth: '120px', cell: (row) => row.mrn },
      { id: 'appt',   header: 'Appointment', minWidth: '160px', cell: (row) => row.appt },
      {
        id: 'status',
        header: 'Status',
        minWidth: '130px',
        cell: (row) => <StatusBadge status={row.status} />,
      },
      {
        id: 'action',
        header: 'Action',
        sticky: 'right',
        cell: () => (
          <div style={{ display: 'flex', gap: 4 }}>
            <TPIconButton icon={Eye}    theme="neutral" size="sm" surface="light" />
            <TPIconButton icon={Pencil} theme="neutral" size="sm" surface="light" />
          </div>
        ),
      },
    ];
    return <DataTable columns={columns} data={PATIENTS} />;
  },
};

// ─── 8. WithRowActions ────────────────────────────────────────────────────────

/** Sticky action column with MoreVertical button that reveals actions on row hover. */
export const WithRowActions = {
  render: () => {
    const [hoveredRow, setHoveredRow] = React.useState(null);

    const ActionCell = ({ rowId }) => {
      const isHovered = hoveredRow === rowId;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 100 }}>
          {isHovered ? (
            <>
              <TPIconButton icon={Eye}    theme="neutral" size="sm" surface="light" />
              <TPIconButton icon={Pencil} theme="neutral" size="sm" surface="light" />
              <TPIconButton icon={Trash2} theme="error"   size="sm" surface="light" />
            </>
          ) : (
            <TPIconButton icon={MoreVertical} theme="neutral" size="sm" surface="light" />
          )}
        </div>
      );
    };

    const columns = [
      {
        id: 'patient',
        header: 'Patient',
        minWidth: '200px',
        cell: (row) => <PatientCell row={row} />,
      },
      { id: 'mrn',    header: 'MRN',         minWidth: '120px', cell: (row) => row.mrn },
      { id: 'appt',   header: 'Appointment', minWidth: '160px', cell: (row) => row.appt },
      { id: 'status', header: 'Status',      minWidth: '120px', cell: (row) => <StatusBadge status={row.status} /> },
      {
        id: 'action',
        header: 'Action',
        sticky: 'right',
        cell: (row) => <ActionCell rowId={row.id} />,
      },
    ];

    return (
      <div>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
          Hover over a row to reveal individual actions.
        </p>
        <DataTable
          columns={columns}
          data={PATIENTS}
          rowClassName={(row) => {
            // We piggyback rowClassName to attach mouse handlers via a wrapper trick.
            // The actual hover state is managed via onMouseEnter/onMouseLeave on the tr
            // but DataTable does not expose those — so we use a CSS data attribute approach.
            return undefined;
          }}
        />
        {/* Overlay to detect row hover via mouse position — simpler: use a wrapping div trick */}
        <style>{`
          .dt-row-hover:hover td { background: rgba(248,250,252,0.8); }
        `}</style>
        {/* Re-render with per-row hover via onMouseEnter on TR — we build our own table */}
        <div style={{ marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderRadius: 12 }}>
                {['Patient', 'MRN', 'Appointment', 'Status', 'Action'].map((h, i, arr) => (
                  <th key={h} style={{
                    padding: '12px', textAlign: 'left', fontSize: 12,
                    fontWeight: 600, textTransform: 'uppercase', color: '#54545C',
                    borderRadius: i === 0 ? '12px 0 0 12px' : i === arr.length - 1 ? '0 12px 12px 0' : 0,
                    position: i === arr.length - 1 ? 'sticky' : 'static',
                    right: 0, background: '#F8FAFC',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PATIENTS.map((row) => (
                <tr
                  key={row.id}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ height: 64, borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                >
                  <td style={{ padding: '0 12px' }}><PatientCell row={row} /></td>
                  <td style={{ padding: '0 12px', fontSize: 14, color: '#475569' }}>{row.mrn}</td>
                  <td style={{ padding: '0 12px', fontSize: 14, color: '#475569' }}>{row.appt}</td>
                  <td style={{ padding: '0 12px' }}><StatusBadge status={row.status} /></td>
                  <td style={{ padding: '0 12px', position: 'sticky', right: 0, background: hoveredRow === row.id ? '#F8FAFC' : 'white' }}>
                    <ActionCell rowId={row.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
};

// ─── 9. WithLazyLoad ──────────────────────────────────────────────────────────

/** Simulates lazy loading: initial 5 rows, "Load more" adds 5 per click. */
export const WithLazyLoad = {
  render: () => {
    const ALL_DATA = [
      ...PATIENTS,
      { id: 'p9',  name: 'Siddharth Rao', initials: 'SR', mrn: 'MRN-10239', age: 38, gender: 'Male',   blood: 'A+',  appt: 'Tomorrow, 09:00 AM', doctor: 'Dr. Gupta',  status: 'Confirmed' },
      { id: 'p10', name: 'Meera Joshi',   initials: 'MJ', mrn: 'MRN-10240', age: 55, gender: 'Female', blood: 'B+',  appt: 'Tomorrow, 10:00 AM', doctor: 'Dr. Mehra',  status: 'Waiting'   },
      { id: 'p11', name: 'Kiran Bose',    initials: 'KB', mrn: 'MRN-10241', age: 42, gender: 'Male',   blood: 'O-',  appt: 'Tomorrow, 11:00 AM', doctor: 'Dr. Sharma', status: 'Confirmed' },
      { id: 'p12', name: 'Neha Pillai',   initials: 'NP', mrn: 'MRN-10242', age: 30, gender: 'Female', blood: 'AB-', appt: 'Tomorrow, 12:00 PM', doctor: 'Dr. Kapoor', status: 'Completed' },
      { id: 'p13', name: 'Rahul Desai',   initials: 'RD', mrn: 'MRN-10243', age: 47, gender: 'Male',   blood: 'A-',  appt: 'Tomorrow, 01:00 PM', doctor: 'Dr. Gupta',  status: 'No-show'   },
    ];

    const [visibleCount, setVisibleCount] = React.useState(5);
    const visibleData = ALL_DATA.slice(0, visibleCount);
    const hasMore = visibleCount < ALL_DATA.length;

    const columns = [
      {
        id: 'patient',
        header: 'Patient',
        minWidth: '200px',
        cell: (row) => <PatientCell row={row} />,
      },
      { id: 'mrn',    header: 'MRN',         minWidth: '120px', cell: (row) => row.mrn },
      { id: 'appt',   header: 'Appointment', minWidth: '160px', cell: (row) => row.appt },
      { id: 'status', header: 'Status',      minWidth: '120px', cell: (row) => <StatusBadge status={row.status} /> },
      {
        id: 'action',
        header: 'Action',
        sticky: 'right',
        cell: () => (
          <div style={{ display: 'flex', gap: 4 }}>
            <TPIconButton icon={Eye}    theme="neutral" size="sm" surface="light" />
            <TPIconButton icon={Pencil} theme="neutral" size="sm" surface="light" />
          </div>
        ),
      },
    ];

    return (
      <div>
        <DataTable columns={columns} data={visibleData} />
        {hasMore && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <TPButton
              variant="ghost"
              theme="neutral"
              size="md"
              onClick={() => setVisibleCount((c) => Math.min(c + 5, ALL_DATA.length))}
            >
              Load more ({ALL_DATA.length - visibleCount} remaining)
            </TPButton>
          </div>
        )}
        {!hasMore && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 12 }}>
            All {ALL_DATA.length} patients loaded
          </p>
        )}
      </div>
    );
  },
};

// ─── 10. HealthcareExample ────────────────────────────────────────────────────

/** Full realistic appointment list for a doctor's day, wrapped in a card with header. */
export const HealthcareExample = {
  render: () => {
    const columns = [
      {
        id: 'patient',
        header: 'Patient',
        minWidth: '210px',
        cell: (row) => <PatientCell row={row} />,
      },
      { id: 'mrn',    header: 'MRN',              minWidth: '120px', cell: (row) => row.mrn },
      { id: 'time',   header: 'Time',             minWidth: '100px', cell: (row) => <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>{row.time}</span> },
      { id: 'type',   header: 'Appointment Type', minWidth: '180px', cell: (row) => <span style={{ fontSize: 14, color: '#475569' }}>{row.type}</span> },
      { id: 'status', header: 'Status',           minWidth: '120px', cell: (row) => <StatusBadge status={row.status} /> },
      {
        id: 'action',
        header: 'Action',
        sticky: 'right',
        cell: () => (
          <div style={{ display: 'flex', gap: 4 }}>
            <TPIconButton icon={Eye}    theme="neutral" size="sm" surface="light" />
            <TPIconButton icon={Pencil} theme="neutral" size="sm" surface="light" />
          </div>
        ),
      },
    ];

    return (
      <div style={{
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        overflow: 'hidden',
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        {/* Card header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0F172A' }}>
              Today&apos;s Appointments
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748B' }}>
              {APPT_ROWS.length} patients scheduled · Dr. Meera Singh
            </p>
          </div>
          <TPButton variant="solid" theme="primary" size="sm">
            + New Appointment
          </TPButton>
        </div>

        {/* Table */}
        <div style={{ padding: '0 4px' }}>
          <DataTable columns={columns} data={APPT_ROWS} />
        </div>
      </div>
    );
  },
};
