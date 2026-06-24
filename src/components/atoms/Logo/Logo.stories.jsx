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
    tone: { control: 'inline-radio', options: ['gradient', 'dark', 'light', 'violet', 'blue'], description: 'Preset paint. Ignored when `color` is set.', table: { category: 'Appearance' } },
    color: { control: 'text', description: 'Arbitrary brand colour / gradient — overrides `tone`. Blank = use `tone`.', table: { category: 'Appearance' } },
    height: { control: { type: 'range', min: 16, max: 80, step: 2 }, description: 'Height in px; width derives from the aspect ratio. Ignored when `width` is set.', table: { category: 'Sizing' } },
    width: { control: 'number', description: 'Width in px; height then derives from the aspect ratio. Wins over `height`.', table: { category: 'Sizing' } },
    maxWidth: { control: 'number', description: 'Optional cap on rendered width (px).', table: { category: 'Sizing' } },
    basePath: { control: 'text', description: 'Prefix for the brand SVG asset paths (CDN / alt root).', table: { category: 'Assets' } },
  },
  args: { variant: 'wordmark', brand: 'practice', tone: 'gradient', color: '', height: 32, width: undefined, maxWidth: undefined, basePath: '/brand' },
};

export default meta;

// Build a copy-paste snippet from the controls — only emit non-default props.
const logoCode = ({ variant = 'wordmark', brand = 'practice', tone = 'gradient', color, height = 32, width, maxWidth, basePath = '/brand' }) => {
  const lines = [];
  if (variant !== 'wordmark') lines.push(`  variant="${variant}"`);
  if (brand !== 'practice') lines.push(`  brand="${brand}"`);
  if (color) lines.push(`  color="${color}"`);
  else if (tone !== 'gradient') lines.push(`  tone="${tone}"`);
  if (width != null && width !== '') lines.push(`  width={${width}}`);
  else if (height !== 32) lines.push(`  height={${height}}`);
  if (maxWidth != null && maxWidth !== '') lines.push(`  maxWidth={${maxWidth}}`);
  if (basePath && basePath !== '/brand') lines.push(`  basePath="${basePath}"`);
  return lines.length ? `<Logo\n${lines.join('\n')}\n/>` : '<Logo />';
};

export const Playground = {
  render: (args) => (
    <div style={{ padding: "var(--tesseract-space-6)", background: args.tone === 'light' ? '#171725' : '#fff', borderRadius: "var(--tesseract-radius-12)", display: 'inline-block' }}>
      <Logo {...args} />
    </div>
  ),
  parameters: { docs: { source: { transform: (_code, ctx) => logoCode(ctx.args) } } },
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
