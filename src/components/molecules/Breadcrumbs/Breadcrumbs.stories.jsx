import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

const meta = {
  title: 'Molecules/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs', 'ai-generated'],
};

export default meta;

export const Playground = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Patients</BreadcrumbItem>
      <BreadcrumbItem active>Anita Sharma</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const TwoLevels = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
      <BreadcrumbItem active>Appointments</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const DeepTrail = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Clinics</BreadcrumbItem>
      <BreadcrumbItem>Cardiology</BreadcrumbItem>
      <BreadcrumbItem>Patients</BreadcrumbItem>
      <BreadcrumbItem active>Visit notes</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const WithLinks = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem>
        <a href="#home" style={{ color: 'inherit' }}>
          Home
        </a>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <a href="#settings" style={{ color: 'inherit' }}>
          Settings
        </a>
      </BreadcrumbItem>
      <BreadcrumbItem active>Profile</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const CustomSeparator = {
  render: () => (
    <Breadcrumbs separator={<span aria-hidden>/</span>}>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Reports</BreadcrumbItem>
      <BreadcrumbItem active>Monthly</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

// ── Healthcare page trails ──────────────────────────────────────────────────

export const PatientRecord = {
  name: '🏥 Patient Record',
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem><a href="#" style={{ color: 'inherit' }}>Dashboard</a></BreadcrumbItem>
      <BreadcrumbItem><a href="#" style={{ color: 'inherit' }}>All Patients</a></BreadcrumbItem>
      <BreadcrumbItem active>Rohan Sharma — MRN-0042</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const AppointmentDetail = {
  name: '📅 Appointment Detail',
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem><a href="#" style={{ color: 'inherit' }}>Dashboard</a></BreadcrumbItem>
      <BreadcrumbItem><a href="#" style={{ color: 'inherit' }}>Appointments</a></BreadcrumbItem>
      <BreadcrumbItem><a href="#" style={{ color: 'inherit' }}>27 May 2026</a></BreadcrumbItem>
      <BreadcrumbItem active>APT-1042 · Dr. Ananya Mehta</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const SettingsDeep = {
  name: '⚙️ Settings Drill-down',
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem><a href="#" style={{ color: 'inherit' }}>Settings</a></BreadcrumbItem>
      <BreadcrumbItem><a href="#" style={{ color: 'inherit' }}>Clinic Profile</a></BreadcrumbItem>
      <BreadcrumbItem active>Staff Roles</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const AllVariants = {
  name: '📋 All separator variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[
        { label: 'Default (›)', sep: undefined },
        { label: 'Slash (/)', sep: <span aria-hidden>/</span> },
        { label: 'Dot (·)', sep: <span aria-hidden style={{ fontSize: 16 }}>·</span> },
        { label: 'Arrow (→)', sep: <span aria-hidden>→</span> },
      ].map(({ label, sep }) => (
        <div key={label}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#54545C', display: 'block', marginBottom: 6 }}>{label}</span>
          <Breadcrumbs {...(sep ? { separator: sep } : {})}>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Patients</BreadcrumbItem>
            <BreadcrumbItem active>Detail view</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      ))}
    </div>
  ),
};
