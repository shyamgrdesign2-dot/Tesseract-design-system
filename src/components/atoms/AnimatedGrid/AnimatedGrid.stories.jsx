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
    edgeFade: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Edge-fade strength — drag up to dissolve the edges more (0 = none, 1 = strong)',
    },
    speed: {
      control: 'inline-radio',
      options: ['slow', 'normal', 'fast'],
      description: 'Comet speed multiplier (also accepts a raw number in code)',
      table: { category: 'Motion' },
    },
    density: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Fraction of lanes that emit comets (1 = all, lower = sparser/calmer)',
      table: { category: 'Motion' },
    },
    animated: {
      control: 'boolean',
      description: 'Animate comets. When off — or when the OS prefers-reduced-motion — only the static lattice draws',
      table: { category: 'Motion' },
    },
    surface: {
      control: 'inline-radio',
      options: ['dark', 'light'],
      description: 'Preview backdrop (demo only — not a component prop)',
    },
  },
  args: {
    lineColor: 'rgba(255,255,255,0.14)',
    cometColor: '#ffffff',
    edgeFade: 0.6,
    speed: 'normal',
    density: 1,
    animated: true,
    surface: 'dark',
  },
};

export default meta;

// Emit only the props that diverge from the component defaults.
const gridCode = ({ lineColor, cometColor, edgeFade, speed, density, animated }) => {
  const lines = [];
  if (lineColor) lines.push(`  lineColor="${lineColor}"`);
  if (cometColor) lines.push(`  cometColor="${cometColor}"`);
  if (edgeFade != null && edgeFade !== true) lines.push(`  edgeFade={${edgeFade}}`);
  if (speed && speed !== 'normal') lines.push(`  speed="${speed}"`);
  if (density != null && density !== 1) lines.push(`  density={${density}}`);
  if (animated === false) lines.push('  animated={false}');
  return lines.length ? `<AnimatedGrid\n${lines.join('\n')}\n/>` : '<AnimatedGrid />';
};

// A square stage so the entire (square) grid is visible.
const Square = ({ bg, children }) => (
  <div style={{ position: 'relative', width: 360, height: 360, overflow: 'hidden', borderRadius: 'var(--tesseract-radius-16)', background: bg }}>
    {children}
  </div>
);

const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

export const Playground = {
  render: ({ surface, ...grid }) => (
    <Square bg={surface === 'light' ? '#F7F7FB' : '#171725'}>
      <AnimatedGrid {...grid} style={fill} />
    </Square>
  ),
  parameters: { docs: { source: { transform: (_code, ctx) => gridCode(ctx.args) } } },
};

/** Sparser + calmer: fewer lanes emit comets (density 0.3) at a slow speed. */
export const CalmAndSparse = {
  render: () => (
    <Square bg="#171725">
      <AnimatedGrid speed="slow" density={0.3} style={fill} />
    </Square>
  ),
};

/** Static lattice — `animated={false}` (also what prefers-reduced-motion renders). */
export const Static = {
  render: () => (
    <Square bg="#171725">
      <AnimatedGrid animated={false} style={fill} />
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
    <div style={{ display: 'flex', gap: 'var(--tesseract-space-5)', flexWrap: 'wrap' }}>
      <Square bg="#171725"><AnimatedGrid style={fill} /></Square>
      <Square bg="#F7F7FB"><AnimatedGrid lineColor="rgba(75,74,213,0.16)" cometColor="#4b4ad5" style={fill} /></Square>
    </div>
  ),
};
