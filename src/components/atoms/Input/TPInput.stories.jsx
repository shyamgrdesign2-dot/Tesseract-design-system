/**
 * TPInput — comprehensive input system
 *
 * Variants: plain · icon-left · icon-right · both icons · unit suffix
 *           · left addon (country / prefix) · right addon (button / unit)
 *           · counter (+/-) · select/dropdown
 * States:   default · hover (CSS) · focus (CSS) · success · error · disabled · read-only
 * Sizes:    sm (8px r) · md (10px r) · lg (12px r)
 */

import React from 'react';
import { TPInput } from './TPInput';
import {
  Search, Eye, Calendar, Mic, Download, Check,
  Users, Sparkles, Info, ChevronDown,
} from '@/src/components/atoms/icons/lucide';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SIZES    = ['sm', 'md', 'lg'];
const STATUSES = ['default', 'success', 'error'];

const Stack = ({ children, width = 320 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width }}>{children}</div>
);

const Group = ({ label, children, width = 340 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#54545C' }}>
      {label}
    </span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width }}>{children}</div>
  </div>
);

// Thin password-toggle icon (eye)
function EyeToggle() {
  const [show, setShow] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => setShow(v => !v)}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0 }}
      aria-label={show ? 'Hide' : 'Show'}
    >
      <Eye size={16} strokeWidth={1.75} />
    </button>
  );
}

// Country-code prefix dropdown (addon)
function CountryAddon() {
  return (
    <select aria-label="Country code" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#454551', cursor: 'pointer', paddingRight: 4 }}>
      <option>🇮🇳 +91</option>
      <option>🇺🇸 +1</option>
      <option>🇬🇧 +44</option>
      <option>🇦🇪 +971</option>
    </select>
  );
}

// Unit-button right addon (e.g. "Search" button)
function SearchAddon() {
  return (
    <button type="button" style={{ background: '#4B4AD5', border: 'none', color: '#fff', padding: '0 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', height: '100%', fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap' }}>
      Search
    </button>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Atoms/TPInput',
  component: TPInput,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    size:      { control: 'inline-radio', options: SIZES },
    status:    { control: 'select', options: STATUSES },
    fullWidth: { control: 'boolean' },
    disabled:  { control: 'boolean' },
  },
  args: { size: 'md', status: 'default', fullWidth: false, disabled: false },
};

// ─── Playground ───────────────────────────────────────────────────────────────
export const Playground = {
  name: '🎛 Playground',
  render: (args) => (
    <TPInput
      {...args}
      label="Label"
      helperText="Helper text"
      placeholder="Enter value…"
      style={{ width: 320 }}
    />
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────
export const Sizes = {
  name: '📐 Sizes',
  render: () => (
    <Stack width={340}>
      {SIZES.map((s) => (
        <TPInput key={s} size={s} label={`Size ${s.toUpperCase()}`} placeholder={`${s} input`} fullWidth />
      ))}
    </Stack>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────
export const States = {
  name: '⚡ States',
  render: () => (
    <Stack width={340}>
      <TPInput label="Default"   placeholder="Placeholder text…" fullWidth />
      <TPInput label="With value" defaultValue="Dr. Ananya Sharma" fullWidth />
      <TPInput label="Read-only" defaultValue="Read-only value" readOnly fullWidth />
      <TPInput label="Success"   status="success" defaultValue="john@example.com" helperText="Email verified" fullWidth />
      <TPInput label="Error"     status="error"   defaultValue="invalid@@email" helperText="Enter a valid email address" fullWidth />
      <TPInput label="Disabled"  disabled defaultValue="Not editable" fullWidth />
    </Stack>
  ),
};

// ─── Icon Positions ───────────────────────────────────────────────────────────
export const IconPositions = {
  name: '🔘 Icon Positions',
  render: () => (
    <Stack width={340}>
      <TPInput label="Left icon — search" leftIcon={<Search size={16} strokeWidth={1.75} />} placeholder="Search patients…" fullWidth />
      <TPInput label="Left icon — email"  leftIcon={<Sparkles   size={16} strokeWidth={1.75} />} placeholder="Email address" type="email" fullWidth />
      <TPInput label="Left icon — user"   leftIcon={<Users   size={16} strokeWidth={1.75} />} placeholder="Full name" fullWidth />
      <TPInput label="Right icon — password" rightIcon={<EyeToggle />} placeholder="Enter password" type="password" fullWidth />
      <TPInput label="Both icons"
        leftIcon={<Info size={16} strokeWidth={1.75} />}
        rightIcon={<EyeToggle />}
        placeholder="Password" type="password" fullWidth
      />
    </Stack>
  ),
};

// ─── Unit / inline affix ──────────────────────────────────────────────────────
export const UnitAffix = {
  name: '🔢 Unit Affix',
  render: () => (
    <Stack width={340}>
      <TPInput label="Weight"      unit="kg"  type="number" placeholder="0" fullWidth />
      <TPInput label="Height"      unit="cm"  type="number" placeholder="0" fullWidth />
      <TPInput label="Temperature" unit="°C"  type="number" placeholder="37.0" fullWidth />
      <TPInput label="Amount"      unit="USD" type="number" placeholder="0.00" fullWidth />
      <TPInput label="Dosage"      unit="mg"  type="number" placeholder="0" fullWidth />
      <TPInput label="Percentage"  unit="%"   type="number" placeholder="0" min={0} max={100} fullWidth />
    </Stack>
  ),
};

// ─── Counter (+/-) ────────────────────────────────────────────────────────────
export const Counter = {
  name: '± Counter',
  render: () => (
    <Stack width={300}>
      <TPInput label="Quantity" counter type="number" defaultValue="1" min={0} fullWidth />
      <TPInput label="Dosage (mg)" counter type="number" defaultValue="500" step={250} min={0} fullWidth />
      <TPInput label="Age" counter type="number" defaultValue="30" min={0} max={120} fullWidth />
      <TPInput label="Counter — disabled" counter type="number" defaultValue="5" disabled fullWidth />
    </Stack>
  ),
};

// ─── Left addon (country / prefix) ────────────────────────────────────────────
export const LeftAddon = {
  name: '🌍 Left Addon — Country / Prefix',
  render: () => (
    <Stack width={360}>
      <TPInput
        label="Mobile number"
        leftAddon={<CountryAddon />}
        type="tel"
        placeholder="98765 43210"
        fullWidth
      />
      <TPInput
        label="With icon + country addon"
        leftAddon={<CountryAddon />}
        leftIcon={<Mic size={16} strokeWidth={1.75} />}
        type="tel"
        placeholder="98765 43210"
        fullWidth
      />
      <TPInput
        label="Prefix text addon"
        leftAddon={<span style={{ fontSize: 13, color: '#54545C', whiteSpace: 'nowrap' }}>https://</span>}
        placeholder="yoursite.com"
        fullWidth
      />
    </Stack>
  ),
};

// ─── Right addon (button / submit) ────────────────────────────────────────────
export const RightAddon = {
  name: '🔗 Right Addon — Button',
  render: () => (
    <Stack width={380}>
      <TPInput
        label="Search with button"
        leftIcon={<Search size={16} strokeWidth={1.75} />}
        rightAddon={<SearchAddon />}
        placeholder="Search records…"
        fullWidth
      />
      <TPInput
        label="Coupon code"
        placeholder="PROMO2025"
        rightAddon={
          <button type="button" style={{ background: 'transparent', border: 'none', color: '#4B4AD5', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '0 14px', fontFamily: 'Inter,sans-serif' }}>
            Apply
          </button>
        }
        fullWidth
      />
    </Stack>
  ),
};

// ─── Select / dropdown ────────────────────────────────────────────────────────
export const SelectInput = {
  name: '▼ Select / Dropdown',
  render: () => (
    <Stack width={340}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="select-blood-group" style={{ fontSize: 13, fontWeight: 500, color: '#454551' }}>Blood group</label>
        <select id="select-blood-group" style={{
          height: 42, padding: '0 12px', fontSize: 14, fontFamily: 'Inter,sans-serif',
          border: '1.5px solid #E2E2EA', borderRadius: 10, background: '#fff',
          color: '#171725', outline: 'none', width: '100%', cursor: 'pointer',
          transition: 'border-color 140ms, box-shadow 140ms',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23717179' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight: 36,
        }}>
          <option value="">Select blood group…</option>
          {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="select-specialty" style={{ fontSize: 13, fontWeight: 500, color: '#454551' }}>Specialty (sm)</label>
        <select id="select-specialty" style={{
          height: 36, padding: '0 10px', fontSize: 13, fontFamily: 'Inter,sans-serif',
          border: '1.5px solid #E2E2EA', borderRadius: 8, background: '#fff',
          color: '#171725', outline: 'none', width: '100%', cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23717179' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          paddingRight: 30,
        }}>
          <option>Cardiology</option>
          <option>Neurology</option>
          <option>Orthopedics</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="select-department" style={{ fontSize: 13, fontWeight: 500, color: '#454551' }}>Department (lg)</label>
        <select id="select-department" style={{
          height: 48, padding: '0 16px', fontSize: 14, fontFamily: 'Inter,sans-serif',
          border: '1.5px solid #E2E2EA', borderRadius: 12, background: '#fff',
          color: '#171725', outline: 'none', width: '100%', cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23717179' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: 40,
        }}>
          <option>Emergency</option>
          <option>ICU</option>
          <option>OPD</option>
        </select>
      </div>
    </Stack>
  ),
};

// ─── Full healthcare form ─────────────────────────────────────────────────────
export const HealthcareForm = {
  name: '🏥 Healthcare Form',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400, padding: 24, background: '#fff', border: '1px solid #E2E2EA', borderRadius: 16 }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#171725' }}>Patient Registration</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <TPInput label="First name" leftIcon={<Users size={15} strokeWidth={1.75} />} placeholder="Ananya" fullWidth />
        <TPInput label="Last name"  placeholder="Sharma" fullWidth />
      </div>

      <TPInput label="Email" leftIcon={<Sparkles size={15} strokeWidth={1.75} />} type="email" placeholder="ananya@example.com" fullWidth />

      <TPInput label="Mobile" leftAddon={<CountryAddon />} type="tel" placeholder="98765 43210" fullWidth />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <TPInput label="Weight" unit="kg" type="number" placeholder="68" fullWidth />
        <TPInput label="Height" unit="cm" type="number" placeholder="165" fullWidth />
      </div>

      <TPInput
        label="Email (verified)"
        status="success"
        defaultValue="ananya@verified.com"
        helperText="Identity verified"
        fullWidth
      />
      <TPInput
        label="Age"
        status="error"
        defaultValue="abc"
        helperText="Must be a number between 0–120"
        fullWidth
      />
      <TPInput label="Notes (disabled)" disabled defaultValue="Allergy to penicillin" fullWidth />
    </div>
  ),
};

// ─── Responsive row ───────────────────────────────────────────────────────────
export const Responsive = {
  name: '📱 Responsive',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {[360, 768, 1024].map((w) => (
        <div key={w}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#54545C', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
            {w}px viewport
          </span>
          <div style={{ width: w, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <TPInput
              size={w < 400 ? 'sm' : w < 800 ? 'md' : 'lg'}
              label="Search"
              leftIcon={<Search size={w < 400 ? 14 : 16} strokeWidth={1.75} />}
              placeholder="Search patients…"
              fullWidth
            />
            <TPInput
              size={w < 400 ? 'sm' : w < 800 ? 'md' : 'lg'}
              label="Mobile"
              leftAddon={<CountryAddon />}
              type="tel"
              placeholder="98765 43210"
              fullWidth
            />
          </div>
        </div>
      ))}
    </div>
  ),
};
