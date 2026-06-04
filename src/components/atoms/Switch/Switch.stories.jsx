import React from 'react';
import { Switch } from './Switch';

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['rounded', 'square'], description: 'Pill toggle vs squared toggle' },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    size: 'md',
    shape: 'rounded',
    disabled: false,
    required: false,
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {
  render: (args) => {
    const [on, setOn] = React.useState(false);
    return <Switch {...args} checked={on} onCheckedChange={setOn} />;
  },
};

export const Sizes = {
  render: (args) => (
    <Row>
      <Switch {...args} size="sm" defaultChecked aria-label="small" />
      <Switch {...args} size="md" defaultChecked aria-label="medium" />
      <Switch {...args} size="lg" defaultChecked aria-label="large" />
    </Row>
  ),
};

/** Rounded pill toggle vs squared toggle (track + thumb). */
export const Shapes = {
  render: (args) => (
    <Row>
      <Switch {...args} shape="rounded" defaultChecked aria-label="rounded" />
      <Switch {...args} shape="square" defaultChecked aria-label="square" />
    </Row>
  ),
};

export const States = {
  render: (args) => (
    <Row>
      <Switch {...args} aria-label="off" />
      <Switch {...args} defaultChecked aria-label="on" />
      <Switch {...args} disabled aria-label="disabled off" />
      <Switch {...args} disabled defaultChecked aria-label="disabled on" />
    </Row>
  ),
};

export const WithLabel = {
  render: (args) => {
    const [on, setOn] = React.useState(true);
    const id = React.useId();
    return (
      <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--tp-slate-700)' }}>
        <Switch {...args} id={id} checked={on} onCheckedChange={setOn} />
        Enable notifications
      </label>
    );
  },
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

const SettingsRow = ({ label, description, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F0F0F6', fontFamily: 'Inter, sans-serif' }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#171725' }}>{label}</div>
      {description && <div style={{ fontSize: 12, color: '#54545C', marginTop: 2 }}>{description}</div>}
    </div>
    {children}
  </div>
);

export const NotificationSettings = {
  name: '🔔 Notification Settings',
  render: (args) => {
    const [settings, setSettings] = React.useState({
      sms: true,
      email: false,
      whatsapp: true,
      criticalAlerts: true,
    });
    const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));
    return (
      <div style={{ width: 420, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#171725', marginBottom: 4 }}>Notification Preferences</div>
        <div style={{ fontSize: 13, color: '#54545C', marginBottom: 16 }}>Control how you receive alerts and reminders.</div>
        <SettingsRow label="SMS reminders" description="Appointment and prescription reminders via SMS">
          <Switch {...args} checked={settings.sms} onCheckedChange={() => toggle('sms')} aria-label="SMS reminders" />
        </SettingsRow>
        <SettingsRow label="Email digest" description="Daily summary of upcoming appointments">
          <Switch {...args} checked={settings.email} onCheckedChange={() => toggle('email')} aria-label="Email digest" />
        </SettingsRow>
        <SettingsRow label="WhatsApp alerts" description="Receive alerts on WhatsApp">
          <Switch {...args} checked={settings.whatsapp} onCheckedChange={() => toggle('whatsapp')} aria-label="WhatsApp alerts" />
        </SettingsRow>
        <SettingsRow label="Critical lab alerts" description="Immediate notification for critical lab values">
          <Switch {...args} checked={settings.criticalAlerts} onCheckedChange={() => toggle('criticalAlerts')} aria-label="Critical lab alerts" />
        </SettingsRow>
      </div>
    );
  },
};

export const FeatureToggles = {
  name: '⚙️ Feature Toggles',
  render: (args) => {
    const [features, setFeatures] = React.useState({
      teleconsult: true,
      aiSuggestions: false,
      darkMode: false,
      autoSave: true,
    });
    const toggle = (key) => setFeatures((s) => ({ ...s, [key]: !s[key] }));
    return (
      <div style={{ width: 420, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#171725', marginBottom: 16 }}>Clinic Features</div>
        <SettingsRow label="Teleconsult" description="Enable video consultation for patients">
          <Switch {...args} checked={features.teleconsult} onCheckedChange={() => toggle('teleconsult')} />
        </SettingsRow>
        <SettingsRow label="AI suggestions" description="Suggest diagnoses and treatment plans (beta)">
          <Switch {...args} checked={features.aiSuggestions} onCheckedChange={() => toggle('aiSuggestions')} />
        </SettingsRow>
        <SettingsRow label="Dark mode" description="Use dark interface theme">
          <Switch {...args} checked={features.darkMode} onCheckedChange={() => toggle('darkMode')} />
        </SettingsRow>
        <SettingsRow label="Auto-save notes" description="Save clinical notes every 30 seconds">
          <Switch {...args} checked={features.autoSave} onCheckedChange={() => toggle('autoSave')} />
        </SettingsRow>
        <div style={{ marginTop: 20, padding: '10px 14px', background: '#F7F7FB', borderRadius: 8, border: '1px solid #E2E2EA', fontSize: 12, color: '#454551' }}>
          {Object.entries(features).filter(([, v]) => v).map(([k]) => k).join(', ') || 'No features enabled'}
        </div>
      </div>
    );
  },
};

export const InlineToggle = {
  name: '🔀 Inline Toggle Pair',
  render: (args) => {
    const [active, setActive] = React.useState(true);
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 24, padding: '16px 20px', border: '1px solid #E2E2EA', borderRadius: 10, background: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#171725' }}>Dr. Ananya Mehta</div>
          <div style={{ fontSize: 12, color: '#54545C' }}>Cardiologist · Apollo Clinic</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: active ? '#15803D' : '#54545C', fontWeight: 500 }}>
            {active ? 'Active' : 'Inactive'}
          </span>
          <Switch {...args} checked={active} onCheckedChange={setActive} aria-label="Doctor active status" />
        </div>
      </div>
    );
  },
};
