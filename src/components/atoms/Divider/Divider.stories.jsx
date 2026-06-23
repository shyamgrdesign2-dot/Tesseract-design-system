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
  <p style={{ margin: 0, fontSize: 'var(--tesseract-text-body-sm)', color: 'var(--tesseract-slate-600, #54545C)' }}>{children}</p>
);

const Label = ({ children }) => (
  <span style={{ fontSize: 'var(--tesseract-text-caption-sm)', fontWeight: 'var(--tesseract-weight-semibold)', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#54545C' }}>
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
          <Divider variant="gradient" color="rgba(255,255,255,0.5)" />
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
    <div style={{ width: 360, background: '#fff', border: '1px solid #E2E2EA', borderRadius: 'var(--tesseract-radius-12)', overflow: 'hidden' }}>
      {['Vitals', 'Medications', 'Allergies'].map((section, i) => (
        <div key={section}>
          {i > 0 && <Divider variant="gradient" color="var(--tesseract-slate-200, #E2E2EA)" />}
          <div style={{ padding: 'var(--tesseract-space-4) var(--tesseract-space-5)', fontSize: 'var(--tesseract-text-body-sm)', fontWeight: 'var(--tesseract-weight-medium)', color: '#171725' }}>
            {section}
          </div>
        </div>
      ))}
    </div>
  ),
};
