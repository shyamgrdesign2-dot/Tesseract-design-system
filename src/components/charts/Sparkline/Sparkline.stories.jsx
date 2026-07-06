import React from 'react';
import { Sparkline } from './Sparkline';

const trend = [8, 10, 9, 12, 11, 14, 13, 17, 16, 19];

const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A tiny, axis-less trend line for inline use — table cells, KPI tiles. Zero-dependency. Curve, area + fill opacity, all-point or last dot, dot colour/size, and a domain override.' } },
  },
  argTypes: {
    data: { control: false },
    width: { control: { type: 'range', min: 48, max: 240, step: 4 }, table: { category: 'Size' } },
    height: { control: { type: 'range', min: 16, max: 64, step: 2 }, table: { category: 'Size' } },
    color: { control: 'text', table: { category: 'Line' } },
    strokeWidth: { control: { type: 'range', min: 1, max: 4, step: 0.5 }, table: { category: 'Line' } },
    curve: { control: 'inline-radio', options: ['smooth', 'linear', 'step'], table: { category: 'Line' } },
    area: { control: 'boolean', table: { category: 'Fill' } },
    fillOpacity: { control: { type: 'range', min: 0, max: 0.5, step: 0.02 }, table: { category: 'Fill' } },
    showLastDot: { control: 'boolean', table: { category: 'Dots' } },
    markers: { control: 'boolean', table: { category: 'Dots' } },
    dotColor: { control: 'text', table: { category: 'Dots' } },
    dotRadius: { control: { type: 'range', min: 1, max: 5, step: 0.5 }, table: { category: 'Dots' } },
    min: { control: 'number', table: { category: 'Domain' } },
    max: { control: 'number', table: { category: 'Domain' } },
  },
  args: {
    data: trend,
    width: 120, height: 36,
    color: 'var(--tesseract-blue-500)', strokeWidth: 1.5, curve: 'smooth',
    area: true, fillOpacity: 0.15,
    showLastDot: true, markers: false, dotColor: '', dotRadius: undefined,
    min: undefined, max: undefined,
  },
};
export default meta;

export const Playground = {};
export const Markers = { args: { markers: true, area: false } };
export const InlineWithValue = {
  render: (a) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--tesseract-font-body)' }}>
      <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--tesseract-fg-heading)' }}>128/82</span>
      <Sparkline {...a} color="var(--tesseract-success-500)" />
    </div>
  ),
};
