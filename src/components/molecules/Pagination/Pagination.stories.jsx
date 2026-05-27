import React from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    count: { control: { type: 'number', min: 1 } },
    page: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0 } },
  },
  args: {
    count: 10,
    page: 1,
    siblingCount: 1,
  },
};

export default meta;

/** Interactive — click pages and prev/next to move. */
export const Playground = {
  render: (args) => {
    const [page, setPage] = React.useState(args.page);
    React.useEffect(() => setPage(args.page), [args.page]);
    return <Pagination {...args} page={page} onChange={setPage} />;
  },
};

/** First page — previous button disabled. */
export const FirstPage = {
  render: () => {
    const [page, setPage] = React.useState(1);
    return <Pagination count={8} page={page} onChange={setPage} />;
  },
};

/** Middle page — both ellipses visible on large counts. */
export const MiddlePage = {
  render: () => {
    const [page, setPage] = React.useState(10);
    return <Pagination count={20} page={page} onChange={setPage} />;
  },
};

/** Last page — next button disabled. */
export const LastPage = {
  render: () => {
    const [page, setPage] = React.useState(8);
    return <Pagination count={8} page={page} onChange={setPage} />;
  },
};

/** More siblings shown around the active page. */
export const MoreSiblings = {
  render: () => {
    const [page, setPage] = React.useState(12);
    return <Pagination count={30} page={page} siblingCount={2} onChange={setPage} />;
  },
};

/** A single page renders nothing (count <= 1). */
export const SinglePageHidden = {
  render: () => <Pagination count={1} page={1} onChange={() => {}} />,
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Pagination below a patient list table with a row count summary. */
export const PatientListPagination = {
  name: '🏥 Patient List',
  render: () => {
    const [page, setPage] = React.useState(1);
    const pageSize = 20;
    const total = 312;
    const totalPages = Math.ceil(total / pageSize);
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#FAFAFA', border: '1px solid #E2E2EA', borderRadius: 10 }}>
          <span style={{ fontSize: 13, color: '#717179' }}>
            Showing <strong style={{ color: '#171725' }}>{from}–{to}</strong> of <strong style={{ color: '#171725' }}>{total}</strong> patients
          </span>
          <span style={{ fontSize: 12, color: '#A2A2A8' }}>Page {page} of {totalPages}</span>
        </div>
        <Pagination count={totalPages} page={page} siblingCount={1} onChange={setPage} />
      </div>
    );
  },
};

/** Lab results pagination — smaller page size, many pages. */
export const LabResultsPagination = {
  name: '🧪 Lab Results',
  render: () => {
    const [page, setPage] = React.useState(3);
    const total = 87;
    const pageSize = 10;
    const totalPages = Math.ceil(total / pageSize);
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#171725' }}>Lab Results — Rohan Sharma</div>
        <div style={{ fontSize: 13, color: '#717179' }}>{total} results across {totalPages} pages</div>
        <Pagination count={totalPages} page={page} siblingCount={2} onChange={setPage} />
      </div>
    );
  },
};

/** Compact pagination inside a card footer. */
export const InCardFooter = {
  name: '🃏 In Card Footer',
  render: () => {
    const [page, setPage] = React.useState(1);
    return (
      <div style={{ width: 480, border: '1px solid #E2E2EA', borderRadius: 12, overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F0F6' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#171725' }}>Upcoming appointments</div>
          <div style={{ fontSize: 12, color: '#717179', marginTop: 2 }}>Next 3 months</div>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { date: '2 Jun 2026', time: '10:30 AM', doctor: 'Dr. Mehta', dept: 'Cardiology' },
            { date: '8 Jun 2026', time: '3:00 PM', doctor: 'Dr. Rao', dept: 'Neurology' },
            { date: '15 Jun 2026', time: '11:00 AM', doctor: 'Dr. Mehta', dept: 'Cardiology' },
          ].map((a) => (
            <div key={a.date} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#454551', padding: '6px 0', borderBottom: '1px solid #F7F7FB' }}>
              <span>{a.date} · {a.time}</span>
              <span style={{ color: '#717179' }}>{a.doctor}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #F0F0F6', display: 'flex', justifyContent: 'center' }}>
          <Pagination count={8} page={page} siblingCount={0} onChange={setPage} />
        </div>
      </div>
    );
  },
};
