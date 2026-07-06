import React from 'react';
import { RadarChart } from './RadarChart';

const scores = [
  { axis: 'Mobility', pre: 40, post: 78 },
  { axis: 'Pain', pre: 30, post: 70 },
  { axis: 'Sleep', pre: 55, post: 82 },
  { axis: 'Appetite', pre: 62, post: 74 },
  { axis: 'Mood', pre: 45, post: 80 },
  { axis: 'Energy', pre: 38, post: 72 },
];

const meta = {
  title: 'Charts/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Multi-variable comparison across 3+ axes — zero-dependency (own polar geometry). One polygon per series over shared axes; grid rings, per-axis hover tooltip, legend toggle. EMR use: symptom/quality scores pre vs post, assessment profiles.' } },
  },
  argTypes: {
    data: { control: false }, series: { control: false }, axisKey: { control: false },
    height: { control: { type: 'range', min: 220, max: 420, step: 10 }, table: { category: 'Size' } },
    max: { control: 'number', table: { category: 'Scale' } },
    levels: { control: { type: 'range', min: 2, max: 6, step: 1 }, table: { category: 'Scale' } },
    fillOpacity: { control: { type: 'range', min: 0, max: 0.5, step: 0.02 }, table: { category: 'Shape' } },
    strokeWidth: { control: { type: 'range', min: 1, max: 4, step: 0.5 }, table: { category: 'Shape' } },
    dot: { control: 'boolean', table: { category: 'Shape' } },
    showGrid: { control: 'boolean', table: { category: 'Chrome' } },
    showAxisLabels: { control: 'boolean', table: { category: 'Chrome' } },
    showLegend: { control: 'boolean', table: { category: 'Chrome' } },
    showTooltip: { control: 'boolean', table: { category: 'Chrome' } },
    legendAlign: { control: 'inline-radio', options: ['start', 'center', 'end'], table: { category: 'Chrome' } },
  },
  args: {
    data: scores,
    axisKey: 'axis',
    series: [{ key: 'pre', label: 'Admission' }, { key: 'post', label: 'Discharge' }],
    height: 300, max: 100, levels: 4,
    fillOpacity: 0.15, strokeWidth: 2, dot: true,
    showGrid: true, showAxisLabels: true, showLegend: true, showTooltip: true, legendAlign: 'center',
  },
  render: (a) => <div style={{ maxWidth: 420 }}><RadarChart {...a} /></div>,
};
export default meta;

export const Playground = {};
export const SingleSeries = { args: { series: [{ key: 'post', label: 'Score' }], dot: true } };
