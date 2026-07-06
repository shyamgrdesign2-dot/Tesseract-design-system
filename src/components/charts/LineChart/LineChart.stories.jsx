import React from 'react';
import { LineChart } from './LineChart';

const week = [
  { day: 'Mon', visits: 42, walkins: 12 },
  { day: 'Tue', visits: 38, walkins: 9 },
  { day: 'Wed', visits: 55, walkins: 18 },
  { day: 'Thu', visits: 47, walkins: 14 },
  { day: 'Fri', visits: 63, walkins: 21 },
  { day: 'Sat', visits: 71, walkins: 27 },
  { day: 'Sun', visits: 29, walkins: 8 },
];

// A longer daily series for the zoom/pan demo.
const month = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  visits: Math.round(40 + 22 * Math.sin(i / 3) + (i % 5) * 3),
}));

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A multi-series trend chart — zero-dependency (pure SVG + own scales/curves).',
          '',
          '**Features** — smooth or straight curves, optional area fill and point markers, gridlines, an interactive tooltip crosshair, a click-to-toggle legend, and optional wheel/drag **zoom + pan** with a toolbar (incl. CSV export).',
          '',
          '**EMR use** — visits/walk-ins over time, a vital trend, revenue by day. Token-only colours; responsive width.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    data: { control: false },
    series: { control: false },
    xKey: { control: false },
    curve: { control: 'inline-radio', options: ['smooth', 'linear'], table: { category: 'Appearance' } },
    area: { control: 'boolean', table: { category: 'Appearance' } },
    markers: { control: 'boolean', table: { category: 'Appearance' } },
    height: { control: { type: 'range', min: 160, max: 400, step: 10 }, table: { category: 'Appearance' } },
    zoomable: { control: 'boolean', table: { category: 'Behaviour' } },
    showGrid: { control: 'boolean', table: { category: 'Behaviour' } },
    showLegend: { control: 'boolean', table: { category: 'Behaviour' } },
    showTooltip: { control: 'boolean', table: { category: 'Behaviour' } },
    showToolbar: { control: 'boolean', table: { category: 'Behaviour' } },
  },
  args: {
    data: week,
    xKey: 'day',
    series: [
      { key: 'visits', label: 'Visits' },
      { key: 'walkins', label: 'Walk-ins' },
    ],
    height: 260,
    curve: 'smooth',
    area: true,
    markers: false,
    zoomable: false,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    showToolbar: false,
  },
  render: (a) => (
    <div style={{ maxWidth: 640 }}>
      <LineChart {...a} />
    </div>
  ),
};
export default meta;

export const Playground = {};

export const MultiSeriesMarkers = {
  args: { area: false, markers: true },
};

export const ZoomAndPan = {
  args: {
    data: month,
    series: [{ key: 'visits', label: 'Daily visits' }],
    area: true,
    zoomable: true,
    showToolbar: true,
  },
};
