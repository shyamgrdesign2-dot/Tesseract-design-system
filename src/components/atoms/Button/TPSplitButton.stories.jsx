/**
 * TPSplitButton — Compound action + dropdown CTA
 *
 * Material UI-style split button: primary action left, chevron
 * dropdown right, separated by a 1px divider.
 * Dropdown menu is portal-rendered (never clipped by containers).
 *
 * Coverage:
 *  • 5 variants × 3 themes × 3 sizes
 *  • States: default, disabled, loading
 *  • Dark surface
 *  • Healthcare use-case examples
 */

import { TPSplitButton } from './button-system/index.js';
import {
  Download, Pencil, Plus, FileText, Trash2, Check,
  Calendar, Users, Sparkles, Mic, Copy, Eye,
} from '@/src/components/atoms/icons/lucide';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const VARIANTS = ['solid', 'outline', 'ghost', 'tonal'];
const THEMES   = ['primary', 'neutral', 'error'];
const SIZES    = ['sm', 'md', 'lg'];

const Row = ({ children, gap = 16 }) => (
  <div style={{ display: 'flex', gap, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

const Label = ({ children, dark }) => (
  <span style={{
    fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
    color: dark ? 'rgba(255,255,255,0.4)' : 'var(--tp-slate-400, #A2A2A8)',
    display: 'block', marginBottom: 4,
  }}>
    {children}
  </span>
);

const DarkBox = ({ children }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1a1966 0%, #0e0d3d 100%)',
    padding: 28, borderRadius: 16,
  }}>
    {children}
  </div>
);

// ─── Shared action sets ─────────────────────────────────────────────────────────

const exportActions = [
  { id: 'pdf',    label: 'Export as PDF',   icon: <FileText size={15} strokeWidth={1.75} />,  shortcut: '⌘E' },
  { id: 'csv',    label: 'Export as CSV',   icon: <Download size={15} strokeWidth={1.75} />,  shortcut: '⌘⇧E' },
  { id: 'copy',   label: 'Copy to clipboard', icon: <Copy size={15} strokeWidth={1.75} /> },
];

const patientActions = [
  { id: 'view',    label: 'View patient',    icon: <Eye size={15} strokeWidth={1.75} /> },
  { id: 'edit',    label: 'Edit details',    icon: <Pencil size={15} strokeWidth={1.75} /> },
  { id: 'appt',   label: 'Schedule appt',   icon: <Calendar size={15} strokeWidth={1.75} /> },
  { id: 'delete', label: 'Remove patient',  icon: <Trash2 size={15} strokeWidth={1.75} />, disabled: true },
];

const aiActions = [
  { id: 'summary',    label: 'Generate summary',    icon: <Sparkles size={15} strokeWidth={1.75} /> },
  { id: 'transcript', label: 'View transcript',     icon: <FileText size={15} strokeWidth={1.75} /> },
  { id: 'dictate',    label: 'Start dictation',     icon: <Mic size={15} strokeWidth={1.75} /> },
];

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Atoms/TPSplitButton',
  component: TPSplitButton,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    variant:  { control: 'select',       options: VARIANTS },
    theme:    { control: 'select',       options: THEMES },
    size:     { control: 'inline-radio', options: SIZES },
    surface:  { control: 'inline-radio', options: ['light', 'dark'] },
    loading:  { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    variant:  'solid',
    theme:    'primary',
    size:     'md',
    surface:  'light',
    loading:  false,
    disabled: false,
    primaryAction: {
      label:   'Export',
      icon:    <Download size={16} strokeWidth={1.75} />,
      onClick: () => alert('Primary action'),
    },
    secondaryActions: exportActions,
  },
};

export default meta;

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground = { name: '🎛 Playground' };

// ─── Variants × Themes ─────────────────────────────────────────────────────────

export const AllVariants = {
  name: '📦 Variants × Themes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {THEMES.map((theme) => (
        <div key={theme} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Label>{`Theme: ${theme}`}</Label>
          <Row>
            {VARIANTS.map((variant) => (
              <TPSplitButton
                key={variant}
                variant={variant}
                theme={theme}
                primaryAction={{
                  label:   variant.charAt(0).toUpperCase() + variant.slice(1),
                  onClick: () => {},
                }}
                secondaryActions={exportActions}
              />
            ))}
          </Row>
        </div>
      ))}
    </div>
  ),
};

// ─── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes = {
  name: '📐 Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Label>{`Variant: ${variant}`}</Label>
          <Row gap={20}>
            {SIZES.map((size) => (
              <TPSplitButton
                key={size}
                variant={variant}
                size={size}
                primaryAction={{
                  label:   size.toUpperCase(),
                  icon:    <Download size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={1.75} />,
                  onClick: () => {},
                }}
                secondaryActions={exportActions}
              />
            ))}
          </Row>
        </div>
      ))}
    </div>
  ),
};

// ─── With / Without Primary Icon ───────────────────────────────────────────────

export const PrimaryIcons = {
  name: '🔘 Primary Action Icons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>With icon</Label>
        <Row>
          <TPSplitButton
            primaryAction={{ label: 'Export', icon: <Download size={16} strokeWidth={1.75} />, onClick: () => {} }}
            secondaryActions={exportActions}
          />
          <TPSplitButton
            primaryAction={{ label: 'New Patient', icon: <Plus size={16} strokeWidth={1.75} />, onClick: () => {} }}
            secondaryActions={patientActions}
          />
          <TPSplitButton
            primaryAction={{ label: 'AI Summary', icon: <Sparkles size={16} strokeWidth={1.75} />, onClick: () => {} }}
            secondaryActions={aiActions}
          />
        </Row>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Without icon</Label>
        <Row>
          <TPSplitButton
            primaryAction={{ label: 'Export', onClick: () => {} }}
            secondaryActions={exportActions}
          />
          <TPSplitButton
            variant="outline"
            primaryAction={{ label: 'Save Draft', onClick: () => {} }}
            secondaryActions={[
              { id: 'publish', label: 'Publish',   icon: <Check size={15} strokeWidth={1.75} /> },
              { id: 'discard', label: 'Discard',   icon: <Trash2 size={15} strokeWidth={1.75} /> },
            ]}
          />
        </Row>
      </div>
    </div>
  ),
};

// ─── States ────────────────────────────────────────────────────────────────────

export const States = {
  name: '⚡ States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Label>{`Variant: ${variant}`}</Label>
          <Row>
            <TPSplitButton
              variant={variant}
              primaryAction={{ label: 'Default', onClick: () => {} }}
              secondaryActions={exportActions}
            />
            <TPSplitButton
              variant={variant}
              disabled
              primaryAction={{ label: 'Disabled', onClick: () => {} }}
              secondaryActions={exportActions}
            />
            <TPSplitButton
              variant={variant}
              loading
              primaryAction={{ label: 'Loading', onClick: () => {} }}
              secondaryActions={exportActions}
            />
          </Row>
        </div>
      ))}
    </div>
  ),
};

// ─── Dark Surface ──────────────────────────────────────────────────────────────

export const DarkSurface = {
  name: '🌑 Dark Surface',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <DarkBox>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {VARIANTS.map((variant) => (
          <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Label dark>{`${variant}`}</Label>
            <Row>
              {THEMES.map((theme) => (
                <TPSplitButton
                  key={theme}
                  variant={variant}
                  theme={theme}
                  surface="dark"
                  primaryAction={{
                    label:   theme.charAt(0).toUpperCase() + theme.slice(1),
                    onClick: () => {},
                  }}
                  secondaryActions={exportActions}
                />
              ))}
            </Row>
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Label dark>States on dark</Label>
          <Row>
            <TPSplitButton
              surface="dark"
              primaryAction={{ label: 'Default', icon: <Download size={16} strokeWidth={1.75} />, onClick: () => {} }}
              secondaryActions={exportActions}
            />
            <TPSplitButton
              surface="dark"
              disabled
              primaryAction={{ label: 'Disabled', onClick: () => {} }}
              secondaryActions={exportActions}
            />
            <TPSplitButton
              surface="dark"
              loading
              primaryAction={{ label: 'Loading', onClick: () => {} }}
              secondaryActions={exportActions}
            />
          </Row>
        </div>
      </div>
    </DarkBox>
  ),
};

// ─── Healthcare use cases ───────────────────────────────────────────────────────

export const HealthcareUseCases = {
  name: '🏥 Healthcare Use Cases',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Report export</Label>
        <Row>
          <TPSplitButton
            primaryAction={{
              label:   'Export PDF',
              icon:    <Download size={16} strokeWidth={1.75} />,
              onClick: () => {},
            }}
            secondaryActions={exportActions}
          />
        </Row>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Patient actions</Label>
        <Row>
          <TPSplitButton
            variant="outline"
            primaryAction={{
              label:   'Add Patient',
              icon:    <Users size={16} strokeWidth={1.75} />,
              onClick: () => {},
            }}
            secondaryActions={patientActions}
          />
        </Row>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>AI Assist</Label>
        <Row>
          <TPSplitButton
            variant="tonal"
            primaryAction={{
              label:   'Generate Summary',
              icon:    <Sparkles size={16} strokeWidth={1.75} />,
              onClick: () => {},
            }}
            secondaryActions={aiActions}
          />
        </Row>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Confirm actions (sizes)</Label>
        <Row gap={20}>
          {SIZES.map((size) => (
            <TPSplitButton
              key={size}
              size={size}
              primaryAction={{
                label:   'Save &amp; Close',
                icon:    <Check size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={1.75} />,
                onClick: () => {},
              }}
              secondaryActions={[
                { id: 'draft',  label: 'Save as draft', icon: <FileText size={15} strokeWidth={1.75} /> },
                { id: 'discard',label: 'Discard',        icon: <Trash2 size={15} strokeWidth={1.75} /> },
              ]}
            />
          ))}
        </Row>
      </div>
    </div>
  ),
};
