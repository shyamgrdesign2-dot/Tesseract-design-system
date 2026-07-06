import React from 'react';
import { GaugeChart } from './GaugeChart';

const zones = [
  { upTo: 60, color: 'var(--tesseract-success-500)' },
  { upTo: 85, color: 'var(--tesseract-amber-500)' },
  { upTo: 100, color: 'var(--tesseract-error-500)' },
];

const meta = {
  title: 'Charts/GaugeChart',
  component: GaugeChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A single value against a range (KPI vs target) — zero-dependency (own arc geometry). Rounded arc, neutral track, value arc coloured by optional thresholds, centre readout, range labels. EMR use: bed occupancy %, goal completion, utilisation.' } },
  },
  argTypes: {
    segments: { control: false },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, table: { category: 'Value' } },
    min: { control: 'number', table: { category: 'Value' } },
    max: { control: 'number', table: { category: 'Value' } },
    label: { control: 'text', table: { category: 'Value' } },
    unit: { control: 'text', table: { category: 'Value' } },
    showValue: { control: 'boolean', table: { category: 'Value' } },
    showRange: { control: 'boolean', table: { category: 'Value' } },
    height: { control: { type: 'range', min: 120, max: 280, step: 10 }, table: { category: 'Arc' } },
    arcDegrees: { control: { type: 'range', min: 120, max: 300, step: 10 }, table: { category: 'Arc' } },
    thickness: { control: { type: 'range', min: 4, max: 32, step: 1 }, table: { category: 'Arc' } },
    rounded: { control: 'boolean', table: { category: 'Arc' } },
    color: { control: 'text', table: { category: 'Colour' } },
    trackColor: { control: 'text', table: { category: 'Colour' } },
  },
  args: {
    value: 72, min: 0, max: 100, label: 'Bed occupancy', unit: '%',
    showValue: true, showRange: true,
    height: 180, arcDegrees: 240, thickness: undefined, rounded: true,
    color: 'var(--tesseract-blue-500)', trackColor: 'var(--tesseract-slate-100)',
  },
  render: (a) => <GaugeChart {...a} />,
};
export default meta;

export const Playground = {};
export const Thresholds = {
  args: { value: 88, label: 'Occupancy', unit: '%', segments: zones },
  render: (a) => <GaugeChart {...a} />,
};
export const Row = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <GaugeChart value={72} label="Bed occupancy" unit="%" segments={zones} />
      <GaugeChart value={45} label="OT utilisation" unit="%" segments={zones} />
      <GaugeChart value={93} label="Pharmacy stock" unit="%" segments={zones} />
    </div>
  ),
};
