import { Chip } from './index.js';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

const COLORS = ['default', 'primary', 'success', 'warning', 'error'];
const VARIANTS = ['solid', 'soft', 'outline'];
const SIZES = ['sm', 'md', 'lg'];
const ICON_PX = { sm: 12, md: 14, lg: 16 };
const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];

// Resolve an icon node for a slot, sized to the chip, in the chosen style + family.
const glyphFor = (name, size, variant = 'linear', family) =>
  name ? <TPIcon name={name} variant={variant} family={family || undefined} size={ICON_PX[size] || 14} /> : undefined;

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    color: { control: 'select', options: COLORS, table: { category: 'Style' } },
    variant: { control: 'inline-radio', options: VARIANTS, table: { category: 'Style' } },
    size: { control: 'inline-radio', options: SIZES, table: { category: 'Style' } },
    selected: { control: 'boolean', name: 'selected (active)', description: 'First-class active/toggle state — stronger wash + 500 accent border', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    removable: { control: 'boolean', name: 'with dismiss (×)', table: { category: 'State' } },
    removePosition: { control: 'inline-radio', options: ['right', 'left'], name: 'dismiss side', table: { category: 'State' } },
    radius: { control: { type: 'range', min: 0, max: 24, step: 2 }, name: 'corner radius (px)', description: '0 = sharp · high = pill · default keeps radius-10', table: { category: 'Layout' } },
    leftIcon: { control: 'text', tpIcon: true, name: 'left icon', description: 'CDN icon name for the leading slot (blank = none)', table: { category: 'Icons' } },
    rightIcon: { control: 'text', tpIcon: true, name: 'right icon', description: 'CDN icon name for the trailing slot (blank = none)', table: { category: 'Icons' } },
    iconVariant: { control: 'select', options: ICON_VARIANTS, name: 'icon style', description: 'Icon style applied to both slots', table: { category: 'Icons' } },
    iconFamily: { control: 'text', name: 'icon family', description: 'Override the auto-resolved CDN family (blank = auto)', table: { category: 'Icons' } },
  },
  args: {
    label: 'Chip',
    color: 'primary',
    variant: 'soft',
    size: 'md',
    selected: false,
    disabled: false,
    removable: false,
    removePosition: 'right',
    radius: 10,
    leftIcon: 'star-1',
    rightIcon: '',
    iconVariant: 'linear',
    iconFamily: '',
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

// Build an accurate, copy-paste code snippet from the controls (what "Show code" shows).
const iconJsx = (name, variant, family, size) =>
  `<TPIcon name="${name}"${variant && variant !== 'linear' ? ` variant="${variant}"` : ''}${family ? ` family="${family}"` : ''} size={${size}} />`;

const chipCode = ({ label = '', color = 'primary', variant = 'soft', size = 'md', selected, radius, disabled, removable, removePosition, leftIcon, rightIcon, iconVariant, iconFamily }) => {
  const px = ICON_PX[size] || 14;
  const lines = [`  label="${label}"`, `  color="${color}"`, `  variant="${variant}"`, `  size="${size}"`];
  if (selected) lines.push('  selected');
  if (radius != null && radius !== 10) lines.push(`  radius={${radius}}`);
  if (disabled) lines.push('  disabled');
  if (removable) lines.push(`  onDelete={() => {}}${removePosition === 'left' ? '\n  removePosition="left"' : ''}`);
  if (leftIcon) lines.push(`  icon={${iconJsx(leftIcon, iconVariant, iconFamily, px)}}`);
  if (rightIcon) lines.push(`  rightIcon={${iconJsx(rightIcon, iconVariant, iconFamily, px)}}`);
  return `<Chip\n${lines.join('\n')}\n/>`;
};

export const Playground = {
  // radius=10 is the default token look, so treat it as a no-op (keeps radius-10);
  // any other value is passed through to resolveRadius.
  render: ({ leftIcon, rightIcon, removable, iconVariant, iconFamily, radius, ...args }) => (
    <Chip
      {...args}
      radius={radius != null && radius !== 10 ? radius : undefined}
      icon={glyphFor(leftIcon, args.size, iconVariant, iconFamily)}
      rightIcon={glyphFor(rightIcon, args.size, iconVariant, iconFamily)}
      onDelete={removable ? () => {} : undefined}
    />
  ),
  parameters: { docs: { source: { transform: (_code, ctx) => chipCode(ctx.args) } } },
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

/** Selected (active/toggle) state — stronger wash + a 500-step accent border. */
export const Selected = {
  render: (args) => (
    <Row>
      {COLORS.map((color) => (
        <Chip key={color} {...args} color={color} label={color} selected />
      ))}
    </Row>
  ),
};

/** Radius override — default keeps radius-10; "sharp"/numbers/"pill" reshape the chip. */
export const Radius = {
  render: (args) => (
    <Row>
      <Chip {...args} label="default" />
      <Chip {...args} label="sharp" radius="sharp" />
      <Chip {...args} label="radius 4" radius={4} />
      <Chip {...args} label="radius 16" radius={16} />
      <Chip {...args} label="pill" radius="pill" />
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
              color="primary"
              variant="soft"
              selected={selected.has(s)}
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
