import React from 'react';
import { LineChart } from './LineChart';
import { formatIndian } from '../internal/lib';

const money = [
  { day: '30 Jun', collected: 260000, refunded: 12000 },
  { day: '01 Jul', collected: 90000, refunded: 9000 },
  { day: '02 Jul', collected: 150000, refunded: 15000 },
  { day: '03 Jul', collected: 190000, refunded: 8000 },
  { day: '04 Jul', collected: 120000, refunded: 11000 },
  { day: '05 Jul', collected: 95000, refunded: 7000 },
  { day: '06 Jul', collected: 210000, refunded: 13000 },
];

const week = [
  { day: 'Mon', visits: 42, walkins: 12 },
  { day: 'Tue', visits: 38, walkins: 9 },
  { day: 'Wed', visits: 55, walkins: 18 },
  { day: 'Thu', visits: 47, walkins: 14 },
  { day: 'Fri', visits: 63, walkins: 21 },
  { day: 'Sat', visits: 71, walkins: 27 },
  { day: 'Sun', visits: 29, walkins: 8 },
];
const month = Array.from({ length: 30 }, (_, i) => ({ day: `D${i + 1}`, visits: Math.round(40 + 22 * Math.sin(i / 3) + (i % 5) * 3) }));

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Multi-series trend chart — zero-dependency (pure SVG + own scales/curves). Deeply configurable: curve, area, markers, y-domain, axis titles, grid style, legend position, tooltip crosshair, and wheel/drag zoom + pan with a toolbar (CSV export). Defaults preserve the standard look.' } },
  },
  argTypes: {
    data: { control: false }, series: { control: false }, xKey: { control: false },
    // Size
    height: { control: { type: 'range', min: 160, max: 400, step: 10 }, table: { category: 'Size' } },
    // Line
    curve: { control: 'inline-radio', options: ['smooth', 'linear', 'step'], table: { category: 'Line' } },
    strokeWidth: { control: { type: 'range', min: 1, max: 5, step: 0.5 }, table: { category: 'Line' } },
    area: { control: 'boolean', table: { category: 'Line' } },
    areaOpacity: { control: { type: 'range', min: 0, max: 0.6, step: 0.02 }, table: { category: 'Line' } },
    markers: { control: 'boolean', table: { category: 'Line' } },
    markerSize: { control: { type: 'range', min: 1.5, max: 6, step: 0.5 }, table: { category: 'Line' } },
    // Value axis
    yMin: { control: 'number', table: { category: 'Value axis' } },
    yMax: { control: 'number', table: { category: 'Value axis' } },
    yTickCount: { control: { type: 'range', min: 2, max: 10, step: 1 }, table: { category: 'Value axis' } },
    showYAxis: { control: 'boolean', table: { category: 'Value axis' } },
    yAxisLabel: { control: 'text', table: { category: 'Value axis' } },
    // Category axis
    showXAxis: { control: 'boolean', table: { category: 'Category axis' } },
    xAxisLabel: { control: 'text', table: { category: 'Category axis' } },
    xTickCount: { control: { type: 'range', min: 2, max: 12, step: 1 }, table: { category: 'Category axis' } },
    // Grid
    showGrid: { control: 'boolean', table: { category: 'Grid' } },
    gridStyle: { control: 'inline-radio', options: ['solid', 'dashed'], table: { category: 'Grid' } },
    showVerticalGrid: { control: 'boolean', table: { category: 'Grid' } },
    // Legend
    showLegend: { control: 'boolean', table: { category: 'Legend' } },
    legendPosition: { control: 'inline-radio', options: ['top', 'bottom'], table: { category: 'Legend' } },
    legendAlign: { control: 'inline-radio', options: ['start', 'center', 'end'], table: { category: 'Legend' } },
    // Interaction
    showTooltip: { control: 'boolean', table: { category: 'Interaction' } },
    showCrosshair: { control: 'boolean', table: { category: 'Interaction' } },
    zoomable: { control: 'boolean', table: { category: 'Interaction' } },
    showToolbar: { control: 'boolean', table: { category: 'Interaction' } },
  },
  args: {
    data: week,
    xKey: 'day',
    series: [{ key: 'visits', label: 'Visits' }, { key: 'walkins', label: 'Walk-ins' }],
    height: 260,
    curve: 'smooth', strokeWidth: 2, area: true, areaOpacity: 0.14, markers: false, markerSize: 2.5,
    yMin: undefined, yMax: undefined, yTickCount: 5, showYAxis: true, yAxisLabel: '',
    showXAxis: true, xAxisLabel: '', xTickCount: 6,
    showGrid: true, gridStyle: 'solid', showVerticalGrid: false,
    showLegend: true, legendPosition: 'bottom', legendAlign: 'start',
    showTooltip: true, showCrosshair: true, zoomable: false, showToolbar: false,
  },
  render: (a) => <div style={{ maxWidth: 640 }}><LineChart {...a} /></div>,
};
export default meta;

export const Playground = {};
export const MarkersStep = { args: { area: false, markers: true, curve: 'step' } };
/** Money series with the Indian ₹ compact axis (2.6L, 65k) — like "Collection vs refund". */
export const MoneyIndian = { args: { data: money, series: [{ key: 'collected', label: 'Collected' }, { key: 'refunded', label: 'Refunded' }], yFormat: formatIndian, area: false } };
export const ZoomAndPan = { args: { data: month, series: [{ key: 'visits', label: 'Daily visits' }], area: true, zoomable: true, showToolbar: true, yAxisLabel: 'Visits', xAxisLabel: 'Day' } };
