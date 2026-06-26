import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from '@/src/components/atoms/Button';
import { Badge } from '@/src/components/atoms/Badge';
import { Avatar } from '@/src/components/atoms/Avatar';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

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
    tone: { control: 'inline-radio', options: ['neutral', 'primary', 'success', 'warning', 'error', 'violet'], table: { category: 'Appearance' } },
    gradient: { control: 'boolean', description: 'Branded gradient fill (in tone) + light text', table: { category: 'Appearance' } },
    pattern: { control: 'inline-radio', options: ['dots', 'grid', 'none'], description: 'Texture over the gradient', table: { category: 'Appearance' } },
    background: { control: 'color', description: 'Custom background override', table: { category: 'Appearance' } },
    interactive: { control: 'boolean', description: 'Hover-lift for clickable cards', table: { category: 'Appearance' } },
  },
  args: { variant: 'default', padding: 'md', radius: 'default', tone: 'neutral', gradient: false, pattern: 'dots', interactive: false },
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

/** Gradient hero cards — branded gradient + pattern + light text, per tone. */
export const GradientCards = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {[['primary', 'dots'], ['violet', 'grid'], ['success', 'dots']].map(([tone, pattern]) => (
        <Card key={tone} gradient tone={tone} pattern={pattern} padding="lg" style={{ width: 240 }}>
          <CardHeader>
            <span style={{ display: 'inline-flex', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--tesseract-radius-12)', background: 'color-mix(in srgb, var(--tesseract-on-dark) 18%, transparent)' }}>
              <TPLibraryIcon name="health" variant="bulk" size={22} color="var(--tesseract-on-dark)" />
            </span>
            <CardTitle style={{ textTransform: 'capitalize' }}>{tone} plan</CardTitle>
            <CardDescription>Includes consults, labs & follow-ups.</CardDescription>
          </CardHeader>
          <CardFooter><Button size="sm" surface="dark" variant="solid">View</Button></CardFooter>
        </Card>
      ))}
    </div>
  ),
};

/** Icon card + profile card (composition with Avatar / icon disc). */
export const IconAndProfile = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Card variant="elevated" style={{ width: 260 }}>
        <CardHeader style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'inline-flex', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--tesseract-radius-12)', background: 'var(--tesseract-blue-50)' }}>
            <TPLibraryIcon name="calendar-1" variant="bulk" size={24} color="var(--tesseract-blue-600)" />
          </span>
          <div><CardTitle>Appointments</CardTitle><CardDescription>12 scheduled today</CardDescription></div>
        </CardHeader>
      </Card>
      <Card variant="default" interactive style={{ width: 260 }}>
        <CardHeader style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar name="Shyam GR" size="md" />
          <div><CardTitle>Shyam GR</CardTitle><CardDescription>M · 35y · MRN-0061</CardDescription></div>
        </CardHeader>
        <CardFooter><Badge variant="soft" color="success" size="sm">Active</Badge></CardFooter>
      </Card>
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
