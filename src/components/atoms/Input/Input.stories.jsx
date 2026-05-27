import React from 'react';
import { Input } from './Input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel'],
    },
  },
  args: {
    size: 'md',
    error: false,
    fullWidth: false,
    disabled: false,
    placeholder: 'Enter text…',
    type: 'text',
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

const Stack = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
    {children}
  </div>
);

export const Playground = {};

const Controlled = (args) => {
  const [value, setValue] = React.useState('');
  return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const Interactive = {
  render: (args) => <Controlled {...args} placeholder="Type here…" />,
};

export const Sizes = {
  render: (args) => (
    <Stack>
      {['sm', 'md', 'lg'].map((size) => (
        <Input key={size} {...args} size={size} placeholder={`Size ${size}`} />
      ))}
    </Stack>
  ),
};

export const States = {
  render: (args) => (
    <Stack>
      <Input {...args} placeholder="Default" />
      <Input {...args} placeholder="With value" defaultValue="Hello world" />
      <Input {...args} placeholder="Error state" error />
      <Input {...args} placeholder="Disabled" disabled />
    </Stack>
  ),
};

export const Error = {
  args: { error: true, defaultValue: 'invalid@' },
};

export const FullWidth = {
  args: { fullWidth: true, placeholder: 'Full width input' },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Input {...args} />
    </div>
  ),
};

export const Types = {
  render: (args) => (
    <Stack>
      <Input {...args} type="text" placeholder="Text" />
      <Input {...args} type="email" placeholder="Email" />
      <Input {...args} type="password" placeholder="Password" />
      <Input {...args} type="number" placeholder="Number" />
      <Input {...args} type="search" placeholder="Search" />
    </Stack>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

const FieldLabel = ({ children }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'Inter, sans-serif' }}>
    <span style={{ fontSize: 12, fontWeight: 500, color: '#717179' }}>{children[0]}</span>
    {children[1]}
  </label>
);

/** Patient search bar — the most common input in clinical apps. */
export const PatientSearch = {
  name: '🔍 Patient Search',
  render: (args) => {
    const [query, setQuery] = React.useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360, fontFamily: 'Inter, sans-serif' }}>
        <Input
          {...args}
          fullWidth
          type="search"
          placeholder="Search by name, MRN, or phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <div style={{ fontSize: 12, color: '#717179', paddingLeft: 2 }}>
            Searching for: <strong style={{ color: '#171725' }}>{query}</strong>
          </div>
        )}
      </div>
    );
  },
};

/** Typical new-patient intake form fields. */
export const PatientIntakeForm = {
  name: '📋 Patient Intake Form',
  render: (args) => {
    const [form, setForm] = React.useState({ firstName: '', lastName: '', mobile: '', mrn: '' });
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const valid = form.firstName && form.lastName && form.mobile.length >= 10;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 340, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#171725', marginBottom: 2 }}>New patient registration</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#717179', marginBottom: 4 }}>First name *</div>
            <Input {...args} fullWidth placeholder="Rohan" value={form.firstName} onChange={set('firstName')} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#717179', marginBottom: 4 }}>Last name *</div>
            <Input {...args} fullWidth placeholder="Sharma" value={form.lastName} onChange={set('lastName')} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#717179', marginBottom: 4 }}>Mobile number *</div>
          <Input {...args} fullWidth type="tel" placeholder="+91 98765 43210" value={form.mobile} onChange={set('mobile')} error={form.mobile.length > 0 && form.mobile.length < 10} />
          {form.mobile.length > 0 && form.mobile.length < 10 && (
            <div style={{ fontSize: 11, color: '#E11D48', marginTop: 4 }}>Enter a valid 10-digit number</div>
          )}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#717179', marginBottom: 4 }}>MRN (auto-generated if blank)</div>
          <Input {...args} fullWidth placeholder="MRN-YYYYMMDD-XXX" value={form.mrn} onChange={set('mrn')} />
        </div>
        <button
          disabled={!valid}
          style={{ marginTop: 4, padding: '9px 0', borderRadius: 6, border: 'none', background: valid ? '#4B4AD5' : '#E2E2EA', color: valid ? '#fff' : '#717179', fontWeight: 600, fontSize: 14, cursor: valid ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}
        >
          Register patient
        </button>
      </div>
    );
  },
};

/** Vitals entry inputs — numeric, each with a unit suffix hint. */
export const VitalsEntry = {
  name: '🩺 Vitals Entry',
  render: (args) => {
    const vitals = [
      { key: 'bp', label: 'Blood pressure', placeholder: '120/80', unit: 'mmHg' },
      { key: 'hr', label: 'Heart rate', placeholder: '72', unit: 'bpm' },
      { key: 'spo2', label: 'SpO₂', placeholder: '98', unit: '%' },
      { key: 'temp', label: 'Temperature', placeholder: '98.6', unit: '°F' },
    ];
    const [values, setValues] = React.useState({});
    const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: 380, fontFamily: 'Inter, sans-serif' }}>
        {vitals.map(({ key, label, placeholder, unit }) => (
          <div key={key}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#717179', marginBottom: 4 }}>{label}</div>
            <div style={{ position: 'relative' }}>
              <Input {...args} fullWidth placeholder={placeholder} value={values[key] || ''} onChange={set(key)} />
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#A2A2A8', pointerEvents: 'none', fontFamily: 'Inter, sans-serif' }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
