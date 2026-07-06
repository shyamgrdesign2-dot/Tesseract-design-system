import React from 'react';
import { StatCard } from './StatCard';

const spark = [12, 14, 13, 16, 15, 19, 22, 21, 24, 27];
const inr = (v) => `₹${Number(v).toLocaleString('en-IN')}`;
const barsGlyph = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 13V7M8 13V3M13 13V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
);

const meta = {
  title: 'Charts/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A KPI tile — label, big value, auto-coloured delta chip, and an inline Sparkline. Zero-dependency. Variant, size, alignment, and full spark controls. `invertDelta` when down is good (e.g. no-shows).' } },
  },
  argTypes: {
    spark: { control: false },
    // Content
    label: { control: 'text', table: { category: 'Content' } },
    value: { control: 'text', table: { category: 'Content' } },
    delta: { control: { type: 'number' }, table: { category: 'Content' } },
    deltaSuffix: { control: 'text', table: { category: 'Content' } },
    footer: { control: 'text', table: { category: 'Content' } },
    // Delta
    invertDelta: { control: 'boolean', table: { category: 'Delta' } },
    trend: { control: 'inline-radio', options: [undefined, 'up', 'down', 'flat'], table: { category: 'Delta' } },
    // Spark
    showSparkline: { control: 'boolean', table: { category: 'Spark' } },
    sparkPosition: { control: 'inline-radio', options: ['bottom', 'side', 'none'], table: { category: 'Spark' } },
    sparkColor: { control: 'text', table: { category: 'Spark' } },
    sparkArea: { control: 'boolean', table: { category: 'Spark' } },
    sparkCurve: { control: 'inline-radio', options: ['smooth', 'linear', 'step'], table: { category: 'Spark' } },
    // Look
    variant: { control: 'inline-radio', options: ['surface', 'soft', 'outline'], table: { category: 'Look' } },
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Look' } },
    align: { control: 'inline-radio', options: ['left', 'center'], table: { category: 'Look' } },
    iconPosition: { control: 'inline-radio', options: ['left', 'right'], table: { category: 'Look' } },
    deltaPlacement: { control: 'inline-radio', options: ['header', 'below'], table: { category: 'Look' } },
    bordered: { control: 'boolean', table: { category: 'Look' } },
  },
  args: {
    label: 'Appointments today',
    value: 128,
    delta: 12.5, deltaSuffix: '%', footer: 'vs. last week',
    invertDelta: false, trend: undefined,
    spark, showSparkline: true, sparkPosition: 'bottom', sparkColor: 'var(--tesseract-blue-500)', sparkArea: true, sparkCurve: 'smooth',
    variant: 'surface', size: 'md', align: 'left', iconPosition: 'left', deltaPlacement: 'header', bordered: true,
  },
  render: (a) => <div style={{ maxWidth: 280 }}><StatCard {...a} /></div>,
};
export default meta;

export const Playground = {};

export const Dashboard = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, maxWidth: 960 }}>
      <StatCard label="Appointments today" value={128} delta={12.5} spark={spark} sparkColor="var(--tesseract-blue-500)" footer="vs. last week" />
      <StatCard label="Collections" value={84200} format={(v) => `₹${(v / 1000).toFixed(1)}k`} delta={8.2} spark={[60, 62, 61, 66, 70, 72, 78, 80, 82, 84]} sparkColor="var(--tesseract-success-500)" footer="this month" />
      <StatCard label="No-show rate" value="6.4%" delta={-1.8} invertDelta spark={[11, 10, 9, 9, 8, 8, 7, 7, 6, 6]} sparkColor="var(--tesseract-violet-500)" footer="down is good" />
      <StatCard label="Bed occupancy" value="78%" delta={0} trend="flat" spark={[70, 72, 74, 73, 75, 77, 78, 78, 78, 78]} sparkColor="var(--tesseract-amber-500)" footer="stable" />
    </div>
  ),
};

/** Reference-style KPI row: icon top-right, delta below the value, no sparkline,
 *  ₹ Indian grouping — like the IPD "Key metrics" cards. */
export const KeyMetricsRow = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))', gap: 16, maxWidth: 1000 }}>
      <StatCard iconPosition="right" icon={barsGlyph} showSparkline={false} label="Total billed" value={2850000} format={inr} delta={-4} footer="vs previous period" />
      <StatCard iconPosition="right" icon={barsGlyph} showSparkline={false} label="Total collected" value={2410000} format={inr} delta={15} footer="vs previous period" />
      <StatCard iconPosition="right" icon={barsGlyph} showSparkline={false} label="Total bill due" value={440000} format={inr} delta={17} invertDelta footer="vs previous period" />
      <StatCard iconPosition="right" icon={barsGlyph} showSparkline={false} label="Total bill refunded" value={62000} format={inr} delta={-8} footer="vs previous period" />
    </div>
  ),
};

export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ width: 220 }}><StatCard variant="surface" label="Surface" value={128} delta={12.5} spark={spark} footer="vs. last week" /></div>
      <div style={{ width: 220 }}><StatCard variant="soft" label="Soft" value="₹84.2k" delta={8.2} spark={spark} sparkColor="var(--tesseract-success-500)" /></div>
      <div style={{ width: 220 }}><StatCard variant="outline" label="Outline" value="6.4%" delta={-1.8} invertDelta spark={[11, 10, 9, 9, 8, 8, 7, 7, 6, 6]} sparkColor="var(--tesseract-violet-500)" /></div>
      <div style={{ width: 220 }}><StatCard size="sm" align="center" sparkPosition="side" label="Compact · side spark" value="78%" trend="flat" delta={0} spark={spark} sparkColor="var(--tesseract-amber-500)" /></div>
    </div>
  ),
};
