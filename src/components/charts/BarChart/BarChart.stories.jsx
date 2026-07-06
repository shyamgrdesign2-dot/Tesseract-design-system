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
    docs: { description: { component: 'Categorical comparison — zero-dependency. Grouped/stacked, vertical/horizontal, bar radius + padding, y-domain, grid style, axis titles, legend position, value labels, hover dimming. Defaults preserve the standard look.' } },
  },
  argTypes: {
    data: { control: false }, series: { control: false }, xKey: { control: false },
    height: { control: { type: 'range', min: 180, max: 460, step: 10 }, table: { category: 'Size' } },
    // Layout
    stacked: { control: 'boolean', table: { category: 'Layout' } },
    horizontal: { control: 'boolean', table: { category: 'Layout' } },
    // Bars
    barRadius: { control: { type: 'range', min: 0, max: 12, step: 1 }, table: { category: 'Bars' } },
    barPadding: { control: { type: 'range', min: 0, max: 0.8, step: 0.05 }, table: { category: 'Bars' } },
    groupPadding: { control: { type: 'range', min: 0, max: 0.6, step: 0.02 }, table: { category: 'Bars' } },
    barOpacity: { control: { type: 'range', min: 0.2, max: 1, step: 0.05 }, table: { category: 'Bars' } },
    dimOnHover: { control: 'boolean', table: { category: 'Bars' } },
    valueLabels: { control: 'boolean', table: { category: 'Bars' } },
    // Value axis
    yMin: { control: 'number', table: { category: 'Value axis' } },
    yMax: { control: 'number', table: { category: 'Value axis' } },
    yTickCount: { control: { type: 'range', min: 2, max: 10, step: 1 }, table: { category: 'Value axis' } },
    showValueAxis: { control: 'boolean', table: { category: 'Value axis' } },
    valueAxisLabel: { control: 'text', table: { category: 'Value axis' } },
    // Category axis
    showCategoryAxis: { control: 'boolean', table: { category: 'Category axis' } },
    categoryAxisLabel: { control: 'text', table: { category: 'Category axis' } },
    // Grid / legend / interaction
    showGrid: { control: 'boolean', table: { category: 'Grid' } },
    gridStyle: { control: 'inline-radio', options: ['solid', 'dashed'], table: { category: 'Grid' } },
    showLegend: { control: 'boolean', table: { category: 'Legend' } },
    legendPosition: { control: 'inline-radio', options: ['top', 'bottom'], table: { category: 'Legend' } },
    legendAlign: { control: 'inline-radio', options: ['start', 'center', 'end'], table: { category: 'Legend' } },
    showTooltip: { control: 'boolean', table: { category: 'Interaction' } },
    showToolbar: { control: 'boolean', table: { category: 'Interaction' } },
  },
  args: {
    data: byDept,
    xKey: 'dept',
    series: [{ key: 'visits', label: 'Visits' }, { key: 'walkins', label: 'Walk-ins' }],
    height: 280,
    stacked: false, horizontal: false,
    barRadius: 3, barPadding: 0.3, groupPadding: 0.18, barOpacity: 1, dimOnHover: true, valueLabels: false,
    yMin: 0, yMax: undefined, yTickCount: 5, showValueAxis: true, valueAxisLabel: '',
    showCategoryAxis: true, categoryAxisLabel: '',
    showGrid: true, gridStyle: 'solid',
    showLegend: true, legendPosition: 'bottom', legendAlign: 'start',
    showTooltip: true, showToolbar: false,
  },
  render: (a) => <div style={{ maxWidth: 640 }}><BarChart {...a} /></div>,
};
export default meta;

export const Grouped = {};
export const Stacked = { args: { stacked: true } };
export const Horizontal = { args: { horizontal: true, series: [{ key: 'visits', label: 'Visits' }], valueLabels: true, barRadius: 4 } };
