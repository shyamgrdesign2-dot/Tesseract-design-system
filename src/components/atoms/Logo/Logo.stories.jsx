import { Logo } from './Logo';

const meta = {
  title: 'Atoms/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'The Tatva brand marks. Two SEPARATE marks (never combined): the wordmark and the monochrome symbol. Two brand wordmarks share the symbol — **TatvaPractice** (`brand="practice"`) and **TatvaCare** (`brand="care"`). The shared SVGs are painted via CSS mask, so one asset recolours per surface: gradient / dark (for light backgrounds) / light (white, for dark backgrounds) / violet / blue. Set `height`; width derives from the artwork.' } },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['wordmark', 'symbol'] },
    brand: { control: 'inline-radio', options: ['practice', 'care'] },
    tone: { control: 'inline-radio', options: ['gradient', 'dark', 'light', 'violet', 'blue'] },
    height: { control: { type: 'range', min: 16, max: 80, step: 2 } },
  },
  args: { variant: 'wordmark', brand: 'practice', tone: 'gradient', height: 32 },
};

export default meta;

export const Playground = {
  render: (args) => (
    <div style={{ padding: "var(--tesseract-space-6)", background: args.tone === 'light' ? '#171725' : '#fff', borderRadius: "var(--tesseract-radius-12)", display: 'inline-block' }}>
      <Logo {...args} />
    </div>
  ),
};

const Tile = ({ dark, children, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: "var(--tesseract-space-2)", alignItems: 'flex-start' }}>
    <span style={{ fontSize: "var(--tesseract-text-caption-sm)", color: '#717179', fontFamily: 'var(--tesseract-font-body)' }}>{label}</span>
    <div style={{ padding: "var(--tesseract-space-5)", borderRadius: "var(--tesseract-radius-12)", background: dark ? '#171725' : '#fff', border: '1px solid #e2e2ea' }}>{children}</div>
  </div>
);

/** Tones — gradient/dark/violet/blue on light, white on dark (wordmark). */
export const Tones = {
  render: () => (
    <div style={{ display: 'flex', gap: "var(--tesseract-space-4)", flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Tile label="gradient"><Logo tone="gradient" height={28} /></Tile>
      <Tile label="dark"><Logo tone="dark" height={28} /></Tile>
      <Tile label="violet"><Logo tone="violet" height={28} /></Tile>
      <Tile label="blue"><Logo tone="blue" height={28} /></Tile>
      <Tile label="light (on dark)" dark><Logo tone="light" height={28} /></Tile>
    </div>
  ),
};

/** The two separate marks — wordmark and monochrome symbol (shared). */
export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: "var(--tesseract-space-4)", flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Tile label="wordmark"><Logo variant="wordmark" height={28} /></Tile>
      <Tile label="symbol"><Logo variant="symbol" height={40} /></Tile>
      <Tile label="symbol · light (on dark)" dark><Logo variant="symbol" tone="light" height={40} /></Tile>
    </div>
  ),
};

/** The two brand wordmarks — TatvaPractice and TatvaCare (the symbol is shared). */
export const Brands = {
  render: () => (
    <div style={{ display: 'flex', gap: "var(--tesseract-space-4)", flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Tile label="TatvaPractice"><Logo brand="practice" height={30} /></Tile>
      <Tile label="TatvaCare"><Logo brand="care" height={30} /></Tile>
      <Tile label="TatvaPractice · light (on dark)" dark><Logo brand="practice" tone="light" height={30} /></Tile>
      <Tile label="TatvaCare · light (on dark)" dark><Logo brand="care" tone="light" height={30} /></Tile>
    </div>
  ),
};
