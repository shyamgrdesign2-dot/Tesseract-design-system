import { Chip } from './index.js';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const COLORS = ['default', 'primary', 'success', 'warning', 'error'];
const VARIANTS = ['filled', 'outlined'];
const SIZES = ['sm', 'md', 'lg'];
const ICON_PX = { sm: 12, md: 14, lg: 16 };

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    color: { control: 'select', options: COLORS, table: { category: 'Style' } },
    variant: { control: 'inline-radio', options: VARIANTS, table: { category: 'Style' } },
    size: { control: 'inline-radio', options: SIZES, table: { category: 'Style' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    removable: { control: 'boolean', name: 'with dismiss (×)', table: { category: 'State' } },
    removePosition: { control: 'inline-radio', options: ['right', 'left'], name: 'dismiss side', table: { category: 'State' } },
    leftIconName: { control: 'text', tpIcon: true, name: 'left icon', table: { category: 'Icons' } },
    rightIconName: { control: 'text', tpIcon: true, name: 'right icon', table: { category: 'Icons' } },
  },
  args: {
    label: 'Chip',
    color: 'default',
    variant: 'filled',
    size: 'md',
    disabled: false,
    removable: false,
    removePosition: 'right',
    leftIconName: '',
    rightIconName: '',
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {
  render: ({ leftIconName, rightIconName, removable, ...args }) => {
    const px = ICON_PX[args.size] || 14;
    return (
      <Chip
        {...args}
        icon={leftIconName ? <TPLibraryIcon name={leftIconName} size={px} /> : undefined}
        rightIcon={rightIconName ? <TPLibraryIcon name={rightIconName} size={px} /> : undefined}
        onDelete={removable ? () => {} : undefined}
      />
    );
  },
};

export const Sizes = {
  render: (args) => (
    <Row>
      {SIZES.map((size) => (
        <Chip key={size} {...args} size={size} label={size.toUpperCase()} />
      ))}
    </Row>
  ),
};

export const Colors = {
  render: (args) => (
    <Row>
      {COLORS.map((color) => (
        <Chip key={color} {...args} color={color} label={color} />
      ))}
    </Row>
  ),
};

export const Variants = {
  render: (args) => (
    <Row>
      {VARIANTS.map((variant) => (
        <Chip key={variant} {...args} variant={variant} label={variant} />
      ))}
    </Row>
  ),
};

export const Outlined = {
  args: { variant: 'outlined' },
  render: (args) => (
    <Row>
      {COLORS.map((color) => (
        <Chip key={color} {...args} color={color} label={color} />
      ))}
    </Row>
  ),
};

export const WithIcon = {
  render: (args) => (
    <Row>
      <Chip {...args} label="Starred" icon={<span aria-hidden>★</span>} />
      <Chip {...args} color="success" label="Verified" icon={<span aria-hidden>✓</span>} />
    </Row>
  ),
};

export const Deletable = {
  render: (args) => (
    <Row>
      {COLORS.map((color) => (
        <Chip key={color} {...args} color={color} label={color} onDelete={() => {}} />
      ))}
    </Row>
  ),
};

export const Clickable = {
  render: (args) => <Chip {...args} label="Click me" color="primary" onClick={() => {}} />,
};

export const Disabled = {
  args: { disabled: true, color: 'primary', label: 'Disabled', onDelete: () => {} },
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

import React from 'react';

/** Symptom chips that can be toggled on/off during a patient intake form. */
export const SymptomSelector = {
  name: '🩺 Symptom Selector',
  render: () => {
    const SYMPTOMS = ['Fever', 'Cough', 'Shortness of breath', 'Fatigue', 'Chest pain', 'Headache', 'Nausea', 'Joint pain'];
    const [selected, setSelected] = React.useState(new Set(['Fever', 'Cough']));
    const toggle = (s) => setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: 480 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#454551', marginBottom: 12 }}>Select presenting symptoms</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SYMPTOMS.map((s) => (
            <Chip
              key={s}
              label={s}
              color={selected.has(s) ? 'primary' : 'default'}
              variant={selected.has(s) ? 'filled' : 'outlined'}
              onClick={() => toggle(s)}
            />
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: '#54545C' }}>
          {selected.size === 0 ? 'No symptoms selected' : `${selected.size} selected: ${[...selected].join(', ')}`}
        </div>
      </div>
    );
  },
};

/** Active filter chips with delete — shown at the top of a patient list. */
export const ActiveFilters = {
  name: '🔽 Active Filters',
  render: () => {
    const [filters, setFilters] = React.useState([
      { id: 'dept', label: 'Dept: Cardiology' },
      { id: 'status', label: 'Status: Active' },
      { id: 'age', label: 'Age: 40–60' },
      { id: 'doctor', label: 'Dr. Mehta' },
    ]);
    const remove = (id) => setFilters((f) => f.filter((x) => x.id !== id));
    return (
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#54545C', marginBottom: 10 }}>Active filters</div>
        {filters.length === 0 ? (
          <span style={{ fontSize: 13, color: '#54545C' }}>No active filters</span>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {filters.map((f) => (
              <Chip key={f.id} label={f.label} color="primary" variant="outlined" onDelete={() => remove(f.id)} />
            ))}
            <button
              onClick={() => setFilters([])}
              style={{ fontSize: 12, color: '#54545C', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', fontFamily: 'Inter, sans-serif', textDecoration: 'underline' }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    );
  },
};

/** Department chips used to tag a doctor's specialties. */
export const DepartmentTags = {
  name: '🏷️ Department Tags',
  render: () => (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#454551', marginBottom: 10 }}>Dr. Ananya Mehta — specialties</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Chip label="Cardiology" color="primary" variant="filled" />
        <Chip label="Interventional Cardiology" color="primary" variant="outlined" />
        <Chip label="Heart Failure" color="warning" variant="outlined" />
        <Chip label="Echocardiography" color="default" variant="outlined" />
      </div>
    </div>
  ),
};
