import { Logo } from './Logo';

const meta = {
  title: 'Atoms/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'The TatvaPractice brand mark. Two SEPARATE marks (never combined): the wordmark (the actual logo) and the monochrome symbol. The shared SVGs are painted via CSS mask, so one asset recolours per surface: gradient / dark (for light backgrounds) / light (white, for dark backgrounds) / violet / blue. Set `height`; width derives from the artwork.' } },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['wordmark', 'symbol'] },
    tone: { control: 'inline-radio', options: ['gradient', 'dark', 'light', 'violet', 'blue'] },
    height: { control: { type: 'range', min: 16, max: 80, step: 2 } },
  },
  args: { variant: 'wordmark', tone: 'gradient', height: 32 },
};

export default meta;

export const Playground = {
  render: (args) => (
    <div style={{ padding: 24, background: args.tone === 'light' ? '#171725' : '#fff', borderRadius: 12, display: 'inline-block' }}>
      <Logo {...args} />
    </div>
  ),
};

const Tile = ({ dark, children, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 11, color: '#717179', fontFamily: 'Inter, sans-serif' }}>{label}</span>
    <div style={{ padding: 20, borderRadius: 12, background: dark ? '#171725' : '#fff', border: '1px solid #e2e2ea' }}>{children}</div>
  </div>
);

/** Tones — gradient/dark/violet/blue on light, white on dark (wordmark). */
export const Tones = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Tile label="gradient"><Logo tone="gradient" height={28} /></Tile>
      <Tile label="dark"><Logo tone="dark" height={28} /></Tile>
      <Tile label="violet"><Logo tone="violet" height={28} /></Tile>
      <Tile label="blue"><Logo tone="blue" height={28} /></Tile>
      <Tile label="light (on dark)" dark><Logo tone="light" height={28} /></Tile>
    </div>
  ),
};

/** The two separate marks — wordmark (actual logo) and monochrome symbol. */
export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Tile label="wordmark"><Logo variant="wordmark" height={28} /></Tile>
      <Tile label="symbol"><Logo variant="symbol" height={40} /></Tile>
      <Tile label="symbol · light (on dark)" dark><Logo variant="symbol" tone="light" height={40} /></Tile>
    </div>
  ),
};
