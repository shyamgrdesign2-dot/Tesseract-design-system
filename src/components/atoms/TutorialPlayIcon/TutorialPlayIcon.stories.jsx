import React from 'react';
import { TutorialPlayIcon } from './TutorialPlayIcon';

const meta = {
  title: 'Atoms/TutorialPlayIcon',
  component: TutorialPlayIcon,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    size: { control: 'number' },
    color: { control: 'color' },
  },
  args: {
    size: 48,
    color: '#8A4DBB',
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {};

export const Sizes = {
  render: (args) => (
    <Row>
      {[24, 32, 48, 64, 96].map((size) => (
        <TutorialPlayIcon key={size} {...args} size={size} />
      ))}
    </Row>
  ),
};

export const Colors = {
  render: (args) => (
    <Row>
      <TutorialPlayIcon {...args} color="#8A4DBB" />
      <TutorialPlayIcon {...args} color="var(--tp-blue-500, #2563eb)" />
      <TutorialPlayIcon {...args} color="var(--tp-success-500, #16a34a)" />
      <TutorialPlayIcon {...args} color="var(--tp-error-500, #e11d48)" />
    </Row>
  ),
};

/** Tutorial launcher links used inside empty states or onboarding flows. */
export const TutorialLinks = {
  name: '🎓 Tutorial Launchers',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'Inter, sans-serif', maxWidth: 360 }}>
      {[
        { label: 'How to book an appointment', color: '#4B4AD5' },
        { label: 'How to create a prescription', color: '#8A4DBB' },
        { label: 'Setting up teleconsult', color: '#16A34A' },
        { label: 'Importing patient records', color: '#D97706' },
      ].map(({ label, color }) => (
        <button
          key={label}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E2EA', background: '#FAFAFA', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif' }}
        >
          <TutorialPlayIcon {...args} size={28} color={color} />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#454551' }}>{label}</span>
        </button>
      ))}
    </div>
  ),
};

/** Play icon next to a help card — typical onboarding placement. */
export const InHelpCard = {
  name: '💡 In Help Card',
  render: (args) => (
    <div style={{ width: 320, padding: '20px', border: '1px solid #E2E2EA', borderRadius: 14, background: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', gap: 14, alignItems: 'center' }}>
      <TutorialPlayIcon {...args} size={40} color="#8A4DBB" />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#171725', marginBottom: 3 }}>Getting started</div>
        <div style={{ fontSize: 12, color: '#717179' }}>Watch a 2-minute overview of TatvaPractice.</div>
      </div>
    </div>
  ),
};
