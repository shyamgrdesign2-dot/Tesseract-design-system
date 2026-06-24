import React from 'react';
import { Slider } from './Slider';

const meta = {
  title: 'Atoms/Slider',
  component: Slider,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    color: { control: 'inline-radio', options: ['primary', 'success', 'warning', 'error'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    label: { control: 'text' },
    showValue: { control: 'boolean' },
    marks: { control: 'boolean', description: 'true = show min & max ticks; or pass an array of {value,label}' },
  },
  args: {
    color: 'primary',
    size: 'md',
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    error: false,
    label: '',
    showValue: false,
    marks: false,
  },
};

export default meta;

// Build a copy-paste snippet from the controls (what "Show code" shows).
const sliderCode = ({ color = 'primary', size = 'md', min = 0, max = 100, step = 1, disabled, error, label, showValue, marks }) => {
  const lines = [`  color="${color}"`, `  size="${size}"`];
  if (min !== 0) lines.push(`  min={${min}}`);
  if (max !== 100) lines.push(`  max={${max}}`);
  if (step !== 1) lines.push(`  step={${step}}`);
  if (label) lines.push(`  label="${label}"`);
  if (showValue) lines.push(`  showValue`);
  if (marks) lines.push(`  marks`);
  if (disabled) lines.push(`  disabled`);
  if (error) lines.push(`  error`);
  lines.push('  defaultValue={40}');
  return `<Slider\n${lines.join('\n')}\n/>`;
};

const Stack = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-5)', width: 320 }}>
    {children}
  </div>
);

export const Playground = {
  render: (args) => {
    const [value, setValue] = React.useState(40);
    return (
      <div style={{ width: 320 }}>
        <Slider {...args} value={value} onChange={(_e, v) => setValue(v)} />
      </div>
    );
  },
  parameters: { docs: { source: { transform: (_code, ctx) => sliderCode(ctx.args) } } },
};

export const Sizes = {
  render: () => (
    <Stack>
      {['sm', 'md', 'lg'].map((size) => (
        <Slider key={size} size={size} defaultValue={50} label={size} showValue />
      ))}
    </Stack>
  ),
};

export const Colors = {
  render: (args) => (
    <Stack>
      <Slider {...args} color="primary" defaultValue={60} />
      <Slider {...args} color="success" defaultValue={60} />
      <Slider {...args} color="warning" defaultValue={60} />
      <Slider {...args} color="error" defaultValue={60} />
    </Stack>
  ),
};

/** Built-in label + live value readout. */
export const WithLabelAndValue = {
  render: (args) => {
    const [value, setValue] = React.useState(72);
    return (
      <div style={{ width: 340 }}>
        <Slider {...args} label="Volume" showValue formatValue={(v) => `${v}%`} value={value} onChange={(_e, v) => setValue(v)} />
      </div>
    );
  },
};

/** Tick marks under the track — boolean shows min & max, or pass an array. */
export const WithMarks = {
  render: (args) => (
    <Stack>
      <Slider {...args} defaultValue={50} marks />
      <Slider
        {...args}
        defaultValue={3}
        min={0}
        max={4}
        step={1}
        marks={[
          { value: 0, label: 'Low' },
          { value: 2, label: 'Mid' },
          { value: 4, label: 'High' },
        ]}
      />
    </Stack>
  ),
};

export const Disabled = {
  args: { disabled: true, defaultValue: 50 },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Slider {...args} />
    </div>
  ),
};

export const Steps = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Slider {...args} min={0} max={10} step={2} defaultValue={4} marks showValue label="Steps of 2" />
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Pain scale used in clinical intake forms (0 = no pain, 10 = worst).
 *  Uses the built-in `label`, `showValue` and `marks` props. */
export const PainScale = {
  name: '🩺 Pain Scale (0–10)',
  render: (args) => {
    const [pain, setPain] = React.useState(3);
    const color = pain <= 3 ? 'success' : pain <= 6 ? 'warning' : 'error';
    const descriptor = pain === 0 ? 'No pain' : pain <= 3 ? 'Mild' : pain <= 6 ? 'Moderate' : pain <= 8 ? 'Severe' : 'Worst possible';
    return (
      <div style={{ width: 340 }}>
        <Slider
          {...args}
          color={color}
          min={0}
          max={10}
          step={1}
          value={pain}
          onChange={(_e, v) => setPain(v)}
          label="Pain intensity"
          showValue
          formatValue={(v) => `${v} · ${descriptor}`}
          marks={[
            { value: 0, label: 'No pain' },
            { value: 10, label: 'Worst' },
          ]}
        />
      </div>
    );
  },
};

/** Dosage slider for medication adjustment — capped at a clinical max. */
export const DosageAdjust = {
  name: '💊 Dosage Adjustment',
  render: (args) => {
    const [dose, setDose] = React.useState(5);
    const safeMax = 10;
    const isOverSafe = dose > safeMax;
    return (
      <div style={{ width: 340 }}>
        <Slider
          {...args}
          color={isOverSafe ? 'error' : 'primary'}
          error={isOverSafe}
          min={2.5}
          max={15}
          step={2.5}
          value={dose}
          onChange={(_e, v) => setDose(v)}
          label="Amlodipine — daily dose"
          showValue
          formatValue={(v) => `${v} mg`}
          marks={[
            { value: 2.5, label: '2.5' },
            { value: 10, label: 'max 10' },
            { value: 15, label: '15' },
          ]}
        />
        {isOverSafe && (
          <div style={{ marginTop: 'var(--tesseract-space-2)', fontSize: 'var(--tesseract-text-body-xs)', color: 'var(--tesseract-error-500)', fontWeight: 'var(--tesseract-weight-medium)' }}>
            ⚠ Exceeds recommended max (10 mg)
          </div>
        )}
      </div>
    );
  },
};

/** BMI range selector for filtering patient cohorts. */
export const BMIFilter = {
  name: '⚖️ BMI Range Filter',
  render: (args) => {
    const [bmi, setBmi] = React.useState(28);
    const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    const color = bmi < 18.5 ? 'warning' : bmi < 25 ? 'success' : bmi < 30 ? 'warning' : 'error';
    return (
      <div style={{ width: 340 }}>
        <Slider
          {...args}
          color={color}
          min={10}
          max={50}
          step={0.5}
          value={bmi}
          onChange={(_e, v) => setBmi(v)}
          label="BMI threshold — filter patients above"
          showValue
          formatValue={(v) => `${v.toFixed(1)} · ${category}`}
          marks
        />
      </div>
    );
  },
};
