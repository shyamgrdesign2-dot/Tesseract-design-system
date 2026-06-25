import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from '@/src/components/atoms/Button';
import { Badge } from '@/src/components/atoms/Badge';

const meta = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'The default surface container — dashboards, patient summary tiles, vitals panels, settings sections.',
          '',
          '**When to use** — group related content on a raised/bordered surface. Compose `CardHeader` + `CardTitle`/`CardDescription`, `CardContent`, `CardFooter`.',
          '**When not** — for a transient message use **Toast**; for a modal use **ConfirmDialog**.',
          '',
          '**Key props** — `variant` (default · outline · elevated), `padding` (none · sm · md · lg), `radius`.',
          '',
          '**Good to know** — token-only + self-contained; every part forwards refs and spreads props, so you can drop in any content. Compose the Button/Badge atoms inside.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'outline', 'elevated'], table: { category: 'Appearance' } },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'], table: { category: 'Appearance' } },
    radius: { control: 'select', options: ['default', 'sharp', '8', '12', '16', '20', '24'], table: { category: 'Appearance' } },
  },
  args: { variant: 'default', padding: 'md', radius: 'default' },
};
export default meta;

const radiusValue = (r) => { const s = String(r ?? '').trim(); if (!s || s === 'default') return undefined; return /^-?\d+$/.test(s) ? Number(s) : s; };

export const Playground = {
  render: ({ radius, ...a }) => (
    <Card {...a} radius={radiusValue(radius)} style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Patient summary</CardTitle>
        <CardDescription>MRN-10231 · last updated 2h ago</CardDescription>
      </CardHeader>
      <CardContent>3 active prescriptions · 1 pending lab result awaiting review.</CardContent>
      <CardFooter>
        <Button size="sm" variant="solid" theme="primary">Open record</Button>
        <Button size="sm" variant="ghost" theme="neutral">Dismiss</Button>
      </CardFooter>
    </Card>
  ),
};

/** The three surface variants. */
export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--tesseract-space-4)', flexWrap: 'wrap' }}>
      {['default', 'outline', 'elevated'].map((v) => (
        <Card key={v} variant={v} style={{ width: 240 }}>
          <CardHeader><CardTitle style={{ textTransform: 'capitalize' }}>{v}</CardTitle><CardDescription>Surface variant</CardDescription></CardHeader>
          <CardContent>Body content sits here.</CardContent>
        </Card>
      ))}
    </div>
  ),
};

/** A stat tile (header + value + trend badge). */
export const StatTile = {
  render: () => (
    <Card variant="elevated" style={{ width: 220 }}>
      <CardHeader><CardDescription>Appointments today</CardDescription></CardHeader>
      <CardContent style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--tesseract-space-2)' }}>
        <span style={{ fontSize: 32, fontWeight: 'var(--tesseract-weight-bold)', color: 'var(--tesseract-slate-900)' }}>32</span>
        <Badge color="success" variant="soft" size="sm">+12%</Badge>
      </CardContent>
    </Card>
  ),
};
