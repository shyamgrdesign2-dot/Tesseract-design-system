import React from 'react';
import { Slider } from './Slider';

const meta = {
  title: 'Atoms/Slider',
  component: Slider,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    color: { control: 'inline-radio', options: ['primary', 'success', 'error'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    color: 'primary',
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
};

export default meta;

const Stack = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 320 }}>
    {children}
  </div>
);

export const Playground = {
  render: (args) => {
    const [value, setValue] = React.useState(40);
    return (
      <div style={{ width: 320 }}>
        <Slider {...args} value={value} onChange={(_e, v) => setValue(v)} />
        <div style={{ fontSize: 12, color: 'var(--tp-slate-500)', marginTop: 8 }}>
          Value: {value}
        </div>
      </div>
    );
  },
};

export const Colors = {
  render: (args) => (
    <Stack>
      <Slider {...args} color="primary" defaultValue={60} />
      <Slider {...args} color="success" defaultValue={60} />
      <Slider {...args} color="error" defaultValue={60} />
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
      <Slider {...args} min={0} max={10} step={2} defaultValue={4} />
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Pain scale used in clinical intake forms (0 = no pain, 10 = worst). */
export const PainScale = {
  name: '🩺 Pain Scale (0–10)',
  render: (args) => {
    const [pain, setPain] = React.useState(3);
    const color = pain <= 3 ? 'success' : pain <= 6 ? 'warning' : 'error';
    const label = pain === 0 ? 'No pain' : pain <= 3 ? 'Mild' : pain <= 6 ? 'Moderate' : pain <= 8 ? 'Severe' : 'Worst possible';
    return (
      <div style={{ width: 340, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#454551' }}>Pain intensity</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: color === 'success' ? '#16A34A' : color === 'warning' ? '#D97706' : '#E11D48' }}>{pain}</span>
        </div>
        <Slider {...args} color={color} min={0} max={10} step={1} value={pain} onChange={(_e, v) => setPain(v)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#54545C' }}>
          <span>No pain</span>
          <span style={{ fontWeight: 600, color: '#454551' }}>{label}</span>
          <span>Worst</span>
        </div>
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
      <div style={{ width: 340, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#454551' }}>Amlodipine — daily dose</div>
        <Slider {...args} color={isOverSafe ? 'error' : 'primary'} min={2.5} max={15} step={2.5} value={dose} onChange={(_e, v) => setDose(v)} />
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: isOverSafe ? '#E11D48' : '#171725' }}>{dose} mg</span>
          {isOverSafe && <span style={{ fontSize: 12, color: '#E11D48', fontWeight: 500 }}>⚠ Exceeds recommended max (10 mg)</span>}
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: '#54545C' }}>Recommended range: 2.5–10 mg/day</div>
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
      <div style={{ width: 340, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: '#454551' }}>BMI threshold — filter patients above</div>
        <Slider {...args} color={color} min={10} max={50} step={0.5} value={bmi} onChange={(_e, v) => setBmi(v)} />
        <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#171725' }}>{bmi.toFixed(1)}</span>
          <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 8px', borderRadius: 6, background: color === 'success' ? '#DCFCE7' : color === 'warning' ? '#FEF3C7' : '#FFE4E6', color: color === 'success' ? '#16A34A' : color === 'warning' ? '#92400E' : '#9F1239' }}>{category}</span>
        </div>
      </div>
    );
  },
};
