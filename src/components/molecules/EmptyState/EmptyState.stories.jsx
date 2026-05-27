import React from 'react';
import { EmptyState } from './EmptyState';
import { TPButton } from '@/src/components/atoms/Button/button-system/TPButton';
import {
  Calendar,
  Search,
  FileText,
  Users,
  AlertCircle,
} from '@/src/components/atoms/icons/lucide';

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'No appointments today',
    description: 'Your schedule is clear. Book a new appointment to get started.',
  },
};

export default meta;

/** Fully args-driven — tweak title, description, and icon via controls. */
export const Playground = {
  render: (args) => (
    <EmptyState
      {...args}
      icon={<Calendar width={40} height={40} color="#54545C" />}
    />
  ),
};

/** Appointment schedule is empty — Calendar icon, CTA to book. */
export const NoAppointments = {
  render: () => (
    <EmptyState
      icon={<Calendar width={40} height={40} color="#54545C" />}
      title="No appointments today"
      description="Your schedule is clear."
      action={
        <TPButton variant="solid" theme="primary">
          Book Appointment
        </TPButton>
      }
    />
  ),
};

/** Patient search returned no matches. */
export const NoSearchResults = {
  render: () => (
    <EmptyState
      icon={<Search width={40} height={40} color="#54545C" />}
      title="No patients found"
      description="Try a different name, MRN, or phone number."
      action={
        <TPButton variant="outline" theme="neutral">
          Clear search
        </TPButton>
      }
    />
  ),
};

/** Document library is empty — prompt to upload. */
export const NoDocuments = {
  render: () => (
    <EmptyState
      icon={<FileText width={40} height={40} color="#54545C" />}
      title="No documents uploaded"
      description="Upload discharge summaries, lab reports, or prescriptions."
      action={
        <TPButton variant="solid" theme="primary">
          Upload document
        </TPButton>
      }
    />
  ),
};

/** No patients registered yet — dual CTAs side by side. */
export const NoPatients = {
  render: () => (
    <EmptyState
      icon={<Users width={40} height={40} color="#54545C" />}
      title="No patients registered"
      description="Add your first patient to get started."
      action={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <TPButton variant="solid" theme="primary">Add patient</TPButton>
          <TPButton variant="ghost" theme="neutral">Import CSV</TPButton>
        </div>
      }
    />
  ),
};

/** Data failed to load — error icon and retry CTA. */
export const ErrorState = {
  render: () => (
    <EmptyState
      icon={<AlertCircle width={40} height={40} color="#E11D48" />}
      title="Something went wrong"
      description="We couldn't load your appointments. Please try again."
      action={
        <TPButton variant="solid" theme="error">
          Retry
        </TPButton>
      }
    />
  ),
};

/** EmptyState embedded inside a table-like container to preview in-page placement. */
export const InContextTable = {
  render: () => (
    <div
      style={{
        width: 640,
        height: 280,
        border: '1px solid #E2E2EA',
        borderRadius: 10,
        background: '#FAFAFA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <EmptyState
        icon={<Search width={36} height={36} color="#54545C" />}
        title="No patients found"
        description="Try a different name, MRN, or phone number."
        action={
          <TPButton variant="outline" theme="neutral" size="sm">
            Clear search
          </TPButton>
        }
      />
    </div>
  ),
};

/** Side-by-side comparison of the same EmptyState at three icon sizes. */
export const IconSizes = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {[24, 40, 64].map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #E2E2EA',
            borderRadius: 10,
            padding: '24px 20px',
            minWidth: 180,
            background: '#fff',
          }}
        >
          <span style={{ fontSize: 11, color: '#54545C', fontFamily: 'Inter, sans-serif', marginBottom: 16 }}>{size}px</span>
          <EmptyState
            icon={<Calendar width={size} height={size} color="#54545C" />}
            title="No appointments"
            description="Schedule is clear."
          />
        </div>
      ))}
    </div>
  ),
};
