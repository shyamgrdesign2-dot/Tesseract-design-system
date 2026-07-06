import React from 'react';
import { BarChart } from './BarChart';

const byDept = [
  { dept: 'OPD', visits: 120, walkins: 30 },
  { dept: 'Dental', visits: 82, walkins: 18 },
  { dept: 'Ortho', visits: 64, walkins: 12 },
  { dept: 'Derma', visits: 48, walkins: 22 },
  { dept: 'ENT', visits: 37, walkins: 9 },
];

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Categorical comparison — zero-dependency (pure SVG + own scales).',
          '',
          '**Features** — **grouped** or **stacked**, **vertical** or **horizontal**, optional value labels, gridlines, an interactive tooltip, and a click-to-toggle legend.',
          '',
          '**EMR use** — visits by department, revenue by service, top diagnoses (horizontal). Token-only colours; responsive.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    data: { control: false },
    series: { control: false },
    xKey: { control: false },
    stacked: { control: 'boolean', table: { category: 'Appearance' } },
    horizontal: { control: 'boolean', table: { category: 'Appearance' } },
    valueLabels: { control: 'boolean', table: { category: 'Appearance' } },
    height: { control: { type: 'range', min: 180, max: 460, step: 10 }, table: { category: 'Appearance' } },
    showGrid: { control: 'boolean', table: { category: 'Behaviour' } },
    showLegend: { control: 'boolean', table: { category: 'Behaviour' } },
    showTooltip: { control: 'boolean', table: { category: 'Behaviour' } },
  },
  args: {
    data: byDept,
    xKey: 'dept',
    series: [
      { key: 'visits', label: 'Visits' },
      { key: 'walkins', label: 'Walk-ins' },
    ],
    height: 280,
    stacked: false,
    horizontal: false,
    valueLabels: false,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  },
  render: (a) => (
    <div style={{ maxWidth: 640 }}>
      <BarChart {...a} />
    </div>
  ),
};
export default meta;

export const Grouped = {};

export const Stacked = {
  args: { stacked: true },
};

export const Horizontal = {
  args: { horizontal: true, series: [{ key: 'visits', label: 'Visits' }], valueLabels: true },
};
