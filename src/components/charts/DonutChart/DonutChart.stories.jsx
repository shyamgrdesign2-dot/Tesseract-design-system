import React from 'react';
import { DonutChart, PieChart } from './DonutChart';

const payerMix = [
  { label: 'Cash', value: 480 },
  { label: 'Insurance', value: 320 },
  { label: 'Corporate', value: 150 },
  { label: 'Govt scheme', value: 90 },
];

const meta = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Part-to-whole composition — zero-dependency (own arc geometry).',
          '',
          '**Features** — donut (center total) or full **pie** (`innerRadius=0` / `<PieChart>`), hover-to-expand slices, an interactive tooltip, and a legend listing value + %.',
          '',
          '**EMR use** — payer/payment mix, case-type split, patient demographics. Token-only colours.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    data: { control: false },
    innerRadius: { control: { type: 'range', min: 0, max: 0.85, step: 0.01 }, table: { category: 'Appearance' } },
    height: { control: { type: 'range', min: 160, max: 320, step: 10 }, table: { category: 'Appearance' } },
    centerLabel: { control: 'text', table: { category: 'Content' } },
    showCenter: { control: 'boolean', table: { category: 'Appearance' } },
    legend: { control: 'inline-radio', options: ['right', 'bottom', 'none'], table: { category: 'Behaviour' } },
    showTooltip: { control: 'boolean', table: { category: 'Behaviour' } },
  },
  args: {
    data: payerMix,
    height: 240,
    innerRadius: 0.62,
    centerLabel: 'Collections',
    showCenter: true,
    legend: 'right',
    showTooltip: true,
  },
  render: (a) => (
    <div style={{ maxWidth: 520 }}>
      <DonutChart {...a} />
    </div>
  ),
};
export default meta;

export const Donut = {};

export const Pie = {
  render: (a) => (
    <div style={{ maxWidth: 520 }}>
      <PieChart {...a} />
    </div>
  ),
};
