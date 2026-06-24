import React from 'react';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Atoms/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], table: { category: 'Style' } },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'], table: { category: 'Style' } },
    color: { control: 'inline-radio', options: ['primary', 'success', 'error', 'warning'], description: 'Accent colour for the group (primary = blue). Per-Radio color overrides.', table: { category: 'Style' } },
    gap: { control: { type: 'range', min: 0, max: 40, step: 2 }, name: 'gap (px)', description: 'Override the group gap. Blank = token default (horizontal vs vertical).', table: { category: 'Style' } },
    error: { control: 'boolean', description: 'Invalid styling — accent + labels shift to the error ramp.', table: { category: 'State' } },
    disabled: { control: 'boolean', name: 'disable all', table: { category: 'State' } },
    disabledOption: { control: 'inline-radio', options: ['none', 'email', 'sms', 'push'], name: 'disable one', table: { category: 'State' } },
    name: { control: 'text', table: { category: 'Content' } },
    value: { control: false },
    onChange: { control: false },
  },
  args: {
    size: 'md',
    orientation: 'vertical',
    color: 'primary',
    gap: undefined,
    error: false,
    disabled: false,
    disabledOption: 'none',
    name: 'demo-group',
  },
};

export default meta;

const Group = ({ size, orientation, color, gap, error, disabled, disabledOption, ...args }) => {
  const [value, setValue] = React.useState('email');
  const opts = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push notification' },
  ];
  return (
    <RadioGroup {...args} value={value} onChange={setValue} orientation={orientation} size={size} color={color} gap={gap} error={error}>
      {opts.map((o) => (
        <Radio key={o.value} value={o.value} label={o.label} disabled={disabled || disabledOption === o.value} />
      ))}
    </RadioGroup>
  );
};

// Build a copy-paste snippet from the controls (what "Show code" shows).
const radioGroupCode = ({ size = 'md', orientation = 'vertical', color = 'primary', gap, error }) => {
  const lines = [`  value={value}`, `  onChange={setValue}`];
  if (size !== 'md') lines.push(`  size="${size}"`);
  if (orientation !== 'vertical') lines.push(`  orientation="${orientation}"`);
  if (color !== 'primary') lines.push(`  color="${color}"`);
  if (gap != null) lines.push(`  gap={${gap}}`);
  if (error) lines.push(`  error`);
  return `<RadioGroup\n${lines.join('\n')}\n>\n  <Radio value="email" label="Email" />\n  <Radio value="sms" label="SMS" />\n  <Radio value="push" label="Push notification" />\n</RadioGroup>`;
};

export const Playground = {
  render: (args) => <Group {...args} />,
  parameters: { docs: { source: { transform: (_code, ctx) => radioGroupCode(ctx.args) } } },
};

export const Sizes = {
  render: () => {
    const [value, setValue] = React.useState('md');
    return (
      <RadioGroup name="sizes" value={value} onChange={setValue} style={{ flexDirection: 'row', gap: 24 }}>
        <Radio value="sm" label="Small" size="sm" />
        <Radio value="md" label="Medium" size="md" />
        <Radio value="lg" label="Large" size="lg" />
      </RadioGroup>
    );
  },
};

export const WithDisabledOption = {
  render: (args) => {
    const [value, setValue] = React.useState('a');
    return (
      <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="a" label="Available" />
        <Radio value="b" label="Also available" />
        <Radio value="c" label="Disabled option" disabled />
      </RadioGroup>
    );
  },
};

export const HorizontalLayout = {
  render: (args) => {
    const [value, setValue] = React.useState('yes');
    return (
      <RadioGroup {...args} value={value} onChange={setValue} style={{ flexDirection: 'row', gap: 24 }}>
        <Radio value="yes" label="Yes" />
        <Radio value="no" label="No" />
        <Radio value="maybe" label="Maybe" />
      </RadioGroup>
    );
  },
};

/** Semantic accent colours on the group — primary (blue) is the default. */
export const Colors = {
  render: () => {
    const colors = ['primary', 'success', 'error', 'warning'];
    const [value, setValue] = React.useState({});
    return (
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {colors.map((color) => (
          <RadioGroup key={color} name={`color-${color}`} color={color} value={value[color] ?? 'a'} onChange={(v) => setValue((s) => ({ ...s, [color]: v }))}>
            <Radio value="a" label={color} />
            <Radio value="b" label="Option two" />
          </RadioGroup>
        ))}
      </div>
    );
  },
};

/** A Radio with a `description` — smaller helper text under the option label. */
export const WithDescription = {
  render: () => {
    const [value, setValue] = React.useState('standard');
    return (
      <RadioGroup name="plan" value={value} onChange={setValue} gap={12}>
        <Radio value="standard" label="Standard" description="Up to 3 working days for delivery." />
        <Radio value="express" label="Express" description="Next working day, signature on arrival." />
        <Radio value="same-day" label="Same day" description="Dispatched within the hour where available." />
      </RadioGroup>
    );
  },
};

/** Error state — the group `error` flag shifts the accent + labels to the error ramp. */
export const ErrorState = {
  render: () => {
    const [value, setValue] = React.useState('no');
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: 360 }}>
        <RadioGroup name="consent" value={value} onChange={setValue} error>
          <Radio value="yes" label="I agree to the terms" />
          <Radio value="no" label="I do not agree" />
        </RadioGroup>
        <p style={{ marginTop: 8, fontSize: 'var(--tesseract-text-body-xs)', color: 'var(--tesseract-error-600, #dc2626)' }}>You must accept the terms to continue.</p>
      </div>
    );
  },
};

export const AppointmentType = {
  name: '📅 Appointment Type',
  render: () => {
    const [type, setType] = React.useState('in-person');
    return (
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#54545C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Appointment Type</div>
        <RadioGroup name="appt-type" value={type} onChange={setType}>
          <Radio value="in-person" label="In-person" />
          <Radio value="teleconsult" label="Teleconsult (Video)" />
          <Radio value="phone" label="Phone call" />
          <Radio value="home-visit" label="Home visit" />
        </RadioGroup>
        <div style={{ marginTop: 12, fontSize: 13, color: '#454551' }}>Selected: <strong>{type}</strong></div>
      </div>
    );
  },
};

export const PatientGender = {
  render: () => {
    const [gender, setGender] = React.useState('male');
    return (
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#54545C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gender</div>
        <RadioGroup name="patient-gender" value={gender} onChange={setGender} style={{ flexDirection: 'row', gap: 20 }}>
          <Radio value="male" label="Male" />
          <Radio value="female" label="Female" />
          <Radio value="other" label="Other" />
          <Radio value="prefer-not" label="Prefer not to say" />
        </RadioGroup>
        <div style={{ marginTop: 12, fontSize: 13, color: '#454551' }}>Selected: <strong>{gender}</strong></div>
      </div>
    );
  },
};

export const ConsultationMode = {
  name: '🩺 Consultation Urgency',
  render: () => {
    const [urgency, setUrgency] = React.useState('routine');
    const descriptions = {
      routine: 'Standard appointment slot, no clinical urgency.',
      urgent: 'Please call the clinic to confirm availability.',
      emergency: 'Go to the nearest facility or call 112.',
    };
    return (
      <div style={{ background: '#fff', border: '1px solid #E2E2EA', borderRadius: 10, padding: 20, fontFamily: 'Inter, sans-serif', maxWidth: 360 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#54545C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Consultation Urgency</div>
        <RadioGroup name="consultation-urgency" value={urgency} onChange={setUrgency}>
          <Radio value="routine" label="Routine" />
          <Radio value="urgent" label="Urgent (within 48 hours)" />
          <Radio value="emergency" label="Emergency — same day" />
        </RadioGroup>
        <p style={{ marginTop: 12, fontSize: 13, color: '#454551', lineHeight: 1.5 }}>{descriptions[urgency]}</p>
      </div>
    );
  },
};

export const FormIntegration = {
  name: '📋 Follow-up Reminder',
  render: () => {
    const [channel, setChannel] = React.useState('sms');
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: 360 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#54545C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Send reminder via</div>
        <RadioGroup name="reminder-channel" value={channel} onChange={setChannel} style={{ flexDirection: 'row', gap: 20 }}>
          <Radio value="sms" label="SMS" />
          <Radio value="email" label="Email" />
          <Radio value="whatsapp" label="WhatsApp" />
        </RadioGroup>
        <div style={{ marginTop: 16 }}>
          <button style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#4B4AD5', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Confirm
          </button>
        </div>
      </div>
    );
  },
};
