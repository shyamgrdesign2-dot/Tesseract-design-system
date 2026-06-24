import React from 'react';
import { Dropdown } from './Dropdown';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];

// Resolve an icon node in the chosen name + style (variant) + family.
const glyphFor = (name, size = 16, variant = 'linear', family) =>
  name ? <TPIcon name={name} variant={variant} family={family || undefined} size={size} /> : undefined;

const ic = (name, variant = 'linear') => glyphFor(name, 16, variant);

// Department options — title + subtitle + left icon + keyboard shortcut.
const DEPTS = [
  { value: 'cardio', label: 'Cardiology', subtitle: 'Dr. Ananya Mehta', icon: ic('user'), shortcut: '⌘1' },
  { value: 'neuro', label: 'Neurology', subtitle: 'Dr. Rohan Verma', icon: ic('user'), shortcut: '⌘2' },
  { value: 'ortho', label: 'Orthopaedics', subtitle: 'Dr. Priya Nair', icon: ic('user'), shortcut: '⌘3' },
  { value: 'paeds', label: 'Paediatrics', subtitle: 'Dr. Sameer Khan', icon: ic('user'), shortcut: '⌘4' },
  { value: 'derma', label: 'Dermatology', subtitle: 'Dr. Aisha Patel', icon: ic('user'), disabled: true },
  { value: 'radio', label: 'Radiology', subtitle: 'Dr. Vikram Rao', icon: ic('user') },
  { value: 'ent', label: 'ENT', subtitle: 'Dr. Meera Iyer', icon: ic('user') },
  { value: 'gastro', label: 'Gastroenterology', subtitle: 'Dr. Arjun Das', icon: ic('user') },
];

// Plain single-line options.
const SIMPLE = [
  { value: 'active', label: 'Active' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'noshow', label: 'No-show' },
  { value: 'completed', label: 'Completed' },
];

// ── Footer CTA model ──────────────────────────────────────────────────────────
// Up to three footer CTAs (Primary / Secondary / Tertiary), each composing the
// Button atom. Per CTA you pick the variant (or "none" to hide it), the shape
// (text or icon-only), whether a text CTA carries a leading icon, the glyph, and
// the label — the same Button knobs used everywhere else.
const CTA_VARIANTS = ['none', 'solid', 'outline', 'ghost', 'tonal', 'link'];
const CTA_SHAPES = ['text', 'icon'];

const ctaArgTypes = (role, n) => ({
  [`${role}Variant`]:  { control: 'select', options: CTA_VARIANTS, name: `${n} · variant`, table: { category: `${n} CTA` } },
  [`${role}Shape`]:    { control: 'inline-radio', options: CTA_SHAPES, name: `${n} · shape`, table: { category: `${n} CTA` } },
  [`${role}WithIcon`]: { control: 'boolean', name: `${n} · with icon`, table: { category: `${n} CTA` } },
  [`${role}IconName`]: { control: 'text', tpIcon: true, name: `${n} · icon`, table: { category: `${n} CTA` } },
  [`${role}Label`]:    { control: 'text', name: `${n} · label`, table: { category: `${n} CTA` } },
});
const ctaArgs = (role, o) => ({
  [`${role}Variant`]: o.variant, [`${role}Shape`]: o.shape || 'text',
  [`${role}WithIcon`]: o.withIcon ?? false, [`${role}IconName`]: o.iconName || '',
  [`${role}Label`]: o.label || '',
});

// Build a Dropdown action config from the flat per-CTA controls.
function actionFromArgs(a, role, onClick) {
  const variant = a[`${role}Variant`];
  if (!variant || variant === 'none') return undefined;
  const shape = a[`${role}Shape`] || 'text';
  const name = (a[`${role}IconName`] || '').trim();
  const glyph = glyphFor(name, 16, a.iconVariant);
  const label = a[`${role}Label`] || role;
  if (shape === 'icon') return { icon: glyph, ariaLabel: label, variant, onClick };
  return { label, icon: a[`${role}WithIcon`] ? glyph : undefined, variant, onClick };
}

const meta = {
  title: 'Molecules/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Select / combobox with a popover menu — single or multi, optionally searchable, with title+subtitle rows, per-item icons, grouped sections, and a footer of up to three Button CTAs.',
          '',
          '**When to use** — picking from a known set of options (department, status, assignee); a multi-select filter that closes into chips; a typeahead with "add custom".',
          "**When not** — a free-text field with no option list is an `InputBox`; a small fixed set always visible is `Radio`/`Checkbox`; bulk table filtering is `Filter`.",
          '',
          '**Key props** — `mode` single/multi · `options` (flat array, or `[{ heading, options }]` for sections, or `[{ value, label, subtitle, icon, iconRight, shortcut, disabled }]`) · `value` + `onChange` (controlled) · `searchable` + `searchPlaceholder` · `clearable` (single: × to reset) · `loading` (spinner row for async fetch) · `placement` auto/top/bottom · `renderOption(opt, { selected, active })` to replace a row · `primaryAction`/`secondaryAction`/`tertiaryAction` footer CTAs.',
          '',
          '**Good to know** — keyboard nav flows across grouped sections and arrow keys / Enter / Escape are wired; `editable` + `allowCustom` turns the trigger into a typeahead that offers "Add ‹query›". `clearable` only shows in single mode with a value set.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'multi'], description: 'Single value or multi-select array', table: { category: 'Selection' } },
    optionControl: { control: 'inline-radio', options: ['none', 'checkbox', 'radio'], name: 'row control', description: 'Render a checkbox/radio at the start of each option row', table: { category: 'Selection' } },
    chips: { control: 'boolean', description: 'Multi: show selected as removable chips in the trigger', table: { category: 'Selection' } },
    searchable: { control: 'boolean', description: 'Add an in-popover search field that filters options (and sections)', table: { category: 'Behaviour' } },
    searchPlaceholder: { control: 'text', name: 'search placeholder', description: 'Placeholder for the in-popover search field', if: { arg: 'searchable' }, table: { category: 'Behaviour' } },
    clearable: { control: 'boolean', name: 'clearable', description: 'Single-select: show a clear (×) affordance to reset the value', table: { category: 'Behaviour' } },
    loading: { control: 'boolean', name: 'loading', description: 'Show a loading row in the menu (async option fetch)', table: { category: 'Behaviour' } },
    emptyLabel: { control: 'text', name: 'empty label', description: 'Text shown when no options match', table: { category: 'Behaviour' } },
    placement: { control: 'inline-radio', options: ['auto', 'bottom', 'top'], name: 'placement', description: 'Menu placement relative to the trigger', table: { category: 'Layout' } },
    showShortcuts: { control: 'boolean', name: 'item shortcuts', description: 'Show each option\'s `shortcut` hint on its row', table: { category: 'Behaviour' } },
    footerHint: { control: 'boolean', name: 'footer shortcut bar', description: 'Show a keyboard-hint bar at the bottom of the menu', table: { category: 'Behaviour' } },
    withActions: { control: 'boolean', name: 'footer CTAs', description: 'Render the footer Button CTAs (primary / secondary / tertiary)', table: { category: 'Footer' } },
    actionsAlign: { control: 'inline-radio', options: ['left', 'center', 'right', 'full'], name: 'CTA align', description: 'Alignment of the footer CTA row (`full` stretches them)', table: { category: 'Footer' } },
    ...ctaArgTypes('primary', 'Primary'),
    ...ctaArgTypes('secondary', 'Secondary'),
    ...ctaArgTypes('tertiary', 'Tertiary'),
    width: { control: 'inline-radio', options: ['trigger', 'auto', 320], description: 'Menu width: match the `trigger`, size to content (`auto`), or a fixed px', table: { category: 'Layout' } },
    twoLine: { control: 'boolean', name: 'title + subtitle', description: 'Render each option as a two-line title + `subtitle`', table: { category: 'Content' } },
    withIcons: { control: 'boolean', name: 'item icons', description: 'Show each option\'s leading icon', table: { category: 'Content' } },
    iconVariant: { control: 'select', options: ICON_VARIANTS, name: 'icon style', description: 'Icon style applied to the per-item icons and footer CTA icons', table: { category: 'Icons' } },
    label: { control: 'text', description: 'Field label above the trigger', table: { category: 'Content' } },
    placeholder: { control: 'text', description: 'Trigger text shown when nothing is selected', table: { category: 'Content' } },
    disabled: { control: 'boolean', description: 'Disable the trigger', table: { category: 'State' } },
    value: { control: false },
    onChange: { control: false },
  },
  args: {
    mode: 'single',
    optionControl: 'none',
    chips: false,
    searchable: false,
    searchPlaceholder: 'Search…',
    clearable: false,
    loading: false,
    emptyLabel: 'No matches',
    placement: 'auto',
    showShortcuts: false,
    footerHint: false,
    withActions: false,
    actionsAlign: 'right',
    ...ctaArgs('primary', { variant: 'solid', label: 'Apply', withIcon: true, iconName: 'tick-circle' }),
    ...ctaArgs('secondary', { variant: 'outline', label: 'Clear' }),
    ...ctaArgs('tertiary', { variant: 'none', label: 'Reset' }),
    width: 'trigger',
    twoLine: true,
    withIcons: true,
    iconVariant: 'linear',
    label: 'Department',
    placeholder: 'Select department…',
    disabled: false,
  },
};

export default meta;

const Frame = ({ w = 300, children }) => <div style={{ width: w }}>{children}</div>;

// Build an accurate, copy-paste Dropdown snippet from the Playground controls
// (what "Show code" displays). Only non-default props are emitted.
function dropdownCode(a) {
  const lines = [];
  if (a.mode && a.mode !== 'single') lines.push(`  mode="${a.mode}"`);
  if (a.optionControl && a.optionControl !== 'none') lines.push(`  optionControl="${a.optionControl}"`);
  if (a.chips) lines.push('  chips');
  if (a.searchable) lines.push('  searchable');
  if (a.searchPlaceholder && a.searchPlaceholder !== 'Search…') lines.push(`  searchPlaceholder="${a.searchPlaceholder}"`);
  if (a.clearable) lines.push('  clearable');
  if (a.loading) lines.push('  loading');
  if (a.emptyLabel && a.emptyLabel !== 'No matches') lines.push(`  emptyLabel="${a.emptyLabel}"`);
  if (a.placement && a.placement !== 'auto') lines.push(`  placement="${a.placement}"`);
  if (a.showShortcuts) lines.push('  showShortcuts');
  if (a.footerHint) lines.push('  footerHint');
  if (a.actionsAlign && a.actionsAlign !== 'right' && a.withActions) lines.push(`  actionsAlign="${a.actionsAlign}"`);
  if (a.width && a.width !== 'trigger') lines.push(typeof a.width === 'number' ? `  width={${a.width}}` : `  width="${a.width}"`);
  if (a.label) lines.push(`  label="${a.label}"`);
  if (a.placeholder && a.placeholder !== 'Select…') lines.push(`  placeholder="${a.placeholder}"`);
  if (a.disabled) lines.push('  disabled');
  return `<Dropdown\n  options={options}\n  value={value}\n  onChange={setValue}\n${lines.join('\n')}${lines.length ? '\n' : ''}/>`;
}

// ── Playground — every capability wired to Controls ───────────────────────────
export const Playground = {
  render: ({ mode, twoLine, withIcons, withActions, iconVariant, ...args }) => {
    const [val, setVal] = React.useState(mode === 'multi' ? [] : '');
    const value = mode === 'multi' ? (Array.isArray(val) ? val : []) : (Array.isArray(val) ? '' : val);
    const options = DEPTS.map((o) => ({
      ...o,
      subtitle: twoLine ? o.subtitle : undefined,
      // Re-resolve each item's icon in the chosen style so the picker previews variants.
      icon: withIcons ? ic('user', iconVariant) : undefined,
    }));
    return (
      <Frame>
        <Dropdown
          {...args}
          mode={mode}
          options={options}
          value={value}
          onChange={setVal}
          primaryAction={withActions ? actionFromArgs({ ...args, iconVariant }, 'primary', () => {}) : undefined}
          secondaryAction={withActions ? actionFromArgs({ ...args, iconVariant }, 'secondary', () => setVal(mode === 'multi' ? [] : '')) : undefined}
          tertiaryAction={withActions ? actionFromArgs({ ...args, iconVariant }, 'tertiary', () => setVal(mode === 'multi' ? [] : '')) : undefined}
        />
      </Frame>
    );
  },
  parameters: { docs: { source: { transform: (_code, ctx) => dropdownCode(ctx.args) } } },
};

export const SingleSelect = {
  render: () => {
    const [v, setV] = React.useState('cardio');
    return <Frame><Dropdown label="Department" options={DEPTS} value={v} onChange={setV} /></Frame>;
  },
};

/** Uncontrolled — `defaultValue` only, no `value`/`onChange`. The Dropdown
 *  manages its own selection (Radix-style controlled/uncontrolled parity). */
export const Uncontrolled = {
  render: () => (
    <Frame><Dropdown label="Department (uncontrolled)" options={DEPTS} defaultValue="cardio" /></Frame>
  ),
};

export const MultiSelect = {
  name: 'Multi-select (checkmarks)',
  render: () => {
    const [v, setV] = React.useState(['cardio', 'neuro']);
    return <Frame><Dropdown label="Departments" mode="multi" options={DEPTS} value={v} onChange={setV} /></Frame>;
  },
};

export const CheckboxOptions = {
  name: 'Multi + checkboxes',
  render: () => {
    const [v, setV] = React.useState(['active', 'waiting']);
    return <Frame><Dropdown label="Status" mode="multi" optionControl="checkbox" options={SIMPLE} value={v} onChange={setV} /></Frame>;
  },
};

export const RadioOptions = {
  name: 'Single + radio',
  render: () => {
    const [v, setV] = React.useState('active');
    return <Frame><Dropdown label="Status" optionControl="radio" options={SIMPLE} value={v} onChange={setV} /></Frame>;
  },
};

export const ChipsInTrigger = {
  name: 'Multi → chips in trigger',
  render: () => {
    const [v, setV] = React.useState(['cardio', 'ortho', 'radio']);
    return <Frame w={360}><Dropdown label="Departments" mode="multi" chips optionControl="checkbox" options={DEPTS} value={v} onChange={setV} /></Frame>;
  },
};

export const Searchable = {
  render: () => {
    const [v, setV] = React.useState('');
    return <Frame><Dropdown label="Department" searchable options={DEPTS} value={v} onChange={setV} placeholder="Search & select…" /></Frame>;
  },
};

export const WithShortcuts = {
  name: 'Keyboard shortcuts',
  render: () => {
    const [v, setV] = React.useState('cardio');
    return <Frame><Dropdown label="Quick jump" showShortcuts options={DEPTS} value={v} onChange={setV} /></Frame>;
  },
};

export const TwoLineItems = {
  name: 'Title + subtitle',
  render: () => {
    const [v, setV] = React.useState('neuro');
    return <Frame><Dropdown label="Assign to" options={DEPTS} value={v} onChange={setV} /></Frame>;
  },
};

export const ItemIcons = {
  name: 'Left + right item icons',
  render: () => {
    const [v, setV] = React.useState('verified');
    const opts = [
      { value: 'verified', label: 'Verified', icon: ic('user'), iconRight: ic('tick-circle') },
      { value: 'pending', label: 'Pending review', icon: ic('user'), iconRight: ic('clock') },
      { value: 'flagged', label: 'Flagged', icon: ic('user'), iconRight: ic('flag') },
    ];
    return <Frame><Dropdown label="Record state" options={opts} value={v} onChange={setV} /></Frame>;
  },
};

export const FooterShortcutsAndActions = {
  name: 'Footer: shortcut bar + CTAs',
  render: () => {
    const [v, setV] = React.useState(['cardio']);
    return (
      <Frame w={320}>
        <Dropdown
          label="Assign departments"
          mode="multi"
          optionControl="checkbox"
          options={DEPTS}
          value={v}
          onChange={setV}
          footerHint
          primaryAction={{ label: 'Apply', onClick: () => {} }}
          secondaryAction={{ label: 'Clear', onClick: () => setV([]) }}
        />
      </Frame>
    );
  },
};

// ── Three footer CTAs — primary · secondary · tertiary, each with an icon ──────
export const ThreeFooterCtas = {
  name: 'Footer: three CTAs (primary · secondary · tertiary)',
  render: () => {
    const [v, setV] = React.useState(['cardio']);
    return (
      <Frame w={340}>
        <Dropdown
          label="Assign departments"
          mode="multi"
          optionControl="checkbox"
          options={DEPTS}
          value={v}
          onChange={setV}
          tertiaryAction={{ label: 'Reset', variant: 'link', icon: ic('refresh'), onClick: () => setV([]) }}
          secondaryAction={{ label: 'Clear', icon: ic('close-circle'), onClick: () => setV([]) }}
          primaryAction={{ label: 'Apply', icon: ic('tick-circle'), onClick: () => {} }}
        />
      </Frame>
    );
  },
};

export const FooterCtaAlignment = {
  name: 'Footer: CTA alignment',
  render: () => {
    const aligns = ['left', 'center', 'right', 'full'];
    return (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {aligns.map((a) => (
          <Frame key={a} w={260}>
            <Dropdown
              label={`align: ${a}`}
              mode="multi"
              optionControl="checkbox"
              options={DEPTS}
              value={['cardio']}
              onChange={() => {}}
              actionsAlign={a}
              primaryAction={{ label: 'Apply', onClick: () => {} }}
              secondaryAction={{ label: 'Clear', onClick: () => {} }}
            />
          </Frame>
        ))}
      </div>
    );
  },
};

/** Grouped sections — pass `options` as `[{ heading, options:[…] }]`. Each
 *  section renders its own heading; search filters within sections and hides any
 *  that empty out; keyboard nav flows across all sections. */
export const GroupedSections = {
  name: 'Sections with headings',
  render: () => {
    const [v, setV] = React.useState('chest-pain');
    const grouped = [
      { heading: 'Frequently used', options: [
        { value: 'chest-pain', label: 'Chest pain' },
        { value: 'fever', label: 'Fever' },
        { value: 'cough', label: 'Cough' },
      ] },
      { heading: 'Respiratory', options: [
        { value: 'breathless', label: 'Shortness of breath' },
        { value: 'wheeze', label: 'Wheezing' },
      ] },
      { heading: 'Cardiac', options: [
        { value: 'palpitations', label: 'Palpitations' },
        { value: 'syncope', label: 'Syncope' },
      ] },
    ];
    return <Frame><Dropdown label="Symptom" searchable options={grouped} value={v} onChange={setV} placeholder="Search symptoms…" /></Frame>;
  },
};

/** Editable combobox — the trigger itself is a typeahead input. With
 *  `allowCustom` it offers "Add ‹query›"; `groupLabel` adds a single header. Used
 *  inside ClinicalTable search cells (with `variant="seamless"`, `chevron={false}`). */
export const EditableCombobox = {
  name: 'Editable combobox (+ add custom)',
  render: () => {
    const [v, setV] = React.useState('');
    const opts = ['Fever', 'Cough', 'Chest pain', 'Headache', 'Fatigue', 'Nausea'];
    return <Frame><Dropdown label="Symptom" editable allowCustom chevron={false} groupLabel="Frequently used" footerHint="keys" options={opts.map((o) => ({ value: o, label: o }))} value={v} onChange={setV} placeholder="Search & add…" /></Frame>;
  },
};

/** Clearable single-select — a small × in the trigger resets the value without
 *  opening the menu. Only shown when a value is selected (single mode). */
export const Clearable = {
  name: 'Clearable (single-select)',
  render: () => {
    const [v, setV] = React.useState('cardio');
    return <Frame><Dropdown label="Department" clearable options={DEPTS} value={v} onChange={setV} /></Frame>;
  },
};

/** Placement — force the menu above ("top") or below ("bottom") the trigger, or
 *  let it flip automatically ("auto", the default). */
export const Placement = {
  name: 'Placement (auto · bottom · top)',
  render: () => {
    const [a, setA] = React.useState('cardio');
    const [b, setB] = React.useState('cardio');
    const [c, setC] = React.useState('cardio');
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Frame w={200}><Dropdown label='placement="auto"' options={DEPTS} value={a} onChange={setA} /></Frame>
        <Frame w={200}><Dropdown label='placement="bottom"' placement="bottom" options={DEPTS} value={b} onChange={setB} /></Frame>
        <Frame w={200}><Dropdown label='placement="top"' placement="top" options={DEPTS} value={c} onChange={setC} /></Frame>
      </div>
    );
  },
};

/** Custom option rows via `renderOption(option, { selected, active })` — here an
 *  avatar + two-line name/role layout that replaces the default row entirely. */
export const CustomOptionRows = {
  name: 'renderOption — avatar rows',
  render: () => {
    const [v, setV] = React.useState('cardio');
    const Avatar = ({ label, on }) => (
      <span style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
        background: on ? 'var(--tesseract-blue-100)' : 'var(--tesseract-slate-100)',
        color: on ? 'var(--tesseract-blue-700)' : 'var(--tesseract-slate-500)',
      }}>{label.replace('Dr. ', '').split(' ').map((s) => s[0]).join('').slice(0, 2)}</span>
    );
    return (
      <Frame w={320}>
        <Dropdown
          label="Assign to"
          options={DEPTS}
          value={v}
          onChange={setV}
          renderOption={(opt, { selected }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              <Avatar label={opt.subtitle || opt.label} on={selected} />
              <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: selected ? 700 : 500, color: 'var(--tesseract-slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.subtitle || opt.label}</span>
                <span style={{ fontSize: 11, color: 'var(--tesseract-slate-400)' }}>{opt.label}</span>
              </span>
            </div>
          )}
        />
      </Frame>
    );
  },
};

/** Async loading — `loading` shows a spinner row while options fetch, then the
 *  list renders. (Toggle the button to simulate a refetch.) */
export const AsyncLoading = {
  name: 'loading — async option fetch',
  render: () => {
    const [v, setV] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [opts, setOpts] = React.useState([]);
    React.useEffect(() => {
      if (!loading) return undefined;
      const t = setTimeout(() => { setOpts(DEPTS); setLoading(false); }, 1200);
      return () => clearTimeout(t);
    }, [loading]);
    return (
      <Frame>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Dropdown label="Department" searchable loading={loading} options={opts} value={v} onChange={setV} placeholder="Search & select…" />
          <button type="button" onClick={() => { setOpts([]); setLoading(true); }} style={{ alignSelf: 'flex-start', fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--tesseract-slate-200)', background: 'var(--tesseract-slate-0)', cursor: 'pointer' }}>Refetch</button>
        </div>
      </Frame>
    );
  },
};

export const Widths = {
  name: 'Adjustable width',
  render: () => {
    const [a, setA] = React.useState('cardio');
    const [b, setB] = React.useState('cardio');
    const [c, setC] = React.useState('cardio');
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Frame w={200}><Dropdown label='width="trigger"' options={DEPTS} value={a} onChange={setA} /></Frame>
        <Frame w={200}><Dropdown label='width="auto"' width="auto" options={DEPTS} value={b} onChange={setB} /></Frame>
        <Frame w={200}><Dropdown label="width={360}" width={360} options={DEPTS} value={c} onChange={setC} /></Frame>
      </div>
    );
  },
};
