import { Divider } from './Divider';

export default {
  title: 'Atoms/Divider',
  component: Divider,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    variant:     { control: 'inline-radio', options: ['solid', 'gradient'] },
    color:       { control: 'text' },
    spacing:     { control: 'number' },
    thickness:   { control: 'number' },
  },
  args: { orientation: 'horizontal', variant: 'solid', spacing: 0, thickness: 1 },
};

const Text = ({ children }) => (
  <p style={{ margin: 0, fontSize: 14, color: 'var(--tp-slate-600, #54545C)' }}>{children}</p>
);

const Label = ({ children }) => (
  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#54545C' }}>
    {children}
  </span>
);

// ─── Playground ───────────────────────────────────────────────────────────────
export const Playground = {
  render: (args) =>
    args.orientation === 'vertical' ? (
      // Vertical needs a row container with a height to stretch into.
      <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>
        <Text>Left</Text>
        <Divider {...args} />
        <Text>Middle</Text>
        <Divider {...args} />
        <Text>Right</Text>
      </div>
    ) : (
      <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text>Above</Text>
        <Divider {...args} />
        <Text>Below</Text>
      </div>
    ),
};

// ─── Solid ────────────────────────────────────────────────────────────────────
export const Solid = {
  name: '— Solid',
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Default</Label>
        <Text>Section A</Text>
        <Divider spacing={4} />
        <Text>Section B</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Brand color</Label>
        <Divider color="var(--tp-blue-500, #4B4AD5)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Error color</Label>
        <Divider color="var(--tp-error-500, #E11D48)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
    <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Default slate — horizontal</Label>
        <Text>Section header</Text>
        <Divider variant="gradient" spacing={4} />
        <Text>Content below</Text>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Brand color — horizontal</Label>
        <Divider variant="gradient" color="var(--tp-blue-500, #4B4AD5)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Error color — horizontal</Label>
        <Divider variant="gradient" color="var(--tp-error-500, #E11D48)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Thick (2px) gradient</Label>
        <Divider variant="gradient" thickness={2} color="var(--tp-blue-400, #7776E0)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>On dark background</Label>
        <div style={{ background: 'linear-gradient(135deg,#1a1966,#0e0d3d)', padding: '20px 24px', borderRadius: 12 }}>
          <Divider variant="gradient" color="rgba(255,255,255,0.5)" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Vertical gradient</Label>
        <div style={{ display: 'flex', alignItems: 'center', height: 48, gap: 16 }}>
          <span style={{ fontSize: 14 }}>Left</span>
          <Divider variant="gradient" orientation="vertical" color="var(--tp-slate-400, #54545C)" />
          <span style={{ fontSize: 14 }}>Middle</span>
          <Divider variant="gradient" orientation="vertical" color="var(--tp-blue-500, #4B4AD5)" />
          <span style={{ fontSize: 14 }}>Right</span>
        </div>
      </div>
    </div>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────
export const Vertical = {
  name: '| Vertical',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Solid</Label>
        <div style={{ display: 'flex', alignItems: 'center', height: 40, gap: 0 }}>
          <span style={{ padding: '0 12px', fontSize: 14 }}>Left</span>
          <Divider orientation="vertical" />
          <span style={{ padding: '0 12px', fontSize: 14 }}>Middle</span>
          <Divider orientation="vertical" />
          <span style={{ padding: '0 12px', fontSize: 14 }}>Right</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Gradient</Label>
        <div style={{ display: 'flex', alignItems: 'center', height: 40, gap: 0 }}>
          <span style={{ padding: '0 12px', fontSize: 14 }}>Left</span>
          <Divider variant="gradient" orientation="vertical" />
          <span style={{ padding: '0 12px', fontSize: 14 }}>Middle</span>
          <Divider variant="gradient" orientation="vertical" />
          <span style={{ padding: '0 12px', fontSize: 14 }}>Right</span>
        </div>
      </div>
    </div>
  ),
};

// ─── In context ───────────────────────────────────────────────────────────────
export const InContext = {
  name: '🏥 In Context',
  render: () => (
    <div style={{ width: 360, background: '#fff', border: '1px solid #E2E2EA', borderRadius: 12, overflow: 'hidden' }}>
      {['Vitals', 'Medications', 'Allergies'].map((section, i) => (
        <div key={section}>
          {i > 0 && <Divider variant="gradient" color="var(--tp-slate-200, #E2E2EA)" />}
          <div style={{ padding: '16px 20px', fontSize: 14, fontWeight: 500, color: '#171725' }}>
            {section}
          </div>
        </div>
      ))}
    </div>
  ),
};
