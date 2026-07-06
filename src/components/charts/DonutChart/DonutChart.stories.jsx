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
    docs: { description: { component: 'Part-to-whole composition — zero-dependency (own arc geometry). Donut or full pie; pad angle, start rotation, slice sort, slice stroke, hover-expand, center total, legend value/%. Defaults preserve the standard donut look.' } },
  },
  argTypes: {
    data: { control: false },
    // Ring
    height: { control: { type: 'range', min: 160, max: 340, step: 10 }, table: { category: 'Ring' } },
    innerRadius: { control: { type: 'range', min: 0, max: 0.85, step: 0.01 }, table: { category: 'Ring' } },
    padAngle: { control: { type: 'range', min: 0, max: 8, step: 0.5 }, table: { category: 'Ring' } },
    startAngle: { control: { type: 'range', min: 0, max: 360, step: 5 }, table: { category: 'Ring' } },
    sort: { control: 'inline-radio', options: ['none', 'desc', 'asc'], table: { category: 'Ring' } },
    sliceStroke: { control: { type: 'range', min: 0, max: 6, step: 0.5 }, table: { category: 'Ring' } },
    hoverExpand: { control: { type: 'range', min: 0, max: 12, step: 1 }, table: { category: 'Ring' } },
    // Center
    showCenter: { control: 'boolean', table: { category: 'Center' } },
    centerLabel: { control: 'text', table: { category: 'Center' } },
    // Legend
    legend: { control: 'inline-radio', options: ['right', 'bottom', 'none'], table: { category: 'Legend' } },
    showValue: { control: 'boolean', table: { category: 'Legend' } },
    showPercent: { control: 'boolean', table: { category: 'Legend' } },
    // Interaction
    showTooltip: { control: 'boolean', table: { category: 'Interaction' } },
  },
  args: {
    data: payerMix,
    height: 240,
    innerRadius: 0.62, padAngle: 0, startAngle: 0, sort: 'none', sliceStroke: 2, hoverExpand: 4,
    showCenter: true, centerLabel: 'Collections',
    legend: 'right', showValue: true, showPercent: true,
    showTooltip: true,
  },
  render: (a) => <div style={{ maxWidth: 520 }}><DonutChart {...a} /></div>,
};
export default meta;

export const Donut = {};
export const GappedSorted = { args: { padAngle: 3, sort: 'desc', sliceStroke: 0 } };
export const Pie = { render: (a) => <div style={{ maxWidth: 520 }}><PieChart {...a} /></div> };
