import React from 'react';
import { Sparkline } from './Sparkline';

const trend = [8, 10, 9, 12, 11, 14, 13, 17, 16, 19];

const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A tiny, axis-less trend line for inline use — table cells, KPI tiles, list rows. Zero-dependency.',
          '',
          '**EMR use** — a vital’s 7-day trend beside a value, per-row activity. Accepts numbers or objects + `valueKey`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    data: { control: false },
    width: { control: { type: 'range', min: 48, max: 240, step: 4 }, table: { category: 'Appearance' } },
    height: { control: { type: 'range', min: 16, max: 64, step: 2 }, table: { category: 'Appearance' } },
    color: { control: 'text', table: { category: 'Appearance' } },
    area: { control: 'boolean', table: { category: 'Appearance' } },
    curve: { control: 'inline-radio', options: ['smooth', 'linear'], table: { category: 'Appearance' } },
    showLastDot: { control: 'boolean', table: { category: 'Appearance' } },
  },
  args: {
    data: trend,
    width: 120,
    height: 36,
    color: 'var(--tesseract-blue-500)',
    area: true,
    curve: 'smooth',
    showLastDot: true,
  },
};
export default meta;

export const Playground = {};

export const InlineWithValue = {
  render: (a) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--tesseract-font-body)' }}>
      <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--tesseract-fg-heading)' }}>128/82</span>
      <Sparkline {...a} color="var(--tesseract-success-500)" />
    </div>
  ),
};
