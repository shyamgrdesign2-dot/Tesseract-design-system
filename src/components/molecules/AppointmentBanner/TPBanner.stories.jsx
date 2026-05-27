import { TPBanner } from './TPBanner';
import { TPButton } from '@/src/components/atoms/Button/button-system/index.js';

const meta = {
  title: 'Molecules/TPBanner',
  component: TPBanner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    titleSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    subtitleSize: { control: 'select', options: ['sm', 'md'] },
    bottomRadius: { control: { type: 'number', min: 0, max: 64 } },
    patternOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    showBackButton: { control: 'boolean' },
    pattern: { control: 'boolean' },
    noise: { control: 'boolean' },
  },
  args: {
    title: 'Appointments',
    size: 'md',
    bottomRadius: 16,
    titleSize: 'md',
    subtitleSize: 'sm',
    showBackButton: false,
    pattern: true,
    patternOpacity: 0.75,
    noise: true,
  },
};

export default meta;

export const Playground = {
  render: (args) => <TPBanner {...args} />,
};

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TPBanner size="sm" title="Small Banner (80px)" />
      <TPBanner size="md" title="Medium Banner (120px)" />
      <TPBanner size="lg" title="Large Banner (160px)" />
    </div>
  ),
};

export const WithSubtitle = {
  render: () => (
    <TPBanner
      title="Appointments"
      subtitle="Manage your daily patient schedule"
    />
  ),
};

export const WithBackButton = {
  render: () => (
    <TPBanner
      showBackButton
      title="Patient Details"
    />
  ),
};

export const WithChips = {
  render: () => (
    <TPBanner
      title="Appointments"
      chips={['Cardiology', 'Outpatient', 'Today']}
    />
  ),
};

export const WithActions = {
  render: () => (
    <TPBanner
      title="Appointments"
      actions={
        <>
          <TPButton surface="dark" variant="outline" size="sm">
            Filter
          </TPButton>
          <TPButton surface="dark" variant="solid" size="sm">
            New Appointment
          </TPButton>
        </>
      }
    />
  ),
};

export const AllTextSizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TPBanner size="md" titleSize="sm" title="Small Title (18px)" />
      <TPBanner size="md" titleSize="md" title="Medium Title (24px)" />
      <TPBanner size="lg" titleSize="lg" title="Large Title (32px)" />
    </div>
  ),
};

export const BottomRadius = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TPBanner bottomRadius={0} title="No Bottom Radius (0)" />
      <TPBanner bottomRadius={16} title="Default Bottom Radius (16)" />
      <TPBanner bottomRadius={32} title="Large Bottom Radius (32)" />
    </div>
  ),
};

export const FullFeatured = {
  render: () => (
    <TPBanner
      size="lg"
      title="Outpatient Appointments"
      subtitle="Cardiology · OPD Block B"
      titleSize="lg"
      subtitleSize="sm"
      showBackButton
      chips={['Today', 'Cardiology', 'Confirmed']}
      pattern
      patternOpacity={0.75}
      noise
      actions={
        <>
          <TPButton surface="dark" variant="outline" size="sm">
            Filter
          </TPButton>
          <TPButton surface="dark" variant="solid" size="sm">
            New Appointment
          </TPButton>
        </>
      }
    />
  ),
};
