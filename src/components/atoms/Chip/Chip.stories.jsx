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
  parameters: {
    docs: {
      description: {
        component: [
          'An interactive pill for selectable, removable, or filter tokens.',
          '',
          '**When to use** — toggleable choices (symptom picker), active filter tokens with a dismiss ×, or input tags. Wire `onClick` to select and `onDelete` to remove.',
          '**When not** — for a read-only status label use **Badge**; for a primary action use **Button**.',
          '',
          '**Key props** — `label` (text), `variant` (solid · soft · outline), `color`, `size`, `selected` (active/toggle state), `removable` + `removePosition` (dismiss × and its side).',
          '',
          '**Good to know** — passing `onDelete` is what renders the ×; `removable` alone in the playground maps to it. `selected` is a first-class active state (stronger wash + 500-step accent border), not just a CSS class — drive it from your selection state.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Chip text', table: { category: 'Content' } },
    color: { control: 'select', options: COLORS, description: 'Accent ramp — default · primary · success · warning · error', table: { category: 'Style' } },
    variant: { control: 'inline-radio', options: VARIANTS, description: 'solid · soft · outline', table: { category: 'Style' } },
    size: { control: 'inline-radio', options: SIZES, description: 'sm · md · lg', table: { category: 'Style' } },
    selected: { control: 'boolean', name: 'selected (active)', description: 'First-class active/toggle state — stronger wash + 500 accent border', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    clickable: { control: 'boolean', name: 'clickable (onClick)', description: 'Makes the chip act as a button — button role, hover/press affordance, aria-pressed when selected', table: { category: 'State' } },
    removable: { control: 'boolean', name: 'with dismiss (×)', table: { category: 'State' } },
    removePosition: { control: 'inline-radio', options: ['right', 'left'], name: 'dismiss side', table: { category: 'State' } },
    radius: { control: 'select', options: ['default', 'sharp', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', 'pill'], name: 'corner radius', description: "Restricted radius — a px step, or 'pill' / 'sharp'. 'default' keeps the size default.", table: { category: 'Layout' } },
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
    clickable: false,
    removable: false,
    removePosition: 'right',
    radius: 'default',
    leftIcon: 'star-1',
    rightIcon: '',
    iconVariant: 'linear',
    iconFamily: '',
  },
};

export default meta;

// A radius control comes in as a string. Coerce a pure-number string to a number;
// pass keywords ("pill"/"sharp") / tokens through; blank → undefined (default look).
const radiusValue = (r) => {
  const s = String(r ?? '').trim();
  if (!s || s === 'default') return undefined;
  return /^-?\d+$/.test(s) ? Number(s) : s;
};

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

// Build an accurate, copy-paste code snippet from the controls (what "Show code" shows).
const iconJsx = (name, variant, family, size) =>
  `<TPIcon name="${name}"${variant && variant !== 'linear' ? ` variant="${variant}"` : ''}${family ? ` family="${family}"` : ''} size={${size}} />`;

const chipCode = ({ label = '', color = 'primary', variant = 'soft', size = 'md', selected, radius, disabled, clickable, removable, removePosition, leftIcon, rightIcon, iconVariant, iconFamily }) => {
  const px = ICON_PX[size] || 14;
  const lines = [`  label="${label}"`, `  color="${color}"`, `  variant="${variant}"`, `  size="${size}"`];
  if (selected) lines.push('  selected');
  const rv = radiusValue(radius);
  if (rv != null) lines.push(typeof rv === 'number' ? `  radius={${rv}}` : `  radius="${rv}"`);
  if (disabled) lines.push('  disabled');
  if (clickable) lines.push('  onClick={() => {}}');
  if (removable) lines.push(`  onDelete={() => {}}${removePosition === 'left' ? '\n  removePosition="left"' : ''}`);
  if (leftIcon) lines.push(`  icon={${iconJsx(leftIcon, iconVariant, iconFamily, px)}}`);
  if (rightIcon) lines.push(`  rightIcon={${iconJsx(rightIcon, iconVariant, iconFamily, px)}}`);
  return `<Chip\n${lines.join('\n')}\n/>`;
};

export const Playground = {
  // blank radius keeps the default token look; "pill"/"sharp"/numbers reshape via resolveRadius.
  render: ({ leftIcon, rightIcon, removable, clickable, iconVariant, iconFamily, radius, ...args }) => (
    <Chip
      {...args}
      radius={radiusValue(radius)}
      icon={glyphFor(leftIcon, args.size, iconVariant, iconFamily)}
      rightIcon={glyphFor(rightIcon, args.size, iconVariant, iconFamily)}
      onClick={clickable ? () => {} : undefined}
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
