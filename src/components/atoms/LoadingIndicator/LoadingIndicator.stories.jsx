import { LoadingIndicator } from './LoadingIndicator';

const meta = {
  title: 'Atoms/LoadingIndicator',
  component: LoadingIndicator,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ color: 'var(--tesseract-slate-700, #454551)', background: '#fff', padding: 24, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          'An indeterminate spinner for waits with no measurable progress, in three glyph styles.',
          '',
          '**When to use** — a short or open-ended wait where you cannot show how much is left: a button in flight, a lazy-loading table, an inline "fetching…" next to a label.',
          '**When not** — when the loading content has a known shape, use `Skeleton` so the layout does not jump; for determinate progress use a progress bar, not a spinner.',
          '',
          '**Key props** — `type` is `line-simple` / `line-spinner` / `dot-circle`; `size` xs–lg; `label` + `labelPosition` (end / bottom) for the caption; `speed` slow/normal/fast; `color` inherits via `currentColor` (default `inherit`).',
          '',
          '**Good to know** — the glyph paints with `currentColor`, so setting the parent\'s text colour recolours it without a `color` prop. Give a meaningful `label` for screen readers; motion respects `prefers-reduced-motion`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['line-simple', 'line-spinner', 'dot-circle'], description: 'Spinner glyph style' },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'], description: 'Glyph size' },
    label: { control: 'text', description: 'Caption text (also the a11y label)' },
    speed: { control: 'inline-radio', options: ['slow', 'normal', 'fast'], description: 'Spin speed — scales each glyph’s base duration. "normal" keeps the built-in per-type timings. (A number of seconds also works in code.)', table: { category: 'Motion' } },
    color: { control: 'text', description: 'Token or CSS color applied to the root; the currentColor glyphs adopt it. "inherit" = follow context.', table: { category: 'Appearance' } },
    labelPosition: { control: 'inline-radio', options: ['end', 'bottom'], description: 'Where the label sits relative to the glyph.', table: { category: 'Layout' } },
  },
  args: { type: 'line-simple', size: 'md', label: 'Loading...', speed: 'normal', color: 'inherit', labelPosition: 'end' },
};

export default meta;

// Build a copy-paste snippet from the controls — only emit non-default props.
const loaderCode = ({ type = 'line-simple', size = 'md', label, speed = 'normal', color = 'inherit', labelPosition = 'end' }) => {
  const lines = [`  type="${type}"`, `  size="${size}"`];
  if (label) lines.push(`  label="${label}"`);
  if (speed && speed !== 'normal') lines.push(typeof speed === 'number' ? `  speed={${speed}}` : `  speed="${speed}"`);
  if (color && color !== 'inherit') lines.push(`  color="${color}"`);
  if (labelPosition && labelPosition !== 'end') lines.push(`  labelPosition="${labelPosition}"`);
  return `<LoadingIndicator\n${lines.join('\n')}\n/>`;
};

export const Playground = {
  parameters: { docs: { source: { transform: (_code, ctx) => loaderCode(ctx.args) } } },
};

/** The three glyphs side by side (the requested default demo). */
export const Default = {
  render: () => (
    <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <LoadingIndicator type="line-simple" size="md" label="Loading..." />
      <LoadingIndicator type="line-spinner" size="md" label="Loading..." />
      <LoadingIndicator type="dot-circle" size="md" label="Loading..." />
    </div>
  ),
};

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      {['xs', 'sm', 'md', 'lg'].map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <LoadingIndicator type="line-spinner" size={size} />
          <span style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #71717a)' }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

/** Glyph follows `currentColor`. */
export const Colors = {
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <span style={{ color: 'var(--tesseract-blue-500, #4b4ad5)' }}><LoadingIndicator type="line-simple" /></span>
      <span style={{ color: 'var(--tesseract-error-500, #e11d48)' }}><LoadingIndicator type="line-spinner" /></span>
      <span style={{ color: 'var(--tesseract-slate-700, #454551)' }}><LoadingIndicator type="dot-circle" /></span>
    </div>
  ),
};
