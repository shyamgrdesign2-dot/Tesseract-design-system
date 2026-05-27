import React from 'react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    src: { control: 'text' },
    name: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    pixels: { control: 'number' },
  },
  args: {
    name: 'Jane Doe',
    size: 'md',
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

const SAMPLE_IMG = 'https://i.pravatar.cc/120?img=12';

export const Playground = {};

export const Sizes = {
  render: (args) => (
    <Row>
      {['sm', 'md', 'lg', 'xl'].map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </Row>
  ),
};

export const Initials = {
  render: (args) => (
    <Row>
      <Avatar {...args} name="Jane Doe" />
      <Avatar {...args} name="Alex" />
      <Avatar {...args} name="Maria Garcia Lopez" />
      <Avatar {...args} name={undefined} />
    </Row>
  ),
};

export const WithImage = {
  args: { src: SAMPLE_IMG },
  render: (args) => (
    <Row>
      {['sm', 'md', 'lg', 'xl'].map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </Row>
  ),
};

export const ImageFallback = {
  args: { src: 'https://invalid.example/broken.png', name: 'Broken Image' },
};

export const CustomPixels = {
  render: (args) => (
    <Row>
      <Avatar {...args} pixels={20} />
      <Avatar {...args} pixels={48} />
      <Avatar {...args} pixels={72} />
    </Row>
  ),
};

const TEAM = [
  { name: 'Ananya Sharma' },
  { name: 'Rohan Nair' },
  { name: 'Diya Patel' },
  { name: 'Vihaan Reddy' },
  { name: 'Arjun Mehta' },
];

export const AvatarStack = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {TEAM.map((person, i) => (
        <div
          key={person.name}
          style={{
            position: 'relative',
            marginLeft: i === 0 ? 0 : -12,
            zIndex: TEAM.length - i,
          }}
        >
          <Avatar name={person.name} size="md" />
        </div>
      ))}
      <div
        style={{
          position: 'relative',
          marginLeft: -12,
          zIndex: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#E2E2EA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 600,
          color: '#54545C',
          border: '2px solid #fff',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        +3
      </div>
    </div>
  ),
};

const DOCTOR_TEAM = [
  { name: 'Dr. Priya Iyer', specialty: 'Cardiologist', ring: '#3B82F6' },
  { name: 'Dr. Suresh Kumar', specialty: 'Neurologist', ring: '#22C55E' },
  { name: 'Dr. Meera Joshi', specialty: 'Orthopedist', ring: '#F59E0B' },
  { name: 'Dr. Kavitha Nair', specialty: 'Gynecologist', ring: '#A855F7' },
];

export const DoctorTeam = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, fontFamily: 'Inter, sans-serif' }}>
      {DOCTOR_TEAM.map(({ name, specialty, ring }) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ boxShadow: `0 0 0 2px ${ring}`, borderRadius: '50%' }}>
            <Avatar name={name} size="lg" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#171725' }}>{name}</div>
            <div style={{ fontSize: 12, color: '#54545C' }}>{specialty}</div>
          </div>
        </div>
      ))}
    </div>
  ),
};

const STATUS_CONFIG = [
  { name: 'Arun Patel', status: 'Online', dot: '#22C55E' },
  { name: 'Sneha Reddy', status: 'Away', dot: '#F59E0B' },
  { name: 'Vikram Singh', status: 'Busy', dot: '#EF4444' },
  { name: 'Pooja Sharma', status: 'Offline', dot: '#9CA3AF' },
];

export const WithOnlineStatus = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, fontFamily: 'Inter, sans-serif' }}>
      {STATUS_CONFIG.map(({ name, status, dot }) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar name={name} size="md" />
            <span
              style={{
                position: 'absolute',
                bottom: 1,
                right: 1,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: dot,
                border: '2px solid #fff',
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: '#54545C' }}>{status}</div>
        </div>
      ))}
    </div>
  ),
};

const PATIENT_LIST = [
  { name: 'Ramesh Gupta', specialty: 'Cardiology', status: 'Active', statusColor: '#22C55E', statusBg: '#DCFCE7' },
  { name: 'Lakshmi Devi', specialty: 'Neurology', status: 'Follow-up', statusColor: '#F59E0B', statusBg: '#FEF9C3' },
  { name: 'Ajay Verma', specialty: 'Orthopedics', status: 'Discharged', statusColor: '#54545C', statusBg: '#F3F4F6' },
];

export const InList = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        width: 480,
        border: '1px solid #E2E2EA',
        borderRadius: 8,
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {PATIENT_LIST.map(({ name, specialty, status, statusColor, statusBg }, i) => (
        <div
          key={name}
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: i < PATIENT_LIST.length - 1 ? '1px solid #E2E2EA' : 'none',
            background: '#fff',
          }}
        >
          <Avatar name={name} size="md" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#171725' }}>{name}</div>
            <div style={{ fontSize: 12, color: '#54545C' }}>{specialty}</div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: statusColor,
              background: statusBg,
              borderRadius: 999,
              padding: '2px 10px',
            }}
          >
            {status}
          </div>
        </div>
      ))}
    </div>
  ),
};
