import { Alert } from './Alert';

const meta = {
  title: 'Molecules/Alert',
  component: Alert,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    severity: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
    },
    title: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    severity: 'info',
    title: 'Heads up',
    children: 'This is an inline alert message with supporting detail.',
  },
};

export default meta;

const Stack = ({ children }) => (
  <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>{children}</div>
);

export const Playground = {};

export const Severities = {
  render: (args) => (
    <Stack>
      {['info', 'success', 'warning', 'error'].map((severity) => (
        <Alert key={severity} {...args} severity={severity} title={severity}>
          {`A ${severity} alert describing the situation.`}
        </Alert>
      ))}
    </Stack>
  ),
};

export const WithoutTitle = {
  args: { title: undefined, children: 'A compact alert without a title line.' },
};

export const WithIcon = {
  args: {
    severity: 'warning',
    title: 'Storage almost full',
    icon: <span aria-hidden>⚠️</span>,
    children: 'You have used 92% of your available storage.',
  },
};

export const RichContent = {
  args: {
    severity: 'error',
    title: 'Upload failed',
    children: (
      <>
        <p style={{ margin: 0 }}>Two files could not be processed.</p>
        <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
          <li>report-q1.pdf</li>
          <li>scan-029.dcm</li>
        </ul>
      </>
    ),
  },
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

export const HealthcareScenarios = {
  name: '🏥 Healthcare Scenarios',
  render: () => (
    <Stack>
      <Alert severity="error" title="Critical lab value">
        Serum potassium 6.8 mEq/L — above critical threshold. Immediate review required.
      </Alert>
      <Alert severity="warning" title="Upcoming follow-up overdue">
        Rohan Sharma has a follow-up due on 20 May 2026 that has not been rescheduled.
      </Alert>
      <Alert severity="success" title="Prescription sent">
        Rx for Amlodipine 5mg has been sent to Apollo Pharmacy, Banjara Hills.
      </Alert>
      <Alert severity="info" title="Insurance pre-authorisation pending">
        Cigna Health — Pre-auth for MRI Brain (plain) submitted on 26 May 2026. Awaiting response.
      </Alert>
    </Stack>
  ),
};

export const FormValidation = {
  name: '📋 Form Validation Alerts',
  render: () => (
    <Stack>
      <Alert severity="error" title="Incomplete patient record">
        <>
          <p style={{ margin: 0 }}>The following required fields are missing:</p>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            <li>Date of birth</li>
            <li>Primary contact number</li>
            <li>Blood group</li>
          </ul>
        </>
      </Alert>
      <Alert severity="warning" title="Duplicate patient detected">
        A patient named <strong>Priya Sharma</strong> with the same mobile number already exists.
        Review before creating a new record.
      </Alert>
      <Alert severity="info">
        Saving this prescription will mark the current visit as complete.
      </Alert>
    </Stack>
  ),
};

export const InlineWithActions = {
  name: '⚡ Inline With Actions',
  render: () => (
    <Stack>
      <Alert
        severity="warning"
        title="Session expiring"
        action={
          <button
            style={{ background: 'none', border: '1px solid currentColor', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'inherit', fontFamily: 'Inter, sans-serif' }}
            onClick={() => {}}
          >
            Extend
          </button>
        }
      >
        Your session will expire in 5 minutes. Save your work.
      </Alert>
      <Alert
        severity="info"
        title="New ABDM guidelines"
        action={
          <button
            style={{ background: 'none', border: '1px solid currentColor', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'inherit', fontFamily: 'Inter, sans-serif' }}
            onClick={() => {}}
          >
            Read more
          </button>
        }
      >
        Updated data-sharing rules apply from 1 June 2026.
      </Alert>
    </Stack>
  ),
};
