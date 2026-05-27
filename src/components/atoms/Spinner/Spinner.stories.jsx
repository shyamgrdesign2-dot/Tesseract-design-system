import { Spinner } from './Spinner';

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    pixels: { control: 'number' },
    color: { control: 'text' },
    label: { control: 'text' },
  },
  args: {
    size: 'md',
    label: 'Loading',
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {};

export const Sizes = {
  render: (args) => (
    <Row>
      {['sm', 'md', 'lg'].map((size) => (
        <Spinner key={size} {...args} size={size} />
      ))}
    </Row>
  ),
};

export const Colors = {
  render: (args) => (
    <Row>
      <Spinner {...args} color="var(--tp-blue-500, #4B4AD5)" />
      <Spinner {...args} color="var(--tp-success-500, #10b981)" />
      <Spinner {...args} color="var(--tp-warning-500, #f59e0b)" />
      <Spinner {...args} color="var(--tp-error-500, #e11d48)" />
    </Row>
  ),
};

export const CustomPixels = {
  render: (args) => (
    <Row>
      <Spinner {...args} pixels={12} />
      <Spinner {...args} pixels={32} />
      <Spinner {...args} pixels={48} />
    </Row>
  ),
};

export const OnDarkSurface = {
  parameters: { backgrounds: { default: 'dark' } },
  render: (args) => (
    <div style={{ background: 'var(--tp-blue-900, #161558)', padding: 24, borderRadius: 12 }}>
      <Spinner {...args} color="#ffffff" />
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Loading states for common async actions in a clinical app. */
export const ClinicalLoadingStates = {
  name: '🏥 Clinical Loading States',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Inter, sans-serif' }}>
      {[
        { label: 'Fetching patient records…', color: '#4B4AD5' },
        { label: 'Uploading lab report…', color: '#10b981' },
        { label: 'Syncing with ABDM…', color: '#f59e0b' },
        { label: 'Submitting pre-authorisation…', color: '#54545C' },
      ].map(({ label, color }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Spinner {...args} size="sm" color={color} />
          <span style={{ fontSize: 13, color: '#454551' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
};

/** Full-page loading overlay pattern — spinner centered in a 240px container. */
export const PageLoadingOverlay = {
  name: '🔄 Page Loading Overlay',
  render: (args) => (
    <div style={{ width: 400, height: 240, background: '#FAFAFB', border: '1px solid #E2E2EA', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: 'Inter, sans-serif' }}>
      <Spinner {...args} size="lg" color="#4B4AD5" />
      <div style={{ fontSize: 13, color: '#54545C' }}>Loading patient record…</div>
    </div>
  ),
};

/** Button-inline loading — spinner replaces label during async action. */
export const ButtonInlineLoading = {
  name: '⚡ Button Inline Loading',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {[
        { label: 'Saving…', color: '#fff', bg: '#4B4AD5' },
        { label: 'Uploading…', color: '#fff', bg: '#16A34A' },
        { label: 'Sending…', color: '#fff', bg: '#54545C' },
      ].map(({ label, color, bg }) => (
        <button
          key={label}
          disabled
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, border: 'none', background: bg, color, fontWeight: 600, fontSize: 14, cursor: 'not-allowed', fontFamily: 'Inter, sans-serif', opacity: 0.85 }}
        >
          <Spinner {...args} pixels={14} color={color} label={label} />
          {label}
        </button>
      ))}
    </div>
  ),
};
