import React from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Page navigation for lists, tables, and audit logs — pairs with DataTable.',
          '',
          '**When to use** — navigating paged result sets (patient lists, billing, logs).',
          '**When not** — for infinite/lazy lists use DataTable’s infinite mode; for stepping a single value use a counter Input.',
          '',
          '**Key props** — `page` (0-indexed), `pageCount`, `onPageChange`, `siblingCount` (pages each side of current), `size` (sm · md).',
          '',
          '**Good to know** — composes the Button atom (prev/next icon buttons + page buttons; active page is tonal/primary with aria-current). Long ranges collapse to first … window … last. Prev/next disable at the ends.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    pageCount: { control: { type: 'number', min: 1 }, table: { category: 'Content' } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 }, table: { category: 'Behaviour' } },
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Appearance' } },
    onPageChange: { control: false, action: 'pageChange', description: 'Fires with the next 0-indexed page when a page / prev / next button is clicked', table: { category: 'State' } },
  },
  args: { pageCount: 12, siblingCount: 1, size: 'md' },
};
export default meta;

export const Playground = {
  render: (a) => {
    const [page, setPage] = React.useState(3);
    return (
      <Pagination
        {...a}
        page={page}
        onPageChange={(p) => { setPage(p); a.onPageChange?.(p); }}
      />
    );
  },
};

/** Few pages — no collapsing. */
export const FewPages = {
  render: () => {
    const [page, setPage] = React.useState(0);
    return <Pagination page={page} pageCount={4} onPageChange={setPage} />;
  },
};

/** Small size. */
export const Small = {
  render: () => {
    const [page, setPage] = React.useState(5);
    return <Pagination size="sm" page={page} pageCount={20} onPageChange={setPage} />;
  },
};
