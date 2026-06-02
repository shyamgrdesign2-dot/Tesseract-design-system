/**
 * TPInput — comprehensive, configurable input. Every capability is a control:
 * size · status (default/success/error/warning) · allow filter (numeric/alpha/
 * alphanumeric) · icon side (left/right/both) · clearable · loading · unit ·
 * counter (+/-) · character count · left/right add-ons (dropdown · CTA · text).
 * TP icons + TP tokens only, zero dependencies.
 */

import React from 'react';
import { TPInput } from './TPInput';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const SIZES = ['sm', 'md', 'lg'];
const STATUSES = ['default', 'success', 'error', 'warning'];
const ALLOW = ['any', 'numeric', 'alpha', 'alphanumeric'];
const ICON_SIDES = ['none', 'left', 'right', 'both'];
const ICON_PX = { sm: 16, md: 18, lg: 20 };

// Icon node from a library name ('' = none).
const icon = (name, size) =>
  name && String(name).trim() ? <TPLibraryIcon name={String(name).trim()} size={size} /> : undefined;

// ── World-class add-on building blocks ────────────────────────────────────────
// Each owns its own background + balanced padding so it sits flush against the
// divider — no native <select> chrome, no lopsided spacing.

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SelectAddon = ({ ariaLabel, options }) => (
  <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', height: '100%' }}>
    <select
      aria-label={ariaLabel}
      style={{
        appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
        height: '100%', padding: '0 32px 0 12px', margin: 0, border: 'none', outline: 'none',
        background: 'var(--tp-slate-50, #FAFAFB)', color: 'var(--tp-slate-700, #454551)',
        fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
      }}
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <span style={{ position: 'absolute', right: 11, pointerEvents: 'none', display: 'inline-flex', color: 'var(--tp-slate-500, #717179)' }}>
      <Chevron />
    </span>
  </span>
);

const TextAddon = ({ children }) => (
  <span style={{ padding: '0 12px', background: 'var(--tp-slate-50, #FAFAFB)', color: 'var(--tp-slate-600, #545460)', fontSize: 14, whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

const CtaAddon = ({ label, variant = 'solid', iconName }) => (
  <button
    type="button"
    style={{
      height: '100%', padding: '0 16px', border: 'none', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
      fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
      background: variant === 'solid' ? 'var(--tp-blue-500, #4B4AD5)' : 'var(--tp-slate-50, #FAFAFB)',
      color: variant === 'solid' ? '#fff' : 'var(--tp-slate-700, #454551)',
    }}
  >
    {iconName && <TPLibraryIcon name={iconName} size={16} />}
    {label}
  </button>
);

const CountryAddon = () => <SelectAddon ariaLabel="Country code" options={['🇮🇳 +91', '🇺🇸 +1', '🇬🇧 +44', '🇦🇪 +971']} />;
const UnitDropdown = () => <SelectAddon ariaLabel="Unit" options={['kg', 'lb', 'g']} />;

const leftAddonNode = (kind) => {
  if (kind === 'country') return <CountryAddon />;
  if (kind === 'prefix') return <TextAddon>https://</TextAddon>;
  if (kind === 'cta') return <CtaAddon label="Browse" variant="ghost" iconName="document-upload" />;
  return undefined;
};
const rightAddonNode = (kind) => {
  if (kind === 'dropdown') return <UnitDropdown />;
  if (kind === 'cta') return <CtaAddon label="Search" iconName="search-normal" />;
  if (kind === 'text') return <TextAddon>/month</TextAddon>;
  return undefined;
};

export default {
  title: 'Atoms/TPInput',
  component: TPInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label:       { control: 'text', table: { category: 'Content' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    helperText:  { control: 'text', table: { category: 'Content' } },
    required:    { control: 'boolean', table: { category: 'Content' } },

    size:        { control: 'inline-radio', options: SIZES, table: { category: 'Appearance' } },
    status:      { control: 'inline-radio', options: STATUSES, table: { category: 'Appearance' } },
    fullWidth:   { control: 'boolean', table: { category: 'Appearance' } },

    allow:       { control: 'inline-radio', options: ALLOW, name: 'allow (filter)', description: 'Restrict typed characters', table: { category: 'Behaviour' } },
    clearable:   { control: 'boolean', name: 'clearable (×)', table: { category: 'Behaviour' } },
    loading:     { control: 'boolean', table: { category: 'Behaviour' } },
    readOnly:    { control: 'boolean', name: 'read only', table: { category: 'Behaviour' } },
    disabled:    { control: 'boolean', table: { category: 'Behaviour' } },
    maxLength:   { control: { type: 'number', min: 0 }, name: 'max length', table: { category: 'Behaviour' } },
    showCount:   { control: 'boolean', name: 'show count', table: { category: 'Behaviour' } },

    iconSide:     { control: 'inline-radio', options: ICON_SIDES, name: 'icon side', table: { category: 'Icons' } },
    leftIconName: { control: 'text', tpIcon: true, name: 'left icon', table: { category: 'Icons' } },
    rightIconName:{ control: 'text', tpIcon: true, name: 'right icon', table: { category: 'Icons' } },

    unit:        { control: 'text', description: 'Fixed suffix inside the field, e.g. "kg"', table: { category: 'Affixes' } },
    counter:     { control: 'boolean', description: '+/- stepper (number field)', table: { category: 'Affixes' } },
    leftAddon:   { control: 'select', options: ['none', 'country', 'prefix', 'cta'], name: 'left add-on', table: { category: 'Affixes' } },
    rightAddon:  { control: 'select', options: ['none', 'dropdown', 'cta', 'text'], name: 'right add-on', table: { category: 'Affixes' } },

    leftIcon: { table: { disable: true } },
    rightIcon: { table: { disable: true } },
  },
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    helperText: 'We’ll never share it.',
    required: false,
    size: 'md',
    status: 'default',
    fullWidth: true,
    allow: 'any',
    clearable: true,
    loading: false,
    readOnly: false,
    disabled: false,
    maxLength: 0,
    showCount: false,
    iconSide: 'left',
    leftIconName: 'sms',
    rightIconName: 'eye-slash',
    unit: '',
    counter: false,
    leftAddon: 'none',
    rightAddon: 'none',
  },
};

// ── Playground — every capability wired to Controls ───────────────────────────
export const Playground = {
  render: (a) => {
    const px = ICON_PX[a.size] || 18;
    const showLeft = a.iconSide === 'left' || a.iconSide === 'both';
    const showRight = a.iconSide === 'right' || a.iconSide === 'both';
    return (
      <div style={{ maxWidth: 440 }}>
        <TPInput
          size={a.size}
          status={a.status}
          allow={a.allow}
          label={a.label}
          placeholder={a.placeholder}
          helperText={a.helperText}
          required={a.required}
          fullWidth={a.fullWidth}
          clearable={a.clearable}
          loading={a.loading}
          readOnly={a.readOnly}
          disabled={a.disabled}
          maxLength={a.maxLength || undefined}
          showCount={a.showCount}
          leftIcon={showLeft ? icon(a.leftIconName, px) : undefined}
          rightIcon={showRight ? icon(a.rightIconName, px) : undefined}
          unit={a.unit || undefined}
          counter={a.counter}
          type={a.counter ? 'number' : undefined}
          defaultValue={a.counter ? 1 : undefined}
          leftAddon={leftAddonNode(a.leftAddon)}
          rightAddon={rightAddonNode(a.rightAddon)}
        />
      </div>
    );
  },
};

const Stack = ({ children, w = 380 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: w }}>{children}</div>
);

// ── Sizes ──────────────────────────────────────────────────────────────────────
export const Sizes = {
  render: () => (
    <Stack>
      {SIZES.map((s) => (
        <TPInput key={s} size={s} label={`Size ${s}`} placeholder={`${s} input`} leftIcon={<TPLibraryIcon name="search-normal" size={ICON_PX[s]} />} fullWidth />
      ))}
    </Stack>
  ),
};

// ── Status states (default · success · error · warning · loading) ─────────────
export const Statuses = {
  render: () => (
    <Stack>
      <TPInput label="Default" placeholder="Placeholder…" leftIcon={<TPLibraryIcon name="sms" size={18} />} helperText="Helper text" fullWidth />
      <TPInput label="Success" status="success" defaultValue="john@example.com" helperText="Email verified" fullWidth />
      <TPInput label="Warning" status="warning" defaultValue="admin@example" helperText="Double-check this address" fullWidth />
      <TPInput label="Error" status="error" defaultValue="invalid@@email" helperText="Enter a valid email address" fullWidth />
      <TPInput label="Loading" loading defaultValue="Checking availability…" leftIcon={<TPLibraryIcon name="user" size={18} />} fullWidth />
      <TPInput label="Disabled" disabled defaultValue="Not editable" fullWidth />
    </Stack>
  ),
};

// ── Allowed input types (numeric · alpha · alphanumeric) ──────────────────────
export const AllowedTypes = {
  name: 'Allowed Types (filtering)',
  render: () => (
    <Stack>
      <TPInput label="Numbers only" allow="numeric" placeholder="98765 43210" helperText="Strips anything that isn’t a digit" leftIcon={<TPLibraryIcon name="call" size={18} />} fullWidth />
      <TPInput label="Letters only" allow="alpha" placeholder="Ananya Sharma" helperText="Strips digits & symbols" leftIcon={<TPLibraryIcon name="user" size={18} />} fullWidth />
      <TPInput label="Alphanumeric" allow="alphanumeric" placeholder="AB12CD34" helperText="Letters + numbers, no symbols" leftIcon={<TPLibraryIcon name="card" size={18} />} fullWidth />
      <TPInput label="Anything (default)" allow="any" placeholder="Type anything…" fullWidth />
    </Stack>
  ),
};

// ── Icon placement (none · left · right · both) + clearable ───────────────────
export const Icons = {
  render: () => (
    <Stack>
      <TPInput label="Left icon" placeholder="Search patients…" leftIcon={<TPLibraryIcon name="search-normal" size={18} />} fullWidth />
      <TPInput label="Right icon" placeholder="Pick a date" rightIcon={<TPLibraryIcon name="calendar-1" size={18} />} fullWidth />
      <TPInput label="Both icons" type="password" defaultValue="secret123" leftIcon={<TPLibraryIcon name="lock" size={18} />} rightIcon={<TPLibraryIcon name="eye-slash" size={18} />} fullWidth />
      <TPInput label="Clearable" clearable defaultValue="Clear me" leftIcon={<TPLibraryIcon name="edit-2" size={18} />} fullWidth />
    </Stack>
  ),
};

// ── Character counter ──────────────────────────────────────────────────────────
export const CharacterCount = {
  render: () => (
    <Stack>
      <TPInput label="Bio" placeholder="Tell us about yourself" maxLength={80} showCount defaultValue="Cardiologist, 12 years" fullWidth />
      <TPInput label="Username" allow="alphanumeric" maxLength={20} showCount defaultValue="dr_ananya" fullWidth helperText="Letters & numbers only" />
    </Stack>
  ),
};

// ── Unit · counter · dropdown add-ons ─────────────────────────────────────────
export const AffixesAndAddons = {
  name: 'Affixes & Add-ons',
  render: () => (
    <Stack>
      <TPInput label="Unit suffix" type="number" defaultValue={72} unit="kg" fullWidth />
      <TPInput label="Counter (stepper)" type="number" defaultValue={1} counter fullWidth />
      <TPInput label="Left dropdown add-on" placeholder="98765 43210" allow="numeric" leftAddon={<CountryAddon />} fullWidth />
      <TPInput label="Right dropdown add-on" type="number" defaultValue={72} rightAddon={<UnitDropdown />} fullWidth />
      <TPInput label="Prefix add-on" placeholder="your-site" leftAddon={<TextAddon>https://</TextAddon>} rightAddon={<TextAddon>.com</TextAddon>} fullWidth />
    </Stack>
  ),
};

// ── Add-ons as CTAs ────────────────────────────────────────────────────────────
export const AddonsAsCTAs = {
  name: 'Add-ons as CTAs',
  render: () => (
    <Stack w={440}>
      <TPInput label="Search with CTA" placeholder="Search patients, doctors…" leftIcon={<TPLibraryIcon name="search-normal" size={18} />} rightAddon={<CtaAddon label="Search" iconName="search-normal" />} fullWidth />
      <TPInput label="Newsletter" placeholder="you@example.com" leftIcon={<TPLibraryIcon name="sms" size={18} />} rightAddon={<CtaAddon label="Subscribe" />} fullWidth />
      <TPInput label="Upload path" placeholder="No file selected" leftAddon={<CtaAddon label="Browse" variant="ghost" iconName="document-upload" />} fullWidth />
      <TPInput label="Both-side CTAs" placeholder="0.00" leftAddon={<CtaAddon label="$" variant="ghost" />} rightAddon={<CtaAddon label="Convert" />} fullWidth />
    </Stack>
  ),
};
