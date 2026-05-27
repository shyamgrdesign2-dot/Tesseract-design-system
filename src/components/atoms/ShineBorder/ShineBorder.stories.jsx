import { ShineBorder } from './ShineBorder';

const meta = {
  title: 'Atoms/ShineBorder',
  component: ShineBorder,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    borderWidth: { control: { type: 'range', min: 1, max: 6, step: 0.5 } },
    duration: { control: { type: 'range', min: 1, max: 30, step: 1 } },
    variant: { control: 'inline-radio', options: ['perimeter', 'rotate'] },
    shineColor: { control: 'text' },
    baseColor: { control: 'text' },
  },
  args: {
    borderWidth: 1.5,
    duration: 14,
    variant: 'perimeter',
    shineColor: '#4B4AD5',
    baseColor: '#FFFFFF',
  },
};

export default meta;

const AI_COLORS = ['#D565EA', '#673AAC', '#1A1994'];

const Card = ({ children, ...props }) => (
  <div
    style={{
      position: 'relative',
      width: 220,
      height: 120,
      borderRadius: 16,
      background: 'var(--tp-slate-0, #fff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--tp-slate-700, #3f3f46)',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}
  >
    <ShineBorder {...props} />
    {children}
  </div>
);

export const Playground = {
  render: (args) => <Card {...args}>Shine border</Card>,
};

export const Perimeter = {
  render: () => (
    <Card variant="perimeter" shineColor={AI_COLORS} borderWidth={1.5}>
      Perimeter
    </Card>
  ),
};

export const Rotate = {
  render: () => (
    <Card variant="rotate" shineColor={AI_COLORS} borderWidth={2}>
      Rotate
    </Card>
  ),
};

export const AiGradient = {
  render: () => (
    <Card variant="perimeter" shineColor={AI_COLORS} borderWidth={2} duration={10}>
      AI gradient
    </Card>
  ),
};

export const BorderWidths = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {[1, 2, 4].map((bw) => (
        <Card key={bw} shineColor={AI_COLORS} borderWidth={bw}>
          {bw}px
        </Card>
      ))}
    </div>
  ),
};
