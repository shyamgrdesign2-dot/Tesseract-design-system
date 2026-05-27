/**
 * TPButton — extended CTA, CSS-module driven
 * All states (hover / focus / disabled / loading) handled in CSS.
 */

import { TPButton } from './button-system/index.js';
import { Plus, ChevronRight, Download, Trash2, Check, Sparkles, Mic, Pencil, Search } from '@/src/components/atoms/icons/lucide';

const VARIANTS = ['solid', 'outline', 'ghost', 'tonal', 'link'];
const THEMES   = ['primary', 'neutral', 'error'];
const SIZES    = ['sm', 'md', 'lg'];

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
);

const Group = ({ label, dark, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.4)' : '#A2A2A8' }}>{label}</span>
    {children}
  </div>
);

const Dark = ({ children }) => (
  <div style={{ background: 'linear-gradient(135deg,#1a1966,#0e0d3d)', padding: 28, borderRadius: 16 }}>{children}</div>
);

export default {
  title: 'Atoms/TPButton',
  component: TPButton,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    variant:  { control: 'select',       options: VARIANTS },
    theme:    { control: 'select',       options: THEMES },
    size:     { control: 'inline-radio', options: SIZES },
    surface:  { control: 'inline-radio', options: ['light', 'dark'] },
    loading:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { children: 'Button', variant: 'solid', theme: 'primary', size: 'md', surface: 'light' },
};

// ─── Playground ───────────────────────────────────────────────────────────────
export const Playground = { name: '🎛 Playground' };

// ─── Variants × Themes ────────────────────────────────────────────────────────
export const AllVariants = {
  name: '📦 Variants × Themes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {THEMES.map((theme) => (
        <Group key={theme} label={theme}>
          <Row>
            {VARIANTS.map((v) => <TPButton key={v} variant={v} theme={theme}>{v}</TPButton>)}
          </Row>
        </Group>
      ))}
    </div>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────
export const Sizes = {
  name: '📐 Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {VARIANTS.map((v) => (
        <Group key={v} label={v}>
          <Row>
            {SIZES.map((s) => <TPButton key={s} variant={v} size={s}>{s}</TPButton>)}
          </Row>
        </Group>
      ))}
    </div>
  ),
};

// ─── Icon Positions ───────────────────────────────────────────────────────────
export const IconPositions = {
  name: '🔘 Icon Positions',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {VARIANTS.map((v) => (
        <Group key={v} label={v}>
          <Row>
            <TPButton variant={v}>Label</TPButton>
            <TPButton variant={v} leftIcon={<Plus size={16} strokeWidth={2} />}>Left</TPButton>
            <TPButton variant={v} rightIcon={<ChevronRight size={16} strokeWidth={2} />}>Right</TPButton>
            <TPButton variant={v} leftIcon={<Plus size={16} strokeWidth={2} />} rightIcon={<ChevronRight size={16} strokeWidth={2} />}>Both</TPButton>
          </Row>
        </Group>
      ))}
    </div>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────
export const States = {
  name: '⚡ States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {VARIANTS.map((v) => (
        <Group key={v} label={v}>
          <Row>
            <TPButton variant={v}>Default</TPButton>
            <TPButton variant={v} disabled>Disabled</TPButton>
            <TPButton variant={v} loading>Loading</TPButton>
          </Row>
        </Group>
      ))}
    </div>
  ),
};

// ─── Dark Surface ─────────────────────────────────────────────────────────────
export const DarkSurface = {
  name: '🌑 Dark Surface',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <Dark>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {VARIANTS.map((v) => (
          <Group key={v} label={v} dark>
            <Row>
              <TPButton variant={v} surface="dark">Default</TPButton>
              <TPButton variant={v} surface="dark" leftIcon={<Download size={16} strokeWidth={2} />}>Action</TPButton>
              <TPButton variant={v} surface="dark" disabled>Disabled</TPButton>
            </Row>
          </Group>
        ))}
      </div>
    </Dark>
  ),
};

// ─── Healthcare CTAs ──────────────────────────────────────────────────────────
export const UseCases = {
  name: '🏥 Use Cases',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Group label="Patient actions">
        <Row>
          <TPButton leftIcon={<Plus size={16} strokeWidth={2} />}>New Patient</TPButton>
          <TPButton variant="outline" leftIcon={<Pencil size={16} strokeWidth={2} />}>Edit</TPButton>
          <TPButton variant="ghost" leftIcon={<Search size={16} strokeWidth={2} />}>Search</TPButton>
          <TPButton variant="tonal" leftIcon={<Sparkles size={16} strokeWidth={2} />}>AI Summary</TPButton>
          <TPButton variant="link" rightIcon={<ChevronRight size={14} strokeWidth={2} />}>View all</TPButton>
        </Row>
      </Group>
      <Group label="Destructive">
        <Row>
          <TPButton theme="error" leftIcon={<Trash2 size={16} strokeWidth={2} />}>Delete</TPButton>
          <TPButton theme="error" variant="outline" leftIcon={<Trash2 size={16} strokeWidth={2} />}>Remove</TPButton>
          <TPButton theme="error" variant="ghost">Discard</TPButton>
        </Row>
      </Group>
      <Group label="Form actions">
        <Row>
          <TPButton size="lg" leftIcon={<Check size={18} strokeWidth={2} />}>Save Changes</TPButton>
          <TPButton size="lg" variant="outline">Cancel</TPButton>
          <TPButton size="sm" leftIcon={<Mic size={16} strokeWidth={2} />}>Dictate</TPButton>
        </Row>
      </Group>
    </div>
  ),
};
