import { Skeleton } from './Skeleton';

const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    docs: {
      description: {
        component: [
          'A shimmering placeholder that holds a content shape while its data loads.',
          '',
          '**When to use** — filling the layout during an initial fetch so the page does not jump: table rows, a profile hero, card lists. Mirror the real content with `variant` + sizing so nothing shifts on swap-in.',
          '**When not** — a brief inline or indeterminate wait with no known shape is `LoadingIndicator`; an empty result (not loading) is an empty-state, not a skeleton.',
          '',
          '**Key props** — `variant` is `text` / `circular` / `rectangular`; `width` + `height` accept px or any CSS length; `count` stacks lines (last text line auto-shortens); `animation` is `pulse` / `wave` / `none`; `radius` and `speed` fine-tune shape and timing.',
          '',
          '**Good to know** — animation is automatically suppressed under `prefers-reduced-motion`. Match each skeleton to the element it replaces (an avatar = `circular`, a thumbnail = `rectangular`) so the loaded state lands without reflow.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'circular', 'rectangular'], description: 'Shape to mimic — line of text, avatar, or block' },
    width: { control: 'text', description: 'px or any CSS length (e.g. "60%")' },
    height: { control: 'text', description: 'px or any CSS length; text infers from font' },
    radius: { control: 'select', options: ['default', 'sharp', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', 'pill'], description: "Restricted radius — a px step, or 'pill' / 'sharp'. 'default' keeps the size default." },
    count: { control: { type: 'number', min: 1 }, description: 'Number of stacked skeletons. For variant="text" the last line is shortened.' },
    animation: { control: 'inline-radio', options: ['pulse', 'wave', 'none'], description: 'pulse (default) · wave shimmer · none. Disabled under prefers-reduced-motion.' },
    speed: { control: 'text', description: 'Animation duration — seconds number or any CSS time (e.g. "2s"). Default ~1.5s.' },
  },
  args: {
    variant: 'text',
    count: 1,
    animation: 'pulse',
  },
};

export default meta;

// Coerce a pure-number speed string to a number; pass CSS time strings through;
// blank → undefined (component default).
const speedValue = (s) => {
  const v = String(s ?? '').trim();
  if (!v) return undefined;
  return /^-?\d*\.?\d+$/.test(v) ? Number(v) : v;
};

// A radius control comes in as a string. Coerce a pure-number string to a number;
// pass keywords / tokens through; blank → undefined (component default).
const radiusValue = (r) => {
  const s = String(r ?? '').trim();
  if (!s || s === 'default') return undefined;
  return /^-?\d+$/.test(s) ? Number(s) : s;
};

// Build a copy-paste snippet from the controls (what "Show code" shows).
const skeletonCode = ({ variant = 'text', width, height, radius, count = 1, animation = 'pulse', speed }) => {
  const lines = [`  variant="${variant}"`];
  if (width) lines.push(typeof width === 'number' ? `  width={${width}}` : `  width="${width}"`);
  if (height) lines.push(typeof height === 'number' ? `  height={${height}}` : `  height="${height}"`);
  const rv = radiusValue(radius);
  if (rv != null) lines.push(typeof rv === 'number' ? `  radius={${rv}}` : `  radius="${rv}"`);
  if (count && count !== 1) lines.push(`  count={${count}}`);
  if (animation && animation !== 'pulse') lines.push(`  animation="${animation}"`);
  const sv = speedValue(speed);
  if (sv != null) lines.push(typeof sv === 'number' ? `  speed={${sv}}` : `  speed="${sv}"`);
  return `<Skeleton\n${lines.join('\n')}\n/>`;
};

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {
  render: ({ speed, radius, ...args }) => (
    <div style={{ width: 240 }}>
      <Skeleton {...args} radius={radiusValue(radius)} speed={speedValue(speed)} />
    </div>
  ),
  parameters: { docs: { source: { transform: (_code, ctx) => skeletonCode(ctx.args) } } },
};

export const Variants = {
  render: () => (
    <div style={{ width: 240, display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #54545C)' }}>text</strong>
        <Skeleton variant="text" />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #54545C)' }}>circular</strong>
        <Skeleton variant="circular" />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #54545C)' }}>rectangular</strong>
        <Skeleton variant="rectangular" height={80} />
      </div>
    </div>
  ),
};

export const TextLines = {
  render: () => (
    <div style={{ width: 280, display: 'grid', gap: 8 }}>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="75%" />
    </div>
  ),
};

/** Multi-line text block via `count` — the last line is auto-shortened (~60%). */
export const MultiLineCount = {
  name: 'Count (multi-line text)',
  render: () => (
    <div style={{ width: 320, display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #54545C)' }}>count={3}</strong>
        <Skeleton variant="text" count={3} />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #54545C)' }}>count={5}</strong>
        <Skeleton variant="text" count={5} />
      </div>
    </div>
  ),
};

/** Animation modes — pulse (default) · wave shimmer · none (static). */
export const Animations = {
  render: () => (
    <div style={{ width: 280, display: 'grid', gap: 16 }}>
      {['pulse', 'wave', 'none'].map((a) => (
        <div key={a} style={{ display: 'grid', gap: 8 }}>
          <strong style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #54545C)' }}>{a}</strong>
          <Skeleton variant="text" animation={a} count={2} />
        </div>
      ))}
    </div>
  ),
};

export const Circular = {
  render: () => (
    <Row>
      <Skeleton variant="circular" width={28} />
      <Skeleton variant="circular" width={40} />
      <Skeleton variant="circular" width={56} />
    </Row>
  ),
};

export const CardPlaceholder = {
  render: () => (
    <div
      style={{
        width: 280,
        padding: 16,
        border: '1px solid var(--tesseract-slate-200, #e2e2ea)',
        borderRadius: 12,
        display: 'grid',
        gap: 12,
      }}
    >
      <Skeleton variant="rectangular" height={120} radius={8} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circular" width={40} />
        <div style={{ flex: 1, display: 'grid', gap: 8 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Patient row loading state — simulates a table body while data fetches. */
export const PatientTableRows = {
  name: '🏥 Patient Table Rows',
  render: () => (
    <div style={{ width: 640, border: '1px solid #E2E2EA', borderRadius: 10, overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'grid', gridTemplateColumns: '40px 200px 1fr 100px 80px', gap: 16, padding: '10px 16px', background: '#F7F7FB', borderBottom: '1px solid #E2E2EA' }}>
        {['', 'Patient', 'Dept / Doctor', 'Status', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 11, fontWeight: 600, color: '#54545C', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>{h}</div>
        ))}
      </div>
      {/* skeleton rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 200px 1fr 100px 80px', gap: 16, padding: '12px 16px', borderBottom: '1px solid #F0F0F6', alignItems: 'center' }}>
          <Skeleton variant="circular" width={32} />
          <div style={{ display: 'grid', gap: 5 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div style={{ display: 'grid', gap: 5 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
          <Skeleton variant="text" width={70} />
          <Skeleton variant="text" width={60} />
        </div>
      ))}
    </div>
  ),
};

/** Patient profile hero — avatar + name + vitals loading state. */
export const PatientProfileHero = {
  name: '👤 Patient Profile Hero',
  render: () => (
    <div style={{ width: 520, padding: 24, border: '1px solid #E2E2EA', borderRadius: 14, background: '#fff', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* header */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Skeleton variant="circular" width={64} />
        <div style={{ flex: 1, display: 'grid', gap: 8 }}>
          <Skeleton variant="text" width="55%" />
          <Skeleton variant="text" width="40%" />
          <div style={{ display: 'flex', gap: 8 }}>
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={80} />
          </div>
        </div>
        <Skeleton variant="rectangular" width={100} height={32} radius={6} />
      </div>
      {/* vitals strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ padding: '12px 10px', border: '1px solid #F0F0F6', borderRadius: 10, display: 'grid', gap: 6 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="40%" />
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Appointment card loading state — 3 upcoming slots. */
export const AppointmentCardList = {
  name: '📅 Appointment Cards Loading',
  render: () => (
    <div style={{ width: 420, display: 'grid', gap: 12 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ padding: 16, border: '1px solid #E2E2EA', borderRadius: 10, display: 'flex', gap: 14, alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={48} height={52} radius={8} />
          <div style={{ flex: 1, display: 'grid', gap: 7 }}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="45%" />
            <Skeleton variant="text" width="55%" />
          </div>
          <Skeleton variant="rectangular" width={64} height={28} radius={6} />
        </div>
      ))}
    </div>
  ),
};
