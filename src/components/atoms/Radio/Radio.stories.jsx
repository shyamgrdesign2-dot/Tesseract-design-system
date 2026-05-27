import React from 'react';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Atoms/Radio',
  component: RadioGroup,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    name: { control: 'text' },
  },
  args: {
    name: 'demo-group',
  },
};

export default meta;

const Group = (args) => {
  const [value, setValue] = React.useState('email');
  return (
    <RadioGroup {...args} value={value} onChange={setValue}>
      <Radio value="email" label="Email" />
      <Radio value="sms" label="SMS" />
      <Radio value="push" label="Push notification" />
    </RadioGroup>
  );
};

export const Playground = {
  render: (args) => <Group {...args} />,
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
