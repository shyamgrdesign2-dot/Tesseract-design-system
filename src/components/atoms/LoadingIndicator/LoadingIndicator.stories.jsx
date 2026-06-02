import { LoadingIndicator } from './LoadingIndicator';

const meta = {
  title: 'Atoms/LoadingIndicator',
  component: LoadingIndicator,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ color: 'var(--tp-slate-700, #454551)', background: '#fff', padding: 24, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: { control: 'inline-radio', options: ['line-simple', 'line-spinner', 'dot-circle'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  args: { type: 'line-simple', size: 'md', label: 'Loading...' },
};

export default meta;

export const Playground = {};

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
          <span style={{ fontSize: 12, color: 'var(--tp-slate-500, #71717a)' }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

/** Glyph follows `currentColor`. */
export const Colors = {
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <span style={{ color: 'var(--tp-blue-500, #4b4ad5)' }}><LoadingIndicator type="line-simple" /></span>
      <span style={{ color: 'var(--tp-error-500, #e11d48)' }}><LoadingIndicator type="line-spinner" /></span>
      <span style={{ color: 'var(--tp-slate-700, #454551)' }}><LoadingIndicator type="dot-circle" /></span>
    </div>
  ),
};
