import { NoiseOverlay } from './NoiseOverlay';

const meta = {
  title: 'Atoms/NoiseOverlay',
  component: NoiseOverlay,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    baseFrequency: { control: { type: 'range', min: 0.1, max: 1.5, step: 0.05 }, name: 'grain frequency' },
    blendMode: { control: 'select', options: ['overlay', 'soft-light', 'multiply', 'screen', 'normal', 'color-dodge'] },
  },
  args: {
    opacity: 0.06,
    baseFrequency: 0.65,
    blendMode: 'overlay',
  },
};

export default meta;

const Stage = ({ children, background }) => (
  <div
    style={{
      position: 'relative',
      width: 320,
      height: 180,
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      background,
    }}
  >
    {children}
  </div>
);

const AI_GRADIENT = 'linear-gradient(135deg, #1A1994 0%, #673AAC 50%, #D565EA 100%)';

export const Playground = {
  render: (args) => (
    <Stage background={AI_GRADIENT}>
      <NoiseOverlay {...args} />
      <span style={{ position: 'relative' }}>Grain texture</span>
    </Stage>
  ),
};

export const OverGradient = {
  render: (args) => (
    <Stage background={AI_GRADIENT}>
      <NoiseOverlay {...args} />
      <span style={{ position: 'relative' }}>AI gradient</span>
    </Stage>
  ),
};

export const OpacityScale = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {[0.04, 0.1, 0.25, 0.5].map((opacity) => (
        <Stage key={opacity} background={AI_GRADIENT}>
          <NoiseOverlay opacity={opacity} />
          <span style={{ position: 'relative' }}>{opacity}</span>
        </Stage>
      ))}
    </div>
  ),
};

export const OnSolidColor = {
  render: (args) => (
    <Stage background="var(--tp-blue-500, #4B4AD5)">
      <NoiseOverlay {...args} opacity={0.2} />
      <span style={{ position: 'relative' }}>Solid surface</span>
    </Stage>
  ),
};
