import { Banner } from './Banner';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/Banner',
  component: Banner,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
    },
    title: { control: 'text' },
    children: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: {
    status: 'info',
    title: 'Scheduled maintenance',
    children: 'The system will be unavailable on Sunday from 2–4 AM IST.',
    dismissible: false,
  },
};

export default meta;

const Stack = ({ children }) => (
  <div style={{ display: 'grid', gap: 12 }}>{children}</div>
);

export const Playground = {};

export const Statuses = {
  render: (args) => (
    <Stack>
      {['info', 'success', 'warning', 'error'].map((status) => (
        <Banner key={status} {...args} status={status} title={status}>
          {`A ${status} banner spanning the full width.`}
        </Banner>
      ))}
    </Stack>
  ),
};

export const Dismissible = {
  args: { dismissible: true, status: 'warning', title: 'Action recommended' },
};

export const WithAction = {
  args: {
    status: 'success',
    title: 'New version available',
    children: 'Refresh to load the latest improvements.',
    action: (
      <Button size="sm" variant="outline">
        Refresh
      </Button>
    ),
  },
};

export const DismissibleWithAction = {
  args: {
    status: 'info',
    title: 'Complete your profile',
    children: 'Add a profile photo to help colleagues recognise you.',
    dismissible: true,
    action: (
      <Button size="sm" variant="solid">
        Add photo
      </Button>
    ),
  },
};

export const MessageOnly = {
  args: { title: undefined, children: 'A simple full-width announcement.' },
};

export const HealthcareBanners = {
  name: '🏥 Healthcare Banners',
  render: () => (
    <Stack>
      <Banner status="error" title="EHR sync failure" dismissible={false}>
        Patient records could not be synced with the national registry. Contact support if the issue persists.
      </Banner>
      <Banner status="warning" title="Incomplete clinical notes" dismissible={true}>
        3 visit notes from today are missing diagnoses. Complete them before end of day.
      </Banner>
      <Banner status="success" title="Backup completed" dismissible={true}>
        All patient data has been securely backed up to the cloud.
      </Banner>
      <Banner status="info" title="New ABDM guidelines effective 1 June 2026" dismissible={true}>
        Review updated data-sharing rules before patient interactions.
      </Banner>
    </Stack>
  ),
};

export const SystemAlerts = {
  name: '⚙️ System Alerts',
  render: () => (
    <Stack>
      <Banner status="warning" dismissible={true}>
        Scheduled maintenance on Sunday 1 June 2026 from 2–4 AM IST. Save all work before then.
      </Banner>
      <Banner status="info" dismissible={true}>
        You are viewing a read-only snapshot of this patient record.
      </Banner>
      <Banner status="error" dismissible={true}>
        Database connection interrupted. Changes may not be saved.
      </Banner>
    </Stack>
  ),
};

export const WithActions = {
  name: '⚡ With Actions',
  render: () => (
    <Stack>
      <Banner
        status="warning"
        title="License expiring soon"
        action={<Button size="sm" variant="solid">Renew</Button>}
      >
        Your TP Enterprise license expires on 15 June 2026.
      </Banner>
      <Banner
        status="info"
        title="Software update available"
        action={<Button size="sm" variant="outline">Update now</Button>}
      >
        Version 2.4.1 includes critical security patches.
      </Banner>
      <Banner
        status="success"
        title="Bulk import ready"
        action={<Button size="sm" variant="ghost">Download report</Button>}
      >
        542 patient records imported successfully.
      </Banner>
    </Stack>
  ),
};
