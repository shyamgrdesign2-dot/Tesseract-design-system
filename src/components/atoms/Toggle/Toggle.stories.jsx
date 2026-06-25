import React from 'react';
import { Toggle } from './Toggle';

const COLORS = ['primary', 'success', 'error', 'warning'];

const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    docs: {
      description: {
        component: [
          'A switch for an instant on/off setting.',
          '',
          '**When to use** — a single binary preference that applies immediately (notifications on/off, feature flags) — no Save step.',
          '**When not** — if the choice is part of a form you submit, prefer **Checkbox**; for one-of-many use **Radio**.',
          '',
          '**Key props** — `checked` + `onCheckedChange` (controlled), `defaultChecked` (uncontrolled), `size`, `color` (checked track tone), `label` + `labelPosition` (clicking the text toggles).',
          '',
          '**Good to know** — controlled (`checked`/`onCheckedChange`) and uncontrolled (`defaultChecked`) are mutually exclusive. With no `label`, pass `aria-label` so the bare switch is announced.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], description: 'sm · md · lg' },
    shape: { control: 'inline-radio', options: ['rounded', 'square'], description: 'Pill toggle vs squared toggle' },
    color: { control: 'inline-radio', options: COLORS, description: 'Checked track colour (primary = blue)' },
    label: { control: 'text', description: 'Adjacent label — clicking it toggles. Blank = bare switch.' },
    ariaLabel: { control: 'text', description: 'Accessible name for the bare switch (no visible label). Always set when `label` is blank.' },
    labelPosition: { control: 'inline-radio', options: ['right', 'left'], description: 'Side the label sits on', if: { arg: 'label', truthy: true } },
    defaultChecked: { control: 'boolean', description: 'Initial on/off state — drives the preview here.' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    name: { control: 'text', description: 'Renders a hidden checkbox for native form submission.' },
    value: { control: 'text', description: 'Submitted form value when `name` is set and the switch is on.' },
    // Controlled prop — the Playground manages on/off via local state, so this
    // can't drive the preview here. Documented for the API, control disabled.
    checked: { control: false, description: 'Controlled on/off — pair with `onCheckedChange`. (Use `defaultChecked` to seed the preview.)' },
    // Event handler — repo stories don't use Storybook actions; documented only.
    onCheckedChange: { control: false, description: 'Fired with the next boolean state on toggle: `(next, event) => void`.' },
  },
  args: {
    size: 'md',
    shape: 'rounded',
    color: 'primary',
    label: '',
    ariaLabel: 'Notifications',
    labelPosition: 'right',
    defaultChecked: false,
    disabled: false,
    required: false,
    name: '',
    value: 'on',
  },
};

export default meta;

// Build an accurate, copy-paste snippet from the controls (what "Show code" shows).
const toggleCode = ({ size = 'md', shape = 'rounded', color = 'primary', label = '', ariaLabel, labelPosition = 'right', disabled, required, defaultChecked, name, value = 'on' }) => {
  const lines = [];
  if (size !== 'md') lines.push(`  size="${size}"`);
  if (shape !== 'rounded') lines.push(`  shape="${shape}"`);
  if (color !== 'primary') lines.push(`  color="${color}"`);
  if (label) lines.push(`  label="${label}"`);
  if (!label && ariaLabel) lines.push(`  ariaLabel="${ariaLabel}"`);
  if (label && labelPosition !== 'right') lines.push(`  labelPosition="${labelPosition}"`);
  if (defaultChecked) lines.push('  defaultChecked');
  if (disabled) lines.push('  disabled');
  if (required) lines.push('  required');
  if (name) lines.push(`  name="${name}"`);
  if (name && value !== 'on') lines.push(`  value="${value}"`);
  return lines.length ? `<Toggle\n${lines.join('\n')}\n/>` : '<Toggle />';
};

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

// Keyed on `defaultChecked` so changing that control re-initialises the local
// value (the switch stays interactive while the control still drives it).
function ToggleDemo({ defaultChecked, ...args }) {
  const [on, setOn] = React.useState(Boolean(defaultChecked));
  return <Toggle {...args} checked={on} onCheckedChange={setOn} />;
}

export const Playground = {
  render: (args) => <ToggleDemo key={String(args.defaultChecked)} {...args} />,
  parameters: { docs: { source: { transform: (_code, ctx) => toggleCode(ctx.args) } } },
};

export const Sizes = {
  render: (args) => (
    <Row>
      <Toggle {...args} size="sm" defaultChecked aria-label="small" />
      <Toggle {...args} size="md" defaultChecked aria-label="medium" />
      <Toggle {...args} size="lg" defaultChecked aria-label="large" />
    </Row>
  ),
};

/** Rounded pill toggle vs squared toggle (track + thumb). */
export const Shapes = {
  render: (args) => (
    <Row>
      <Toggle {...args} shape="rounded" defaultChecked aria-label="rounded" />
      <Toggle {...args} shape="square" defaultChecked aria-label="square" />
    </Row>
  ),
};

export const States = {
  render: (args) => (
    <Row>
      <Toggle {...args} aria-label="off" />
      <Toggle {...args} defaultChecked aria-label="on" />
      <Toggle {...args} disabled aria-label="disabled off" />
      <Toggle {...args} disabled defaultChecked aria-label="disabled on" />
    </Row>
  ),
};

/** Checked track colour — primary (blue) · success · error · warning. */
export const Colors = {
  render: (args) => (
    <Row>
      {COLORS.map((color) => (
        <Toggle key={color} {...args} color={color} defaultChecked aria-label={color} />
      ))}
    </Row>
  ),
};

/** Built-in `label` prop — clicking the text toggles. Position via `labelPosition`. */
export const WithLabel = {
  args: { label: 'Enable notifications', defaultChecked: true },
  render: (args) => <ToggleDemo key={String(args.defaultChecked)} {...args} />,
  parameters: { docs: { source: { transform: (_code, ctx) => toggleCode(ctx.args) } } },
};

/** Label on either side of the switch. */
export const LabelPositions = {
  render: (args) => (
    <Row>
      <Toggle {...args} label="Right label" labelPosition="right" defaultChecked />
      <Toggle {...args} label="Left label" labelPosition="left" defaultChecked />
    </Row>
  ),
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
          <Toggle {...args} checked={settings.sms} onCheckedChange={() => toggle('sms')} aria-label="SMS reminders" />
        </SettingsRow>
        <SettingsRow label="Email digest" description="Daily summary of upcoming appointments">
          <Toggle {...args} checked={settings.email} onCheckedChange={() => toggle('email')} aria-label="Email digest" />
        </SettingsRow>
        <SettingsRow label="WhatsApp alerts" description="Receive alerts on WhatsApp">
          <Toggle {...args} checked={settings.whatsapp} onCheckedChange={() => toggle('whatsapp')} aria-label="WhatsApp alerts" />
        </SettingsRow>
        <SettingsRow label="Critical lab alerts" description="Immediate notification for critical lab values">
          <Toggle {...args} checked={settings.criticalAlerts} onCheckedChange={() => toggle('criticalAlerts')} aria-label="Critical lab alerts" />
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
          <Toggle {...args} checked={features.teleconsult} onCheckedChange={() => toggle('teleconsult')} />
        </SettingsRow>
        <SettingsRow label="AI suggestions" description="Suggest diagnoses and treatment plans (beta)">
          <Toggle {...args} checked={features.aiSuggestions} onCheckedChange={() => toggle('aiSuggestions')} />
        </SettingsRow>
        <SettingsRow label="Dark mode" description="Use dark interface theme">
          <Toggle {...args} checked={features.darkMode} onCheckedChange={() => toggle('darkMode')} />
        </SettingsRow>
        <SettingsRow label="Auto-save notes" description="Save clinical notes every 30 seconds">
          <Toggle {...args} checked={features.autoSave} onCheckedChange={() => toggle('autoSave')} />
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
          <Toggle {...args} color="success" checked={active} onCheckedChange={setActive} aria-label="Doctor active status" />
        </div>
      </div>
    );
  },
};
