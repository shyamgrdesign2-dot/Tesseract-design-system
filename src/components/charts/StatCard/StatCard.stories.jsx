import React from 'react';
import { StatCard } from './StatCard';

const spark = [12, 14, 13, 16, 15, 19, 22, 21, 24, 27];

const meta = {
  title: 'Charts/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A KPI tile — label, big value, an optional auto-coloured delta chip, and an optional inline Sparkline. Zero-dependency.',
          '',
          '**EMR use** — dashboard headline metrics: today’s appointments, collections, occupancy, no-show rate. `invertDelta` when down is good (e.g. no-shows).',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    spark: { control: false },
    label: { control: 'text', table: { category: 'Content' } },
    value: { control: 'text', table: { category: 'Content' } },
    delta: { control: { type: 'number' }, table: { category: 'Content' } },
    deltaSuffix: { control: 'text', table: { category: 'Content' } },
    invertDelta: { control: 'boolean', table: { category: 'Behaviour' } },
    footer: { control: 'text', table: { category: 'Content' } },
  },
  args: {
    label: 'Appointments today',
    value: 128,
    delta: 12.5,
    deltaSuffix: '%',
    invertDelta: false,
    spark,
    footer: 'vs. last week',
  },
  render: (a) => (
    <div style={{ maxWidth: 260 }}>
      <StatCard {...a} />
    </div>
  ),
};
export default meta;

export const Playground = {};

export const Dashboard = {
  render: () => (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      <StatCard label="Appointments today" value={128} delta={12.5} spark={spark} sparkColor="var(--tesseract-blue-500)" footer="vs. last week" />
      <StatCard label="Collections" value={84200} format={(v) => `₹${(v / 1000).toFixed(1)}k`} delta={8.2} spark={[60, 62, 61, 66, 70, 72, 78, 80, 82, 84]} sparkColor="var(--tesseract-success-500)" footer="this month" />
      <StatCard label="No-show rate" value="6.4%" delta={-1.8} invertDelta spark={[11, 10, 9, 9, 8, 8, 7, 7, 6, 6]} sparkColor="var(--tesseract-violet-500)" footer="down is good" />
      <StatCard label="Bed occupancy" value="78%" delta={0} trend="flat" spark={[70, 72, 74, 73, 75, 77, 78, 78, 78, 78]} sparkColor="var(--tesseract-amber-500)" />
    </div>
  ),
};
