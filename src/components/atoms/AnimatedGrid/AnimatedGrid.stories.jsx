import { AnimatedGrid } from './AnimatedGrid';

const meta = {
  title: 'Atoms/AnimatedGrid',
  component: AnimatedGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Standalone decorative atom: a geometric lattice with travelling "comet" pulses. It is its own component (the HeroBanner just reuses it) — drop it behind any surface. Themeable via `lineColor` + `cometColor`, so it works on both dark and light backgrounds. The viewBox is square, so in a square area the full grid is visible.' } },
  },
  argTypes: {
    lineColor: { control: 'color', description: 'Lattice stroke color' },
    cometColor: { control: 'color', description: 'Travelling pulse color' },
  },
  args: {
    lineColor: 'rgba(255,255,255,0.14)',
    cometColor: '#ffffff',
  },
};

export default meta;

// A square stage so the entire (square) grid is visible.
const Square = ({ bg, children }) => (
  <div style={{ position: 'relative', width: 360, height: 360, overflow: 'hidden', borderRadius: 16, background: bg }}>
    {children}
  </div>
);

const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

export const Playground = {
  render: (args) => (
    <Square bg={args.cometColor === '#ffffff' || args.lineColor.includes('255') ? '#171725' : '#fff'}>
      <AnimatedGrid {...args} style={fill} />
    </Square>
  ),
};

/** The full grid on a dark surface (default white lines/comets). */
export const OnDark = {
  render: () => (
    <Square bg="radial-gradient(120% 120% at 50% 0%, #46286C 0%, #25113E 60%, #6C4F90 100%)">
      <AnimatedGrid style={fill} />
    </Square>
  ),
};

/** The full grid re-themed for a light surface. */
export const OnLight = {
  render: () => (
    <Square bg="#F7F7FB">
      <AnimatedGrid lineColor="rgba(75,74,213,0.16)" cometColor="#4b4ad5" style={fill} />
    </Square>
  ),
};

/** Dark and light side by side. */
export const Backgrounds = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <Square bg="#171725"><AnimatedGrid style={fill} /></Square>
      <Square bg="#F7F7FB"><AnimatedGrid lineColor="rgba(75,74,213,0.16)" cometColor="#4b4ad5" style={fill} /></Square>
    </div>
  ),
};
