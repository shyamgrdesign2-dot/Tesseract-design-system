import React from 'react';
import { StatCard } from './StatCard';

const spark = [12, 14, 13, 16, 15, 19, 22, 21, 24, 27];

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
    sparkColor: { control: 'text', table: { category: 'Spark' } },
    sparkArea: { control: 'boolean', table: { category: 'Spark' } },
    sparkCurve: { control: 'inline-radio', options: ['smooth', 'linear', 'step'], table: { category: 'Spark' } },
    // Look
    variant: { control: 'inline-radio', options: ['surface', 'soft', 'outline'], table: { category: 'Look' } },
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Look' } },
    align: { control: 'inline-radio', options: ['left', 'center'], table: { category: 'Look' } },
    bordered: { control: 'boolean', table: { category: 'Look' } },
  },
  args: {
    label: 'Appointments today',
    value: 128,
    delta: 12.5, deltaSuffix: '%', footer: 'vs. last week',
    invertDelta: false, trend: undefined,
    spark, showSparkline: true, sparkColor: 'var(--tesseract-blue-500)', sparkArea: true, sparkCurve: 'smooth',
    variant: 'surface', size: 'md', align: 'left', bordered: true,
  },
  render: (a) => <div style={{ maxWidth: 280 }}><StatCard {...a} /></div>,
};
export default meta;

export const Playground = {};

export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      <StatCard variant="surface" label="Surface" value={128} delta={12.5} spark={spark} footer="vs. last week" />
      <StatCard variant="soft" label="Soft" value="₹84.2k" delta={8.2} spark={spark} sparkColor="var(--tesseract-success-500)" />
      <StatCard variant="outline" label="Outline" value="6.4%" delta={-1.8} invertDelta spark={[11, 10, 9, 9, 8, 8, 7, 7, 6, 6]} sparkColor="var(--tesseract-violet-500)" />
      <StatCard size="sm" align="center" label="Compact / centered" value="78%" trend="flat" delta={0} spark={spark} sparkColor="var(--tesseract-amber-500)" />
    </div>
  ),
};
