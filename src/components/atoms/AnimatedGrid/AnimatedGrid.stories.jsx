import { AnimatedGrid } from './AnimatedGrid';

const meta = {
  title: 'Atoms/AnimatedGrid',
  component: AnimatedGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Decorative SVG lattice with travelling "comet" pulses. Render absolutely-positioned behind content (used by HeroBanner). Themeable via `lineColor` + `cometColor`; ids are scoped per instance so multiple grids can be themed independently on one page.' } },
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

// Helper: place the grid on a tinted panel so the pulses are visible.
const Panel = ({ bg, children }) => (
  <div style={{ position: 'relative', height: 220, width: '100%', overflow: 'hidden', background: bg, borderRadius: 12 }}>
    {children}
  </div>
);

export const Playground = {
  render: (args) => (
    <Panel bg="radial-gradient(99% 60% at 50% 55%, #46286C 0%, #25113E 60%, #6C4F90 100%)">
      <AnimatedGrid {...args} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </Panel>
  ),
};

/** Default (dark surface) vs a re-themed grid on a light surface. */
export const Theming = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Panel bg="#171725">
        <AnimatedGrid style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </Panel>
      <Panel bg="#F1F1F5">
        <AnimatedGrid
          lineColor="rgba(75,74,213,0.18)"
          cometColor="#4b4ad5"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </Panel>
    </div>
  ),
};
