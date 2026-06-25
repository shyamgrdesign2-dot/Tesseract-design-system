import { Divider } from './Divider';

export default {
  title: 'Atoms/Divider',
  component: Divider,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    docs: {
      description: {
        component: [
          'A thin rule that separates content — horizontal between stacked sections, or vertical between inline items.',
          '',
          '**When to use** — splitting a list or card into labelled sections, separating inline meta (`Left | Middle | Right`), or an "OR" break between two choices via `label`.',
          '**When not** — if whitespace alone reads as a group boundary, prefer spacing over a rule; a heavy structural edge is a container `border`, not a Divider.',
          '',
          '**Key props** — `orientation` horizontal/vertical; `variant` solid bar vs `gradient` fade; `lineStyle` solid / dashed / dotted; `color` any token or CSS colour; `inset` indents both ends (or `{start,end}`); `label` + `labelPosition` for a centred/start/end caption (horizontal only).',
          '',
          '**Good to know** — a vertical divider needs a parent with a height to stretch into (a flex row with `align-items: center`). `label` is ignored on vertical orientation.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    orientation:   { control: 'inline-radio', options: ['horizontal', 'vertical'], description: 'Rule direction; vertical needs a sized parent' },
    variant:       { control: 'inline-radio', options: ['solid', 'gradient'], description: 'Solid bar, or a gradient that fades at the ends' },
    lineStyle:     { control: 'inline-radio', options: ['solid', 'dashed', 'dotted'], description: 'Rule rendering — solid bar, or dashed / dotted border' },
    color:         { control: 'text', description: 'Line colour — token or CSS value (default slate)' },
    spacing:       { control: 'number', description: 'Vertical margin above & below (px)' },
    thickness:     { control: 'number', description: 'Line weight in px (default 1)' },
    inset:         { control: 'number', description: 'Indents the line from both ends (px). Default 0 = full-bleed.' },
    label:         { control: 'text', description: 'Optional label rendered between two line segments (horizontal only)' },
    labelPosition: { control: 'inline-radio', options: ['center', 'start', 'end'], if: { arg: 'label', truthy: true }, description: 'Where the label sits along the line' },
  },
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    lineStyle: 'solid',
    color: 'var(--tesseract-slate-200, #E2E2EA)',
    spacing: 0,
    thickness: 1,
    inset: 0,
    label: '',
    labelPosition: 'center',
  },
};

// Build a copy-paste snippet from the controls (what "Show code" shows).
// Omits props left at their defaults so the snippet stays minimal.
const dividerCode = ({ orientation, variant, lineStyle, color, spacing, thickness, inset, label, labelPosition }) => {
  const lines = [];
  if (orientation && orientation !== 'horizontal') lines.push(`  orientation="${orientation}"`);
  if (variant && variant !== 'solid') lines.push(`  variant="${variant}"`);
  if (lineStyle && lineStyle !== 'solid') lines.push(`  lineStyle="${lineStyle}"`);
  if (color) lines.push(`  color="${color}"`);
  if (spacing) lines.push(`  spacing={${spacing}}`);
  if (thickness && thickness !== 1) lines.push(`  thickness={${thickness}}`);
  if (inset) lines.push(`  inset={${inset}}`);
  if (label) {
    lines.push(`  label="${label}"`);
    if (labelPosition && labelPosition !== 'center') lines.push(`  labelPosition="${labelPosition}"`);
  }
  return lines.length ? `<Divider\n${lines.join('\n')}\n/>` : `<Divider />`;
};

const Text = ({ children }) => (
  <p style={{ margin: 0, fontSize: 'var(--tesseract-text-body-sm)', color: 'var(--tesseract-slate-600, #54545C)' }}>{children}</p>
);

const Label = ({ children }) => (
  <span style={{ fontSize: 'var(--tesseract-text-caption-sm)', fontWeight: 'var(--tesseract-weight-semibold)', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--tesseract-slate-600, #54545C)' }}>
    {children}
  </span>
);

// ─── Playground ───────────────────────────────────────────────────────────────
export const Playground = {
  render: (args) =>
    args.orientation === 'vertical' ? (
      // Vertical needs a row container with a height to stretch into.
      <div style={{ display: 'flex', alignItems: 'center', height: 'var(--tesseract-space-16)', gap: 'var(--tesseract-space-4)' }}>
        <Text>Left</Text>
        <Divider {...args} />
        <Text>Middle</Text>
        <Divider {...args} />
        <Text>Right</Text>
      </div>
    ) : (
      <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Text>Above</Text>
        <Divider {...args} />
        <Text>Below</Text>
      </div>
    ),
  parameters: { docs: { source: { transform: (_code, ctx) => dividerCode(ctx.args) } } },
};

// ─── Line styles ──────────────────────────────────────────────────────────────
export const LineStyles = {
  name: '┄ Line styles',
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-5)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Solid (default)</Label>
        <Divider lineStyle="solid" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Dashed</Label>
        <Divider lineStyle="dashed" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Dotted</Label>
        <Divider lineStyle="dotted" />
      </div>
    </div>
  ),
};

// ─── Labelled ─────────────────────────────────────────────────────────────────
export const Labelled = {
  name: '⊟ Labelled',
  render: () => (
    <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-6)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Center (default)</Label>
        <Divider label="OR" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Start</Label>
        <Divider label="Recent" labelPosition="start" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>End</Label>
        <Divider label="Older" labelPosition="end" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Dashed line + label</Label>
        <Divider label="Section" lineStyle="dashed" />
      </div>
    </div>
  ),
};

// ─── Inset ────────────────────────────────────────────────────────────────────
export const Inset = {
  name: '↹ Inset',
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-5)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Full-bleed (inset 0)</Label>
        <Divider />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Inset 24px both ends</Label>
        <Divider inset={24} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Inset start only (e.g. aligned to list text)</Label>
        <Divider inset={{ start: 48, end: 0 }} />
      </div>
    </div>
  ),
};

// ─── Solid ────────────────────────────────────────────────────────────────────
export const Solid = {
  name: '— Solid',
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-5)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Default</Label>
        <Text>Section A</Text>
        <Divider spacing={4} />
        <Text>Section B</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Brand color</Label>
        <Divider color="var(--tesseract-blue-500, #4B4AD5)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Error color</Label>
        <Divider color="var(--tesseract-error-500, #E11D48)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Thick (2px)</Label>
        <Divider thickness={2} />
      </div>
    </div>
  ),
};

// ─── Gradient ─────────────────────────────────────────────────────────────────
export const Gradient = {
  name: '∿ Gradient',
  render: () => (
    <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-6)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Default slate — horizontal</Label>
        <Text>Section header</Text>
        <Divider variant="gradient" spacing={4} />
        <Text>Content below</Text>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Brand color — horizontal</Label>
        <Divider variant="gradient" color="var(--tesseract-blue-500, #4B4AD5)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Error color — horizontal</Label>
        <Divider variant="gradient" color="var(--tesseract-error-500, #E11D48)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Thick (2px) gradient</Label>
        <Divider variant="gradient" thickness={2} color="var(--tesseract-blue-400, #7776E0)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>On dark background</Label>
        <div style={{ background: 'linear-gradient(135deg,#1a1966,#0e0d3d)', padding: 'var(--tesseract-space-5) var(--tesseract-space-6)', borderRadius: 'var(--tesseract-radius-12)' }}>
          <Divider variant="gradient" color="color-mix(in srgb, var(--tesseract-slate-0) 50%, transparent)" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Vertical gradient</Label>
        <div style={{ display: 'flex', alignItems: 'center', height: 'var(--tesseract-space-12)', gap: 'var(--tesseract-space-4)' }}>
          <span style={{ fontSize: 'var(--tesseract-text-body-sm)' }}>Left</span>
          <Divider variant="gradient" orientation="vertical" color="var(--tesseract-slate-400, #54545C)" />
          <span style={{ fontSize: 'var(--tesseract-text-body-sm)' }}>Middle</span>
          <Divider variant="gradient" orientation="vertical" color="var(--tesseract-blue-500, #4B4AD5)" />
          <span style={{ fontSize: 'var(--tesseract-text-body-sm)' }}>Right</span>
        </div>
      </div>
    </div>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────
export const Vertical = {
  name: '| Vertical',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-4)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Solid</Label>
        <div style={{ display: 'flex', alignItems: 'center', height: 'var(--tesseract-space-10)', gap: 0 }}>
          <span style={{ padding: '0 var(--tesseract-space-3)', fontSize: 'var(--tesseract-text-body-sm)' }}>Left</span>
          <Divider orientation="vertical" />
          <span style={{ padding: '0 var(--tesseract-space-3)', fontSize: 'var(--tesseract-text-body-sm)' }}>Middle</span>
          <Divider orientation="vertical" />
          <span style={{ padding: '0 var(--tesseract-space-3)', fontSize: 'var(--tesseract-text-body-sm)' }}>Right</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-2)' }}>
        <Label>Gradient</Label>
        <div style={{ display: 'flex', alignItems: 'center', height: 'var(--tesseract-space-10)', gap: 0 }}>
          <span style={{ padding: '0 var(--tesseract-space-3)', fontSize: 'var(--tesseract-text-body-sm)' }}>Left</span>
          <Divider variant="gradient" orientation="vertical" />
          <span style={{ padding: '0 var(--tesseract-space-3)', fontSize: 'var(--tesseract-text-body-sm)' }}>Middle</span>
          <Divider variant="gradient" orientation="vertical" />
          <span style={{ padding: '0 var(--tesseract-space-3)', fontSize: 'var(--tesseract-text-body-sm)' }}>Right</span>
        </div>
      </div>
    </div>
  ),
};

// ─── In context ───────────────────────────────────────────────────────────────
export const InContext = {
  name: '🏥 In Context',
  render: () => (
    <div style={{ width: 360, background: 'var(--tesseract-slate-0)', border: '1px solid var(--tesseract-slate-200)', borderRadius: 'var(--tesseract-radius-12)', overflow: 'hidden' }}>
      {['Vitals', 'Medications', 'Allergies'].map((section, i) => (
        <div key={section}>
          {i > 0 && <Divider variant="gradient" color="var(--tesseract-slate-200, #E2E2EA)" />}
          <div style={{ padding: 'var(--tesseract-space-4) var(--tesseract-space-5)', fontSize: 'var(--tesseract-text-body-sm)', fontWeight: 'var(--tesseract-weight-medium)', color: 'var(--tesseract-slate-900)' }}>
            {section}
          </div>
        </div>
      ))}
    </div>
  ),
};
