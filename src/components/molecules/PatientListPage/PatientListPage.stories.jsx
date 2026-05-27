import React from 'react';
import { Avatar } from '@/src/components/atoms/Avatar/Avatar';
import { Search, ListFilter, Plus, ChevronLeft, ChevronRight } from '@/src/components/atoms/icons/lucide';

export default {
  title: 'Compositions/Patient List Page',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

// ─── Shared data ────────────────────────────────────────────────────────────

const PATIENTS = [
  { id: 'MRN-0001', name: 'Ramesh Gupta', age: 54, gender: 'M', dept: 'Cardiology', lastVisit: '22 May 2026', status: 'Active' },
  { id: 'MRN-0002', name: 'Lakshmi Devi', age: 38, gender: 'F', dept: 'Neurology', lastVisit: '20 May 2026', status: 'Follow-up' },
  { id: 'MRN-0003', name: 'Ajay Verma', age: 67, gender: 'M', dept: 'Orthopedics', lastVisit: '18 May 2026', status: 'Discharged' },
  { id: 'MRN-0004', name: 'Priya Nair', age: 29, gender: 'F', dept: 'OPD', lastVisit: '17 May 2026', status: 'Active' },
  { id: 'MRN-0005', name: 'Suresh Kumar', age: 45, gender: 'M', dept: 'ICU', lastVisit: '16 May 2026', status: 'Critical' },
  { id: 'MRN-0006', name: 'Meera Joshi', age: 33, gender: 'F', dept: 'Gynecology', lastVisit: '14 May 2026', status: 'Active' },
  { id: 'MRN-0007', name: 'Kiran Reddy', age: 72, gender: 'M', dept: 'Cardiology', lastVisit: '12 May 2026', status: 'Follow-up' },
  { id: 'MRN-0008', name: 'Deepa Sharma', age: 41, gender: 'F', dept: 'Radiology', lastVisit: '10 May 2026', status: 'Active' },
];

const FILTERED_PATIENTS = PATIENTS.filter((p) => p.dept === 'Cardiology' || p.dept === 'ICU');

const STATUS_STYLES = {
  Active: { color: '#15803D', background: '#DCFCE7' },
  'Follow-up': { color: '#92400E', background: '#FEF9C3' },
  Discharged: { color: '#54545C', background: '#F3F4F6' },
  Critical: { color: '#B91C1C', background: '#FEE2E2' },
};

// ─── Shared sub-components ──────────────────────────────────────────────────

const StatusChip = ({ status }) => {
  const style = STATUS_STYLES[status] || { color: '#54545C', background: '#F3F4F6' };
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 600,
        padding: '2px 10px',
        borderRadius: 999,
        ...style,
      }}
    >
      {status}
    </span>
  );
};

const CountBadge = ({ count }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 28,
      height: 20,
      borderRadius: 999,
      background: '#EEF0FF',
      color: '#4B4AD5',
      fontSize: 12,
      fontWeight: 700,
      padding: '0 6px',
    }}
  >
    {count}
  </span>
);

const TH = ({ children, style }) => (
  <th
    style={{
      padding: '10px 16px',
      textAlign: 'left',
      fontSize: 12,
      fontWeight: 600,
      color: '#54545C',
      background: '#F8F8FB',
      borderBottom: '1px solid #E2E2EA',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </th>
);

const TD = ({ children, style }) => (
  <td
    style={{
      padding: '12px 16px',
      fontSize: 14,
      color: '#171725',
      borderBottom: '1px solid #E2E2EA',
      ...style,
    }}
  >
    {children}
  </td>
);

const PatientRow = ({ patient }) => (
  <tr style={{ background: '#fff' }}>
    <TD>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={patient.name} size="sm" />
        <span style={{ fontWeight: 500 }}>{patient.name}</span>
      </div>
    </TD>
    <TD style={{ color: '#54545C', fontFamily: 'monospace', fontSize: 13 }}>{patient.id}</TD>
    <TD>{patient.age}y / {patient.gender}</TD>
    <TD>{patient.dept}</TD>
    <TD style={{ color: '#54545C' }}>{patient.lastVisit}</TD>
    <TD><StatusChip status={patient.status} /></TD>
  </tr>
);

const TableHeader = () => (
  <thead>
    <tr>
      <TH>Patient</TH>
      <TH>MRN</TH>
      <TH>Age / Gender</TH>
      <TH>Department</TH>
      <TH>Last Visit</TH>
      <TH>Status</TH>
    </tr>
  </thead>
);

const PageHeader = ({ searchValue, onSearch }) => (
  <div
    style={{
      height: 64,
      borderBottom: '1px solid #E2E2EA',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: '#fff',
    }}
  >
    <h1
      style={{
        margin: 0,
        fontSize: 18,
        fontWeight: 700,
        color: '#171725',
        fontFamily: 'Inter, sans-serif',
        flex: '0 0 auto',
      }}
    >
      All Patients
    </h1>
    <CountBadge count={248} />
    <div style={{ flex: 1 }} />
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: 300,
        border: '1px solid #E2E2EA',
        borderRadius: 6,
        padding: '0 10px',
        height: 36,
        background: '#fff',
      }}
    >
      <Search size={15} color="#54545C" />
      <input
        value={searchValue}
        onChange={onSearch}
        placeholder="Search patients…"
        aria-label="Search patients"
        style={{
          border: 'none',
          outline: 'none',
          flex: 1,
          fontSize: 14,
          color: '#171725',
          fontFamily: 'Inter, sans-serif',
        }}
      />
    </div>
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 36,
        padding: '0 14px',
        border: '1px solid #E2E2EA',
        borderRadius: 6,
        background: '#fff',
        color: '#171725',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <ListFilter size={15} />
      Filters
    </button>
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 36,
        padding: '0 14px',
        border: 'none',
        borderRadius: 6,
        background: '#4B4AD5',
        color: '#fff',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Plus size={15} />
      Add Patient
    </button>
  </div>
);

const TABS = [
  { label: 'All', count: 248 },
  { label: 'Active', count: 180 },
  { label: 'Follow-up', count: 42 },
  { label: 'Discharged', count: 26 },
];

const TabBar = ({ active, onSelect }) => (
  <div
    style={{
      borderBottom: '1px solid #E2E2EA',
      padding: '0 24px',
      display: 'flex',
      gap: 0,
      background: '#fff',
    }}
  >
    {TABS.map((tab) => {
      const isActive = tab.label === active;
      return (
        <button
          key={tab.label}
          onClick={() => onSelect(tab.label)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 4px',
            height: 44,
            marginRight: 24,
            border: 'none',
            borderBottom: isActive ? '2px solid #4B4AD5' : '2px solid transparent',
            background: 'transparent',
            color: isActive ? '#4B4AD5' : '#54545C',
            fontWeight: isActive ? 600 : 500,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'color 0.15s',
          }}
        >
          {tab.label}
          <CountBadge count={tab.count} />
        </button>
      );
    })}
  </div>
);

const PaginationRow = ({ total, page, perPage }) => {
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderTop: '1px solid #E2E2EA',
        background: '#fff',
      }}
    >
      <span style={{ fontSize: 13, color: '#54545C', fontFamily: 'Inter, sans-serif' }}>
        Showing {from}–{to} of {total} patients
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            height: 32, padding: '0 12px', border: '1px solid #E2E2EA',
            borderRadius: 6, background: '#fff', color: '#171725',
            fontSize: 13, fontWeight: 500, cursor: page === 1 ? 'not-allowed' : 'pointer',
            opacity: page === 1 ? 0.4 : 1, fontFamily: 'Inter, sans-serif',
          }}
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <button
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            height: 32, padding: '0 12px', border: '1px solid #E2E2EA',
            borderRadius: 6, background: '#fff', color: '#171725',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

const PatientTable = ({ rows }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <TableHeader />
    <tbody>
      {rows.map((p) => (
        <PatientRow key={p.id} patient={p} />
      ))}
    </tbody>
  </table>
);

// ─── Stories ────────────────────────────────────────────────────────────────

export const Default = {
  render: () => {
    const [tab, setTab] = React.useState('All');
    const [search, setSearch] = React.useState('');
    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <PageHeader searchValue={search} onSearch={(e) => setSearch(e.target.value)} />
        <TabBar active={tab} onSelect={setTab} />
        <div style={{ padding: '0 24px' }}>
          <PatientTable rows={PATIENTS} />
        </div>
        <PaginationRow total={248} page={1} perPage={8} />
      </div>
    );
  },
};

export const WithFiltersOpen = {
  render: () => {
    const [tab, setTab] = React.useState('All');
    const [search, setSearch] = React.useState('');
    const [filters, setFilters] = React.useState({ status: 'All', dept: '' });

    const toggleStatus = (s) => setFilters((f) => ({ ...f, status: s }));

    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <PageHeader searchValue={search} onSearch={(e) => setSearch(e.target.value)} />
        <TabBar active={tab} onSelect={setTab} />

        {/* Inline filter panel */}
        <div
          style={{
            margin: '0 24px',
            marginTop: 12,
            border: '1px solid #E2E2EA',
            borderRadius: 8,
            padding: '16px 20px',
            background: '#F8F8FB',
            display: 'flex',
            gap: 32,
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {/* Status filter */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#54545C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['All', 'Active', 'Follow-up', 'Discharged', 'Critical'].map((s) => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#171725', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={filters.status === s}
                    onChange={() => toggleStatus(s)}
                    style={{ accentColor: '#4B4AD5' }}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#54545C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date Range</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: '#54545C', marginBottom: 4 }}>From</div>
                <input type="date" aria-label="From date" style={{ border: '1px solid #E2E2EA', borderRadius: 6, padding: '6px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#171725' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#54545C', marginBottom: 4 }}>To</div>
                <input type="date" aria-label="To date" style={{ border: '1px solid #E2E2EA', borderRadius: 6, padding: '6px 10px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#171725' }} />
              </div>
            </div>
          </div>

          {/* Department */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#54545C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department</div>
            <select
              value={filters.dept}
              onChange={(e) => setFilters((f) => ({ ...f, dept: e.target.value }))}
              aria-label="Filter by department"
              style={{
                border: '1px solid #E2E2EA',
                borderRadius: 6,
                padding: '6px 10px',
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
                color: '#171725',
                background: '#fff',
                minWidth: 160,
              }}
            >
              <option value="">All departments</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="icu">ICU</option>
              <option value="opd">OPD</option>
              <option value="radiology">Radiology</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
            <button
              onClick={() => setFilters({ status: 'All', dept: '' })}
              style={{ height: 34, padding: '0 16px', border: '1px solid #E2E2EA', borderRadius: 6, background: '#fff', color: '#54545C', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              Clear
            </button>
            <button
              style={{ height: 34, padding: '0 16px', border: 'none', borderRadius: 6, background: '#4B4AD5', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Filtered table */}
        <div style={{ padding: '12px 24px 0' }}>
          <PatientTable rows={FILTERED_PATIENTS} />
        </div>
        <PaginationRow total={FILTERED_PATIENTS.length} page={1} perPage={8} />
      </div>
    );
  },
};

export const EmptyFiltered = {
  render: () => {
    const [tab, setTab] = React.useState('All');
    const [search, setSearch] = React.useState('');
    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <PageHeader searchValue={search} onSearch={(e) => setSearch(e.target.value)} />
        <TabBar active={tab} onSelect={setTab} />
        <div style={{ padding: '0 24px' }}>
          {/* Table header */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHeader />
          </table>
          {/* Empty state */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '64px 24px',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search size={24} color="#54545C" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#171725', textAlign: 'center' }}>
              No patients match your filters
            </div>
            <div style={{ fontSize: 14, color: '#54545C', textAlign: 'center' }}>
              Try adjusting your search criteria or removing some filters.
            </div>
            <span
              style={{
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 600,
                padding: '3px 12px',
                borderRadius: 999,
                background: '#EEF0FF',
                color: '#4B4AD5',
              }}
            >
              28 filters active
            </span>
            <button
              style={{
                marginTop: 4,
                height: 36,
                padding: '0 20px',
                border: '1px solid #E2E2EA',
                borderRadius: 6,
                background: '#fff',
                color: '#171725',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    );
  },
};

export const LoadingState = {
  render: () => {
    const [tab, setTab] = React.useState('All');
    const [search, setSearch] = React.useState('');
    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <style>{`
          @keyframes shimmer {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
          .shimmer-bar {
            background: #E2E2EA;
            border-radius: 4px;
            animation: shimmer 1.4s ease-in-out infinite;
          }
        `}</style>
        <PageHeader searchValue={search} onSearch={(e) => setSearch(e.target.value)} />
        <TabBar active={tab} onSelect={setTab} />
        <div style={{ padding: '0 24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHeader />
            <tbody>
              {Array.from({ length: 6 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="shimmer-bar" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
                      <div className="shimmer-bar" style={{ width: 120, height: 14 }} />
                    </div>
                  </TD>
                  <TD><div className="shimmer-bar" style={{ width: 72, height: 14 }} /></TD>
                  <TD><div className="shimmer-bar" style={{ width: 60, height: 14 }} /></TD>
                  <TD><div className="shimmer-bar" style={{ width: 90, height: 14 }} /></TD>
                  <TD><div className="shimmer-bar" style={{ width: 80, height: 14 }} /></TD>
                  <TD><div className="shimmer-bar" style={{ width: 64, height: 20, borderRadius: 999 }} /></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationRow total={248} page={1} perPage={8} />
      </div>
    );
  },
};
