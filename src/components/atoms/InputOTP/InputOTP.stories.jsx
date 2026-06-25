import { useState } from 'react';
import { InputOTP } from './InputOTP';

const meta = {
  title: 'Atoms/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'One-time-code / PIN input — `length` separate single-char boxes with auto-advance, backspace-to-previous, arrow-key nav, and paste-to-fill across all boxes.',
          '',
          '**When to use** — 2FA / OTP verification and e-prescription sign-off, where a code is entered digit-by-digit.',
          '',
          '**Key props** — `length`, `value`/`defaultValue` + `onChange`, `onComplete`, `allow` (numeric · alphanumeric · any), `size`, `status`, `mask`, `groupSize` + `separator`, `radius`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    length: { control: { type: 'number', min: 2, max: 10 } },
    allow: { control: 'inline-radio', options: ['numeric', 'alphanumeric', 'any'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    status: { control: 'inline-radio', options: ['default', 'error', 'success'] },
    mask: { control: 'boolean' },
    disabled: { control: 'boolean' },
    autoFocus: { control: 'boolean', description: 'Focus the first box on mount' },
    groupSize: { control: { type: 'number', min: 0 }, description: 'Insert a separator every N boxes (e.g. 3 → "123 456")' },
    separator: { control: 'text', description: 'Node rendered between groups when groupSize is set' },
    radius: { control: 'select', options: ['sharp', 4, 8, 12, 'pill'], description: 'Per-box corner radius' },
    defaultValue: { control: 'text', description: 'Initial value (uncontrolled)' },
    ariaLabel: { control: 'text', description: 'Group label for assistive tech' },
    onChange: { control: false, table: { category: 'Events' }, description: '(code) => void — fires on every change' },
    onComplete: { control: false, table: { category: 'Events' }, description: '(code) => void — fires when all boxes are filled' },
  },
  args: {
    length: 6,
    allow: 'numeric',
    size: 'md',
    status: 'default',
    mask: false,
    disabled: false,
    autoFocus: false,
    separator: '-',
    ariaLabel: 'Verification code',
  },
};
export default meta;

export const Playground = { render: (a) => <InputOTP {...a} /> };

/** Interaction test — typing fills boxes and auto-advances. */
export const TypeInteraction = {
  args: { length: 4 },
  play: async ({ canvasElement }) => {
    const { within, userEvent, expect } = await import('storybook/test');
    const c = within(canvasElement);
    const boxes = c.getAllByRole('textbox');
    await userEvent.type(boxes[0], '4');
    await expect(boxes[0]).toHaveValue('4');
    await userEvent.type(boxes[1], '8');
    await expect(boxes[1]).toHaveValue('8');
  },
};

/** Controlled — reads back the live code and fires onComplete. */
export const Controlled = {
  render: () => {
    const [code, setCode] = useState('');
    const [done, setDone] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <InputOTP value={code} onChange={(c) => { setCode(c); setDone(false); }} onComplete={() => setDone(true)} />
        <p style={{ font: '13px var(--tesseract-font-body)', color: 'var(--tesseract-slate-600)', margin: 0 }}>
          {done ? `✓ Complete: ${code}` : `Entered: ${code || '—'}`}
        </p>
      </div>
    );
  },
};

/** Grouped with a separator (e.g. 3 + 3). */
export const Grouped = { render: () => <InputOTP length={6} groupSize={3} separator="–" /> };

/** Masked, for sensitive sign-off PINs. */
export const Masked = { render: () => <InputOTP length={4} mask allow="numeric" /> };

/** Sizes. */
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <InputOTP size="sm" length={4} />
      <InputOTP size="md" length={4} />
      <InputOTP size="lg" length={4} />
    </div>
  ),
};

/** Status. */
export const Status = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <InputOTP length={4} status="error" defaultValue="12" />
      <InputOTP length={4} status="success" defaultValue="1234" />
    </div>
  ),
};

/** Alphanumeric (e.g. backup codes). */
export const Alphanumeric = { render: () => <InputOTP length={6} allow="alphanumeric" /> };
