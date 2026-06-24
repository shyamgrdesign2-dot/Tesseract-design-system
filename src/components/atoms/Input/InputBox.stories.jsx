/**
 * InputBox — comprehensive, configurable input. Every capability is a control:
 * size · status (default/success/error/warning) · allow filter (numeric/alpha/
 * alphanumeric) · icon side (left/right/both) · clearable · loading · unit ·
 * counter (+/-) · character count · left/right add-ons (dropdown · CTA · text).
 * Tesseract icons + Tesseract tokens only, zero dependencies.
 */

import React from 'react';
import { InputBox } from './InputBox';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';
import { Button } from '@/src/components/atoms/Button';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

const SIZES = ['sm', 'md', 'lg'];
const STATUSES = ['default', 'success', 'error', 'warning'];
const ALLOW = ['any', 'numeric', 'alpha', 'alphanumeric'];
const ICON_PX = { sm: 16, md: 18, lg: 20 };
const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];

// Resolve an icon node for a slot, sized to the field, in the chosen style + family.
const glyphFor = (name, size, variant = 'linear', family) =>
  name && String(name).trim()
    ? <TPIcon name={String(name).trim()} variant={variant} family={family || undefined} size={size} />
    : undefined;

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
        background: 'var(--tesseract-slate-50, #FAFAFB)', color: 'var(--tesseract-slate-700, #454551)',
        fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
      }}
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <span style={{ position: 'absolute', right: 11, pointerEvents: 'none', display: 'inline-flex', color: 'var(--tesseract-slate-500, #717179)' }}>
      <Chevron />
    </span>
  </span>
);

const TextAddon = ({ children }) => (
  <span style={{ padding: '0 12px', background: 'var(--tesseract-slate-50, #FAFAFB)', color: 'var(--tesseract-slate-600, #545460)', fontSize: 14, whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

// CTA add-on — neutral on both sides (matches the prefix/dropdown add-ons), so
// the field reads as one cohesive control rather than a coloured button bolted on.
const CtaAddon = ({ label, iconName }) => (
  <button
    type="button"
    style={{
      height: '100%', padding: '0 16px', border: 'none', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
      fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
      background: 'var(--tesseract-slate-50, #FAFAFB)',
      color: 'var(--tesseract-slate-700, #454551)',
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
  title: 'Atoms/InputBox',
  component: InputBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A single text field that absorbs every common input capability — icons, status, filtering, affixes, add-ons, tags — so one component covers them all.',
          '',
          '**When to use** — any text or number entry: search, email, phone, amounts. Compose `leftAddon` / `rightAddon` (dropdown · CTA · text) or `action` (an in-field Button) for prefixed, suffixed, or actioned fields.',
          '**When not** — for a one-of-many choice use **Radio**; for an on/off setting use **Toggle**.',
          '',
          '**Key props** — `label` + `helperText`, `size`, `status` (default · success · error · warning), `allow` (filter to numeric / alpha / alphanumeric), `clearable`, `leftIcon` / `rightIcon`, `leftAddon` / `rightAddon`, `action`.',
          '',
          '**Good to know** — `allow` strips disallowed characters as the user types (not just on submit). `status` auto-shows a glyph (success→tick-circle · error→danger · warning→warning); override with `statusIcon`. `autoGrow` + `maxHeight` turns it into a textarea that grows then scrolls.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    showLabel:   { control: 'boolean', name: 'show label', table: { category: 'Content' } },
    label:       { control: 'text', description: 'Field label', table: { category: 'Content' } },
    showHelper:  { control: 'boolean', name: 'show helper text', table: { category: 'Content' } },
    helperText:  { control: 'text', description: 'Helper / error text below the field', table: { category: 'Content' } },
    placeholder: { control: 'text', description: 'Placeholder shown when empty', table: { category: 'Content' } },
    required:    { control: 'boolean', table: { category: 'Content' } },

    size:        { control: 'inline-radio', options: SIZES, description: 'sm · md · lg', table: { category: 'Appearance' } },
    status:      { control: 'inline-radio', options: STATUSES, description: 'Validation state — default · success · error · warning (drives border + status glyph)', table: { category: 'Appearance' } },
    fullWidth:   { control: 'boolean', table: { category: 'Appearance' } },
    radius:      { control: 'text', name: 'radius', description: 'Field corner radius — a number (px), "pill", "sharp", or any CSS length / token. Blank = default 10px.', table: { category: 'Appearance' } },

    allow:       { control: 'inline-radio', options: ALLOW, name: 'allow (filter)', description: 'Restrict typed characters', table: { category: 'Behaviour' } },
    clearable:   { control: 'boolean', name: 'clearable (×)', table: { category: 'Behaviour' } },
    loading:     { control: 'boolean', table: { category: 'Behaviour' } },
    readOnly:    { control: 'boolean', name: 'read only', table: { category: 'Behaviour' } },
    disabled:    { control: 'boolean', table: { category: 'Behaviour' } },
    maxLength:   { control: { type: 'number', min: 0 }, name: 'max length', table: { category: 'Behaviour' } },
    showCount:   { control: 'boolean', name: 'show count', table: { category: 'Behaviour' } },

    leftIcon:     { control: 'text', tpIcon: true, name: 'left icon', description: 'CDN icon name for the leading slot (blank = none)', table: { category: 'Icons' } },
    rightIcon:    { control: 'text', tpIcon: true, name: 'right icon', description: 'CDN icon name for the trailing slot (blank = none)', table: { category: 'Icons' } },
    iconVariant:  { control: 'select', options: ICON_VARIANTS, name: 'icon style', description: 'Icon style applied to both slots', table: { category: 'Icons' } },
    iconFamily:   { control: 'text', name: 'icon family', description: 'Override the auto-resolved CDN family (blank = auto)', table: { category: 'Icons' } },
    statusIcon:   { control: 'text', tpIcon: true, name: 'status icon', description: 'Override the auto status glyph — a CDN icon name (blank = auto: success→tick-circle · error→danger · warning→warning). Only shows when status ≠ default.', if: { arg: 'status', neq: 'default' }, table: { category: 'Icons' } },

    unit:        { control: 'text', description: 'Fixed suffix inside the field, e.g. "kg"', table: { category: 'Affixes' } },
    counter:     { control: 'boolean', description: '+/- stepper (number field)', table: { category: 'Affixes' } },
    leftAddon:   { control: 'select', options: ['none', 'country', 'prefix', 'cta'], name: 'left add-on', table: { category: 'Affixes' } },
    rightAddon:  { control: 'select', options: ['none', 'dropdown', 'cta', 'text'], name: 'right add-on', table: { category: 'Affixes' } },
  },
  args: {
    showLabel: true,
    label: 'Email address',
    showHelper: true,
    placeholder: 'you@example.com',
    helperText: 'We’ll never share it.',
    required: false,
    size: 'md',
    status: 'default',
    fullWidth: true,
    radius: '',
    allow: 'any',
    clearable: true,
    loading: false,
    readOnly: false,
    disabled: false,
    maxLength: 0,
    showCount: false,
    leftIcon: 'sms',
    rightIcon: '',
    iconVariant: 'linear',
    iconFamily: '',
    statusIcon: '',
    unit: '',
    counter: false,
    leftAddon: 'none',
    rightAddon: 'none',
  },
};

// A radius control comes in as a string. Coerce a pure-number string to a
// number (so InputBox emits `${n}px`); pass keywords / lengths / tokens through;
// blank → undefined (keep the default token radius).
const radiusValue = (r) => {
  if (r == null || String(r).trim() === '') return undefined;
  const s = String(r).trim();
  return /^\d+$/.test(s) ? Number(s) : s;
};

// Build an accurate, copy-paste code snippet from the controls (what "Show code" shows).
const iconJsx = (name, variant, family, size) =>
  `<TPIcon name="${name}"${variant && variant !== 'linear' ? ` variant="${variant}"` : ''}${family ? ` family="${family}"` : ''} size={${size}} />`;

const inputCode = (a) => {
  const px = ICON_PX[a.size] || 18;
  const lines = [`  size="${a.size}"`, `  status="${a.status}"`];
  if (a.showLabel && a.label) lines.push(`  label="${a.label}"`);
  if (a.placeholder) lines.push(`  placeholder="${a.placeholder}"`);
  if (a.showHelper && a.helperText) lines.push(`  helperText="${a.helperText}"`);
  if (a.required) lines.push('  required');
  if (a.allow && a.allow !== 'any') lines.push(`  allow="${a.allow}"`);
  if (a.clearable) lines.push('  clearable');
  if (a.loading) lines.push('  loading');
  if (a.readOnly) lines.push('  readOnly');
  if (a.disabled) lines.push('  disabled');
  if (a.maxLength) lines.push(`  maxLength={${a.maxLength}}`);
  if (a.showCount) lines.push('  showCount');
  if (a.leftIcon && a.leftIcon.trim()) lines.push(`  leftIcon={${iconJsx(a.leftIcon.trim(), a.iconVariant, a.iconFamily, px)}}`);
  if (a.rightIcon && a.rightIcon.trim()) lines.push(`  rightIcon={${iconJsx(a.rightIcon.trim(), a.iconVariant, a.iconFamily, px)}}`);
  if (a.status !== 'default' && a.statusIcon && a.statusIcon.trim()) lines.push(`  statusIcon="${a.statusIcon.trim()}"`);
  if (a.unit) lines.push(`  unit="${a.unit}"`);
  if (a.counter) lines.push('  counter');
  const rv = radiusValue(a.radius);
  if (rv != null) lines.push(typeof rv === 'number' ? `  radius={${rv}}` : `  radius="${rv}"`);
  if (a.fullWidth) lines.push('  fullWidth');
  return `<InputBox\n${lines.join('\n')}\n/>`;
};

// ── Playground — every capability wired to Controls ───────────────────────────
export const Playground = {
  args: {
    required: true,
    clearable: false,
    maxLength: 24
  },
  render:(a) => {
    const px = ICON_PX[a.size] || 18;
    return (
      <div style={{ maxWidth: 440 }}>
        <InputBox
          size={a.size}
          status={a.status}
          allow={a.allow}
          label={a.showLabel ? a.label : undefined}
          placeholder={a.placeholder}
          helperText={a.showHelper ? a.helperText : undefined}
          required={a.required}
          fullWidth={a.fullWidth}
          clearable={a.clearable}
          loading={a.loading}
          readOnly={a.readOnly}
          disabled={a.disabled}
          radius={radiusValue(a.radius)}
          maxLength={a.maxLength || undefined}
          showCount={a.showCount}
          leftIcon={glyphFor(a.leftIcon, px, a.iconVariant, a.iconFamily)}
          rightIcon={glyphFor(a.rightIcon, px, a.iconVariant, a.iconFamily)}
          statusIcon={a.statusIcon && a.statusIcon.trim() ? a.statusIcon.trim() : undefined}
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
  parameters: { docs: { source: { transform: (_code, ctx) => inputCode(ctx.args) } } },
};

const Stack = ({ children, w = 380 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: w }}>{children}</div>
);

// ── Sizes ──────────────────────────────────────────────────────────────────────
export const Sizes = {
  render: () => (
    <Stack>
      {SIZES.map((s) => (
        <InputBox key={s} size={s} label={`Size ${s}`} placeholder={`${s} input`} leftIcon={<TPLibraryIcon name="search-normal" size={ICON_PX[s]} />} fullWidth />
      ))}
    </Stack>
  ),
};

// ── Status states (default · success · error · warning · loading) ─────────────
export const Statuses = {
  render: () => (
    <Stack>
      <InputBox label="Default" placeholder="Placeholder…" leftIcon={<TPLibraryIcon name="sms" size={18} />} helperText="Helper text" fullWidth />
      <InputBox label="Success" status="success" defaultValue="john@example.com" helperText="Email verified" fullWidth />
      <InputBox label="Warning" status="warning" defaultValue="admin@example" helperText="Double-check this address" fullWidth />
      <InputBox label="Error" status="error" defaultValue="invalid@@email" helperText="Enter a valid email address" fullWidth />
      <InputBox label="Loading" loading defaultValue="Checking availability…" leftIcon={<TPLibraryIcon name="user" size={18} />} fullWidth />
      <InputBox label="Disabled" disabled defaultValue="Not editable" fullWidth />
    </Stack>
  ),
};

// ── Corner radius (default · pill · sharp · custom) ───────────────────────────
export const Radius = {
  name: 'Corner radius',
  render: () => (
    <Stack>
      <InputBox label="Default (10px token)" placeholder="Unchanged corners" fullWidth />
      <InputBox label="Pill" radius="pill" placeholder="Search…" leftIcon={<TPLibraryIcon name="search-normal" size={18} />} fullWidth />
      <InputBox label="Sharp" radius="sharp" placeholder="Square corners" fullWidth />
      <InputBox label="Custom 4px" radius={4} placeholder="Tighter corners" fullWidth />
      <InputBox label="Token" radius="var(--tesseract-radius-16)" placeholder="16px token" fullWidth />
    </Stack>
  ),
};

// ── Status icons (distinct warning glyph · custom override) ────────────────────
export const StatusIcons = {
  name: 'Status icons',
  render: () => (
    <Stack>
      <InputBox label="Success" status="success" defaultValue="john@example.com" helperText="Verified" fullWidth />
      <InputBox label="Warning (distinct glyph)" status="warning" defaultValue="admin@example" helperText="Double-check this" fullWidth />
      <InputBox label="Error" status="error" defaultValue="invalid@@email" helperText="Enter a valid address" fullWidth />
      <InputBox label="Custom status icon (info)" status="warning" statusIcon="info-circle" defaultValue="Heads up" helperText="Override via statusIcon" fullWidth />
      <InputBox label="Custom node" status="success" statusIcon={<TPLibraryIcon name="verify" variant="bold" size={18} />} defaultValue="Approved" fullWidth />
    </Stack>
  ),
};

// ── Allowed input types (numeric · alpha · alphanumeric) ──────────────────────
export const AllowedTypes = {
  name: 'Allowed Types (filtering)',
  render: () => (
    <Stack>
      <InputBox label="Numbers only" allow="numeric" placeholder="98765 43210" helperText="Strips anything that isn’t a digit" leftIcon={<TPLibraryIcon name="call" size={18} />} fullWidth />
      <InputBox label="Letters only" allow="alpha" placeholder="Ananya Sharma" helperText="Strips digits & symbols" leftIcon={<TPLibraryIcon name="user" size={18} />} fullWidth />
      <InputBox label="Alphanumeric" allow="alphanumeric" placeholder="AB12CD34" helperText="Letters + numbers, no symbols" leftIcon={<TPLibraryIcon name="card" size={18} />} fullWidth />
      <InputBox label="Anything (default)" allow="any" placeholder="Type anything…" fullWidth />
    </Stack>
  ),
};

// ── Icon placement (none · left · right · both) + clearable ───────────────────
export const Icons = {
  render: () => (
    <Stack>
      <InputBox label="Left icon" placeholder="Search patients…" leftIcon={<TPLibraryIcon name="search-normal" size={18} />} fullWidth />
      <InputBox label="Right icon" placeholder="Pick a date" rightIcon={<TPLibraryIcon name="calendar-1" size={18} />} fullWidth />
      <InputBox label="Both icons" type="password" defaultValue="secret123" leftIcon={<TPLibraryIcon name="lock" size={18} />} rightIcon={<TPLibraryIcon name="eye-slash" size={18} />} fullWidth />
      <InputBox label="Clearable" clearable defaultValue="Clear me" leftIcon={<TPLibraryIcon name="edit-2" size={18} />} fullWidth />
    </Stack>
  ),
};

// ── Character counter ──────────────────────────────────────────────────────────
export const CharacterCount = {
  render: () => (
    <Stack>
      <InputBox label="Bio" placeholder="Tell us about yourself" maxLength={80} showCount defaultValue="Cardiologist, 12 years" fullWidth />
      <InputBox label="Username" allow="alphanumeric" maxLength={20} showCount defaultValue="dr_ananya" fullWidth helperText="Letters & numbers only" />
    </Stack>
  ),
};

// ── Unit · counter · dropdown add-ons ─────────────────────────────────────────
export const AffixesAndAddons = {
  name: 'Affixes & Add-ons',
  render: () => (
    <Stack>
      <InputBox label="Unit suffix" type="number" defaultValue={72} unit="kg" fullWidth />
      <InputBox label="Counter (stepper)" type="number" defaultValue={1} counter fullWidth />
      <InputBox label="Left dropdown add-on" placeholder="98765 43210" allow="numeric" leftAddon={<CountryAddon />} fullWidth />
      <InputBox label="Right dropdown add-on" type="number" defaultValue={72} rightAddon={<UnitDropdown />} fullWidth />
      <InputBox label="Prefix add-on" placeholder="your-site" leftAddon={<TextAddon>https://</TextAddon>} rightAddon={<TextAddon>.com</TextAddon>} fullWidth />
    </Stack>
  ),
};

// ── Add-ons as CTAs ────────────────────────────────────────────────────────────
export const AddonsAsCTAs = {
  name: 'Add-ons as CTAs',
  render: () => (
    <Stack w={440}>
      <InputBox label="Search with CTA" placeholder="Search patients, doctors…" leftIcon={<TPLibraryIcon name="search-normal" size={18} />} rightAddon={<CtaAddon label="Search" iconName="search-normal" />} fullWidth />
      <InputBox label="Newsletter" placeholder="you@example.com" leftIcon={<TPLibraryIcon name="sms" size={18} />} rightAddon={<CtaAddon label="Subscribe" />} fullWidth />
      <InputBox label="Upload path" placeholder="No file selected" leftAddon={<CtaAddon label="Browse" iconName="document-upload" />} fullWidth />
      <InputBox label="Both-side CTAs" placeholder="0.00" leftAddon={<CtaAddon label="$" />} rightAddon={<CtaAddon label="Convert" />} fullWidth />
    </Stack>
  ),
};

// ── Read-only (neutral, non-interactive) ──────────────────────────────────────
export const ReadOnly = {
  render: () => (
    <Stack>
      <InputBox label="Read-only" readOnly defaultValue="MRN-10231 · Aarav Sharma" leftIcon={<TPLibraryIcon name="user" size={18} />} helperText="Looks disabled; value stays selectable for copy" fullWidth />
      <InputBox label="Disabled (for comparison)" disabled defaultValue="Not editable" fullWidth />
    </Stack>
  ),
};

// ── Tag input — chips inside the field (file uploads, multi-select tokens) ─────
export const TagInput = {
  name: 'Tag Input (chips)',
  render: () => {
    const fileIcon = (name) => <TPLibraryIcon name={name} size={12} />;
    const [files, setFiles] = React.useState([
      { id: 'a', label: 'lab-report.pdf', icon: fileIcon('document-text'), color: 'error' },
      { id: 'b', label: 'scan-front.png', icon: fileIcon('gallery'), color: 'primary' },
      { id: 'c', label: 'scan-back.png', icon: fileIcon('gallery'), color: 'primary' },
    ]);
    const remove = (id) => setFiles((f) => f.filter((x) => x.id !== id));
    const many = Array.from({ length: 8 }, (_, i) => ({ id: i, label: `tag-${i + 1}`, color: 'default' }));
    return (
      <Stack w={460}>
        <InputBox
          label="Attachments (wraps — field grows)"
          tags={files}
          onRemoveTag={remove}
          placeholder={files.length ? 'Add more…' : 'Attach files…'}
          leftIcon={<TPLibraryIcon name="paperclip-2" size={18} />}
          helperText={`${files.length} file${files.length === 1 ? '' : 's'} attached`}
          fullWidth
        />
        <InputBox
          label="Recipients (horizontal scroll)"
          tags={many}
          onRemoveTag={() => {}}
          tagsScroll
          placeholder="Add…"
          fullWidth
        />
        <InputBox label="Read-only tags" tags={files} readOnly fullWidth helperText="No × when read-only" />
      </Stack>
    );
  },
};

// ── In-field CTA — an actual button inside the field (not a bordered add-on) ──
// Composes the Button atom: icon-only (tick/cross), small solid, or link.
export const InFieldCTA = {
  name: 'In-field CTA',
  render: () => (
    <Stack w={440}>
      <InputBox
        label="One-time code"
        placeholder="6-digit code"
        allow="numeric"
        maxLength={6}
        action={<Button size="sm" variant="solid" theme="primary">Verify</Button>}
        fullWidth
      />
      <InputBox
        label="Promo code"
        defaultValue="TATVA20"
        status="success"
        action={<Button size="sm" variant="ghost" theme="success" icon={<TPIcon name="success" size={18} />} aria-label="Apply code" />}
        fullWidth
      />
      <InputBox
        label="Coupon"
        defaultValue="EXPIRED99"
        status="error"
        action={<Button size="sm" variant="ghost" theme="error" icon={<TPIcon name="close" size={18} />} aria-label="Remove coupon" />}
        fullWidth
      />
      <InputBox
        label="Referral link"
        defaultValue="tatva.care/r/ana8x2"
        readOnly
        action={<Button size="sm" variant="link" theme="primary">Copy</Button>}
        fullWidth
      />
    </Stack>
  ),
};

/** Auto-grow textarea (grows with text up to maxHeight, then scrolls) + width clamps. */
export const AutoGrowAndWidth = {
  name: 'Auto-grow & width',
  render: () => (
    <Stack w={460}>
      <InputBox
        label="Single line (default)"
        defaultValue="One line; long content scrolls within the field."
        fullWidth
      />
      <InputBox
        label="Auto-grow up to 140px, then scroll"
        autoGrow
        maxHeight={140}
        defaultValue={'Notes grow with the text.\nAdd more lines and the field expands\nup to the max height, then it scrolls.'}
        fullWidth
      />
      <InputBox
        label="Width clamp (min 100 / max 320)"
        defaultValue="Adapts between 100px and 320px"
        minWidth={100}
        maxWidth={320}
      />
    </Stack>
  ),
};
