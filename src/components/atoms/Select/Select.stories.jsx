import React from 'react';
import { Select } from './Select';

const meta = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    size: 'md',
    error: false,
    fullWidth: false,
    disabled: false,
    placeholder: 'Select an option…',
  },
};

export default meta;

const Stack = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
    {children}
  </div>
);

const Options = () => (
  <>
    <option value="cardiology">Cardiology</option>
    <option value="neurology">Neurology</option>
    <option value="oncology">Oncology</option>
    <option value="pediatrics">Pediatrics</option>
  </>
);

export const Playground = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    return (
      <Select {...args} value={value} onChange={(e) => setValue(e.target.value)}>
        <Options />
      </Select>
    );
  },
};

export const Sizes = {
  render: (args) => (
    <Stack>
      {['sm', 'md', 'lg'].map((size) => (
        <Select key={size} {...args} size={size} placeholder={`Size ${size}`}>
          <Options />
        </Select>
      ))}
    </Stack>
  ),
};

export const States = {
  render: (args) => (
    <Stack>
      <Select {...args} placeholder="Default">
        <Options />
      </Select>
      <Select {...args} defaultValue="neurology">
        <Options />
      </Select>
      <Select {...args} placeholder="Error" error>
        <Options />
      </Select>
      <Select {...args} placeholder="Disabled" disabled>
        <Options />
      </Select>
    </Stack>
  ),
};

export const FullWidth = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Select {...args} placeholder="Full width select">
        <Options />
      </Select>
    </div>
  ),
};

export const BloodGroup = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ width: 200 }}>
        <Select {...args} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Blood group" fullWidth={false}>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </Select>
      </div>
    );
  },
};

const FieldLabel = ({ children }) => (
  <div style={{ fontSize: 13, fontWeight: 500, color: '#171725', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>
    {children}
  </div>
);

export const HealthcareForm = {
  render: (args) => {
    const [specialty, setSpecialty] = React.useState('');
    const [blood, setBlood] = React.useState('');
    const [dept, setDept] = React.useState('');
    const [consult, setConsult] = React.useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
        <div>
          <FieldLabel>Specialty</FieldLabel>
          <Select {...args} value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Select specialty" fullWidth>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="ortho">Orthopedics</option>
            <option value="gynecology">Gynecology</option>
            <option value="pediatrics">Pediatrics</option>
          </Select>
        </div>
        <div>
          <FieldLabel>Blood Group</FieldLabel>
          <Select {...args} value={blood} onChange={(e) => setBlood(e.target.value)} placeholder="Select blood group" fullWidth>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </Select>
        </div>
        <div>
          <FieldLabel>Department</FieldLabel>
          <Select {...args} value={dept} onChange={(e) => setDept(e.target.value)} placeholder="Select department" fullWidth>
            <option value="opd">OPD</option>
            <option value="icu">ICU</option>
            <option value="emergency">Emergency</option>
            <option value="radiology">Radiology</option>
          </Select>
        </div>
        <div>
          <FieldLabel>Consultation Type</FieldLabel>
          <Select {...args} value={consult} onChange={(e) => setConsult(e.target.value)} placeholder="Select type" fullWidth>
            <option value="inperson">In-person</option>
            <option value="tele">Teleconsultation</option>
            <option value="home">Home visit</option>
          </Select>
        </div>
      </div>
    );
  },
};

export const InlineRowSelects = {
  render: (args) => {
    const [gender, setGender] = React.useState('');
    const [age, setAge] = React.useState('');
    const [status, setStatus] = React.useState('');
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 140 }}>
          <Select {...args} value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Gender" fullWidth>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <div style={{ width: 140 }}>
          <Select {...args} value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age range" fullWidth>
            <option value="0-18">0–18</option>
            <option value="18-40">18–40</option>
            <option value="40-60">40–60</option>
            <option value="60+">60+</option>
          </Select>
        </div>
        <div style={{ width: 140 }}>
          <Select {...args} value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" fullWidth>
            <option value="active">Active</option>
            <option value="followup">Follow-up</option>
            <option value="discharged">Discharged</option>
          </Select>
        </div>
      </div>
    );
  },
};
