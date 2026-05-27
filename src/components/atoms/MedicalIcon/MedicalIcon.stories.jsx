import React from 'react';
import { MedicalIcon, tpMedicalIconNames } from './index';

const SAMPLE_NAMES = [
  'ambulance',
  'stethoscope',
  'brain',
  'lungs',
  'pill',
  'injection',
  'hospital',
  'microscope',
];

const meta = {
  title: 'Atoms/MedicalIcon',
  component: MedicalIcon,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    name: {
      control: 'select',
      options: SAMPLE_NAMES,
    },
    variant: { control: 'inline-radio', options: ['line', 'bulk', 'solid'] },
    size: { control: 'number' },
    color: { control: 'color' },
    alt: { control: 'text' },
  },
  args: {
    name: 'stethoscope',
    variant: 'line',
    size: 48,
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {};

export const Variants = {
  render: (args) => (
    <Row>
      {['line', 'bulk', 'solid'].map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
          <MedicalIcon {...args} variant={variant} size={48} />
          <span style={{ fontSize: 12, color: 'var(--tp-slate-500)' }}>{variant}</span>
        </div>
      ))}
    </Row>
  ),
};

export const Sizes = {
  render: (args) => (
    <Row>
      {[16, 24, 32, 48, 64].map((size) => (
        <MedicalIcon key={size} {...args} size={size} />
      ))}
    </Row>
  ),
};

export const Colored = {
  args: { color: 'var(--tp-blue-500, #2563eb)' },
  render: (args) => (
    <Row>
      <MedicalIcon {...args} color="var(--tp-blue-500, #2563eb)" />
      <MedicalIcon {...args} color="var(--tp-error-500, #e11d48)" />
      <MedicalIcon {...args} color="var(--tp-success-500, #16a34a)" />
    </Row>
  ),
};

export const Gallery = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 16 }}>
      {SAMPLE_NAMES.map((name) => (
        <div key={name} style={{ display: 'grid', gap: 6, justifyItems: 'center', textAlign: 'center' }}>
          <MedicalIcon name={name} size={40} />
          <span style={{ fontSize: 11, color: 'var(--tp-slate-500)' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const AvailableNamesCount = {
  render: () => (
    <p style={{ fontSize: 13, color: 'var(--tp-slate-700)' }}>
      Registry contains {tpMedicalIconNames.length} medical icons.
    </p>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Department icons used in sidebar navigation or specialty filters. */
export const DepartmentNav = {
  name: '🏥 Department Navigation',
  render: () => {
    const [active, setActive] = React.useState('stethoscope');
    const depts = [
      { name: 'stethoscope', label: 'General' },
      { name: 'brain', label: 'Neurology' },
      { name: 'lungs', label: 'Pulmonology' },
      { name: 'hospital', label: 'Emergency' },
      { name: 'microscope', label: 'Pathology' },
    ];
    return (
      <div style={{ display: 'flex', gap: 8, fontFamily: 'Inter, sans-serif', flexWrap: 'wrap' }}>
        {depts.map(({ name, label }) => (
          <button
            key={name}
            onClick={() => setActive(name)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 16px', borderRadius: 10, border: '1px solid',
              borderColor: active === name ? '#4B4AD5' : '#E2E2EA',
              background: active === name ? '#EEEEFF' : '#fff',
              cursor: 'pointer', minWidth: 80,
            }}
          >
            <MedicalIcon name={name} size={28} color={active === name ? '#4B4AD5' : '#54545C'} variant="line" />
            <span style={{ fontSize: 11, fontWeight: 600, color: active === name ? '#4B4AD5' : '#54545C' }}>{label}</span>
          </button>
        ))}
      </div>
    );
  },
};

/** Icon + label pairing in a quick-stats strip. */
export const ClinicalStatCards = {
  name: '📊 Clinical Stat Cards',
  render: () => {
    const stats = [
      { icon: 'stethoscope', label: 'Consultations', value: '48', color: '#4B4AD5' },
      { icon: 'pill', label: 'Prescriptions', value: '31', color: '#16A34A' },
      { icon: 'injection', label: 'Vaccinations', value: '7', color: '#D97706' },
      { icon: 'ambulance', label: 'Emergencies', value: '2', color: '#E11D48' },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontFamily: 'Inter, sans-serif' }}>
        {stats.map(({ icon, label, value, color }) => (
          <div key={icon} style={{ padding: '16px 14px', border: '1px solid #E2E2EA', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10, background: '#fff' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MedicalIcon name={icon} size={22} color={color} variant="bulk" />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#171725' }}>{value}</div>
              <div style={{ fontSize: 11, color: '#54545C', marginTop: 2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/** Full icon gallery with search — useful as a developer reference. */
export const SearchableGallery = {
  name: '🔍 Searchable Gallery',
  render: () => {
    const [query, setQuery] = React.useState('');
    const filtered = tpMedicalIconNames.filter((n) => n.toLowerCase().includes(query.toLowerCase()));
    return (
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <input
          aria-label="Search medical icons"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons…"
          style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E2EA', borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12 }}>
          {filtered.slice(0, 48).map((name) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 4px', border: '1px solid #F0F0F6', borderRadius: 8, cursor: 'default' }}>
              <MedicalIcon name={name} size={28} variant="line" />
              <span style={{ fontSize: 9, color: '#54545C', textAlign: 'center', wordBreak: 'break-all' }}>{name}</span>
            </div>
          ))}
        </div>
        {filtered.length > 48 && (
          <p style={{ fontSize: 12, color: '#54545C', marginTop: 12 }}>Showing 48 of {filtered.length} icons matching "{query}".</p>
        )}
        {filtered.length === 0 && (
          <p style={{ fontSize: 13, color: '#54545C' }}>No icons match "{query}".</p>
        )}
      </div>
    );
  },
};
