import { Progress } from './Progress';

const meta = {
  title: 'Atoms/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A horizontal progress bar — uploads, imports, sync, treatment-plan completion.',
          '',
          '**When to use** — show determinate task progress (0–100), or an indeterminate sweep when the duration is unknown.',
          '**When not** — for a spinner use **LoadingIndicator**; for skeleton placeholders use **Skeleton**.',
          '',
          '**Key props** — `value` (0–`max`; omit for indeterminate), `max`, `size` (sm · md · lg), `tone` (primary · success · warning · error), `label` (accessible name).',
          '',
          '**Good to know** — `role="progressbar"` with `aria-valuenow/min/max`; the indeterminate sweep honors `prefers-reduced-motion`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, table: { category: 'Content' } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], table: { category: 'Appearance' } },
    tone: { control: 'inline-radio', options: ['primary', 'success', 'warning', 'error'], table: { category: 'Appearance' } },
    label: { control: 'text', table: { category: 'Content' } },
  },
  args: { value: 64, size: 'md', tone: 'primary', label: 'Upload progress' },
};
export default meta;

export const Playground = {
  render: (a) => <div style={{ width: 320 }}><Progress {...a} /></div>,
};

/** Tones. */
export const Tones = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Progress value={72} tone="primary" label="Primary" />
      <Progress value={100} tone="success" label="Complete" />
      <Progress value={48} tone="warning" label="Warning" />
      <Progress value={24} tone="error" label="Error" />
    </div>
  ),
};

/** Indeterminate (unknown duration). */
export const Indeterminate = {
  render: () => <div style={{ width: 320 }}><Progress label="Loading…" /></div>,
};

/** Sizes. */
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Progress value={60} size="sm" label="Small" />
      <Progress value={60} size="md" label="Medium" />
      <Progress value={60} size="lg" label="Large" />
    </div>
  ),
};
