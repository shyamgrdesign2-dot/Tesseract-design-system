/**
 * TPIconButton — Square icon-only CTA
 *
 * Square button (width === height) for toolbars, tables, cards.
 * Uses the same token system as TPButton.
 *
 * Coverage:
 *  • 3 themes × 3 sizes × light surface
 *  • 3 sizes × dark surface
 *  • States: default, disabled, loading
 *  • Practical icon showcase (24 icons)
 */

import { TPIconButton } from './button-system/index.js';
import {
  Plus, Pencil, Trash2, Download, Search, Mic, MicOff,
  Eye, Copy, Check, MoreHorizontal, MoreVertical,
  ChevronLeft, ChevronRight,
  Users, Calendar, FileText, Heart,
  ClipboardList, Sparkles, Info,
} from '@/src/components/atoms/icons/lucide';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const THEMES = ['primary', 'neutral', 'error'];
const SIZES  = ['sm', 'md', 'lg'];

function Row({ children, gap = 8 }) {
  return (
    <div style={{ display: 'flex', gap, alignItems: 'center', flexWrap: 'wrap' }}>
      {children}
    </div>
  );
}

function SectionLabel({ children, dark }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,0.4)' : 'var(--tp-slate-400, #A2A2A8)',
      display: 'block', marginBottom: 4,
    }}>
      {children}
    </span>
  );
}

function DarkSurface({ children }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1966 0%, #0e0d3d 100%)',
      padding: 28, borderRadius: 16,
    }}>
      {children}
    </div>
  );
}

// Inline X (close) icon — avoids re-exporting from lucide barrel
function CloseIcon({ size = 18, strokeWidth = 1.75 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      width={size} height={size} aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// Size-aware icon wrapper
function iconForSize(size, Component) {
  const px = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  return <Component size={px} strokeWidth={1.75} />;
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Atoms/TPIconButton',
  component: TPIconButton,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    theme:    { control: 'select',       options: THEMES },
    size:     { control: 'inline-radio', options: SIZES },
    surface:  { control: 'inline-radio', options: ['light', 'dark'] },
    loading:  { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    theme:    'neutral',
    size:     'md',
    surface:  'light',
    loading:  false,
    disabled: false,
    icon:     <Pencil size={18} strokeWidth={1.75} />,
  },
};

export default meta;

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground = { name: '🎛 Playground' };

// ─── Themes × Sizes (light) ────────────────────────────────────────────────────

export const ThemesAndSizes = {
  name: '📦 Themes × Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {THEMES.map((theme) => (
        <div key={theme} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SectionLabel>{`Theme: ${theme}`}</SectionLabel>
          <Row gap={12}>
            {SIZES.map((size) => (
              <TPIconButton
                key={size}
                theme={theme}
                size={size}
                icon={iconForSize(size, Pencil)}
                aria-label={`Edit (${size})`}
              />
            ))}
          </Row>
        </div>
      ))}
    </div>
  ),
};

// ─── States ────────────────────────────────────────────────────────────────────

export const States = {
  name: '⚡ States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {THEMES.map((theme) => (
        <div key={theme} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SectionLabel>{`Theme: ${theme}`}</SectionLabel>
          <Row gap={12}>
            <TPIconButton theme={theme} icon={<Pencil size={18} strokeWidth={1.75} />} aria-label="Default" />
            <TPIconButton theme={theme} icon={<Pencil size={18} strokeWidth={1.75} />} disabled aria-label="Disabled" />
            <TPIconButton theme={theme} loading aria-label="Loading" />
          </Row>
        </div>
      ))}
    </div>
  ),
};

// ─── Dark Surface ──────────────────────────────────────────────────────────────

export const DarkSurfaceStory = {
  name: '🌑 Dark Surface',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <DarkSurface>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SectionLabel dark>Sizes (neutral)</SectionLabel>
          <Row gap={12}>
            <TPIconButton surface="dark" size="sm" icon={<Pencil size={16} strokeWidth={1.75} />} aria-label="Edit small" />
            <TPIconButton surface="dark" size="md" icon={<Pencil size={18} strokeWidth={1.75} />} aria-label="Edit medium" />
            <TPIconButton surface="dark" size="lg" icon={<Pencil size={22} strokeWidth={1.75} />} aria-label="Edit large" />
          </Row>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SectionLabel dark>Themes</SectionLabel>
          <Row gap={12}>
            {THEMES.map((theme) => (
              <TPIconButton
                key={theme}
                theme={theme}
                surface="dark"
                icon={<Pencil size={18} strokeWidth={1.75} />}
                aria-label={`${theme} edit`}
              />
            ))}
          </Row>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SectionLabel dark>States</SectionLabel>
          <Row gap={12}>
            <TPIconButton surface="dark" icon={<Plus size={18} strokeWidth={1.75} />} aria-label="Add" />
            <TPIconButton surface="dark" icon={<Plus size={18} strokeWidth={1.75} />} disabled aria-label="Disabled" />
            <TPIconButton surface="dark" loading aria-label="Loading" />
          </Row>
        </div>
      </div>
    </DarkSurface>
  ),
};

// ─── Icon Showcase ─────────────────────────────────────────────────────────────

export const IconShowcase = {
  name: '🎨 Icon Showcase',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionLabel>All icons — neutral / md / light</SectionLabel>
      <Row gap={8}>
        {[
          [Plus,           'Add'],
          [Pencil,         'Edit'],
          [Trash2,         'Delete'],
          [Download,       'Download'],
          [Search,         'Search'],
          [Mic,            'Mic on'],
          [MicOff,         'Mic off'],
          [Eye,            'View'],
          [Copy,           'Copy'],
          [Check,          'Check'],
          [MoreHorizontal, 'More horiz'],
          [MoreVertical,   'More vert'],
          [ChevronLeft,    'Prev'],
          [ChevronRight,   'Next'],
          [Users,          'Patients'],
          [Calendar,       'Schedule'],
          [FileText,       'Notes'],
          [Heart,          'Vitals'],
          [ClipboardList,  'Records'],
          [Sparkles,       'AI'],
          [Info,           'Info'],
        ].map(([Icon, label]) => (
          <TPIconButton
            key={label}
            icon={<Icon size={18} strokeWidth={1.75} />}
            aria-label={label}
          />
        ))}
        <TPIconButton
          icon={<CloseIcon size={18} />}
          aria-label="Close"
        />
      </Row>

      <SectionLabel>Error theme — destructive actions</SectionLabel>
      <Row gap={8}>
        {[
          [Trash2,  'Delete'],
          [MicOff,  'Mute'],
        ].map(([Icon, label]) => (
          <TPIconButton
            key={label}
            theme="error"
            icon={<Icon size={18} strokeWidth={1.75} />}
            aria-label={label}
          />
        ))}
        <TPIconButton
          theme="error"
          icon={<CloseIcon size={18} />}
          aria-label="Remove"
        />
      </Row>

      <SectionLabel>Primary theme — affirmative actions</SectionLabel>
      <Row gap={8}>
        {[
          [Plus,      'Add'],
          [Check,     'Confirm'],
          [Download,  'Download'],
          [Mic,       'Record'],
          [Sparkles,  'AI assist'],
        ].map(([Icon, label]) => (
          <TPIconButton
            key={label}
            theme="primary"
            icon={<Icon size={18} strokeWidth={1.75} />}
            aria-label={label}
          />
        ))}
      </Row>
    </div>
  ),
};

// ─── Toolbar example ───────────────────────────────────────────────────────────

export const ToolbarExample = {
  name: '🔧 Toolbar Example',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionLabel>Text editor toolbar (sm)</SectionLabel>
      <div style={{
        display: 'inline-flex', gap: 2, padding: '4px 6px',
        background: 'var(--tp-slate-50, #FAFAFB)',
        border: '1px solid var(--tp-slate-200, #E2E2EA)',
        borderRadius: 10, alignItems: 'center',
      }}>
        {[
          [ChevronLeft,  'Back'],
          [ChevronRight, 'Forward'],
        ].map(([Icon, label]) => (
          <TPIconButton key={label} size="sm" icon={<Icon size={14} strokeWidth={2} />} aria-label={label} />
        ))}
        <div style={{ width: 1, height: 20, background: 'var(--tp-slate-200, #E2E2EA)', margin: '0 4px' }} />
        {[
          [Copy,     'neutral', 'Copy'],
          [Trash2,   'error',   'Delete'],
          [Download, 'neutral', 'Download'],
        ].map(([Icon, theme, label]) => (
          <TPIconButton key={label} size="sm" theme={theme} icon={<Icon size={14} strokeWidth={2} />} aria-label={label} />
        ))}
      </div>

      <SectionLabel>Table row actions (md)</SectionLabel>
      <div style={{ display: 'inline-flex', gap: 4 }}>
        <TPIconButton icon={<Eye size={18} strokeWidth={1.75} />} aria-label="View" />
        <TPIconButton icon={<Pencil size={18} strokeWidth={1.75} />} aria-label="Edit" />
        <TPIconButton theme="error" icon={<Trash2 size={18} strokeWidth={1.75} />} aria-label="Delete" />
      </div>

      <SectionLabel>Dark toolbar (md)</SectionLabel>
      <DarkSurface>
        <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <TPIconButton surface="dark" icon={<Mic size={18} strokeWidth={1.75} />} aria-label="Mic" />
          <TPIconButton surface="dark" icon={<MicOff size={18} strokeWidth={1.75} />} disabled aria-label="Mic off" />
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.15)' }} />
          <TPIconButton surface="dark" icon={<Download size={18} strokeWidth={1.75} />} aria-label="Download" />
          <TPIconButton surface="dark" icon={<Sparkles size={18} strokeWidth={1.75} />} aria-label="AI" />
        </div>
      </DarkSurface>
    </div>
  ),
};
