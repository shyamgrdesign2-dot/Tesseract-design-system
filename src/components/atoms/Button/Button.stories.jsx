/**
 * Button — TatvaPractice CTA System
 *
 * Documents the CSS-module Button (data-attribute API).
 * For the token-based extended variant, see TPButton.stories.
 *
 * Coverage:
 *  • 5 variants  × 3 themes  × 3 sizes
 *  • Icon positions: none | left | right | left+right
 *  • States: default, hover (CSS), disabled, loading
 *  • Surface: light | dark  — all 5 variants on dark with whitish tones
 *  • Full interactive Playground
 */

import { Button } from './Button';
import { TPSplitButton } from './button-system/TPSplitButton';
import {
  Plus, ChevronRight, Download, Trash2, Check, Pencil, Search, Sparkles,
  ChevronDown, FileText,
} from '@/src/components/atoms/icons/lucide';

// ─── Shared helpers ────────────────────────────────────────────────────────────

const VARIANTS = ['solid', 'outline', 'ghost', 'tonal', 'link'];
const THEMES   = ['primary', 'neutral', 'error'];
const SIZES    = ['sm', 'md', 'lg'];

const Row = ({ children, gap = 12 }) => (
  <div style={{ display: 'flex', gap, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

const Section = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--tp-slate-400, #A2A2A8)' }}>
      {label}
    </span>
    {children}
  </div>
);

const DarkBox = ({ children, style }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1a1966 0%, #0e0d3d 100%)',
    padding: 28,
    borderRadius: 16,
    ...style,
  }}>
    {children}
  </div>
);

const IconSm  = () => <Plus size={16} strokeWidth={2} />;
const IconMd  = () => <Plus size={18} strokeWidth={2} />;
const IconLg  = () => <Plus size={20} strokeWidth={2} />;

function iconForSize(size) {
  if (size === 'sm') return <IconSm />;
  if (size === 'lg') return <IconLg />;
  return <IconMd />;
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Atoms/Button',
  component: Button,
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
  args: {
    children: 'Button',
    variant:  'solid',
    theme:    'primary',
    size:     'md',
    surface:  'light',
    loading:  false,
    disabled: false,
  },
};

export default meta;

// ─── 1. Playground ─────────────────────────────────────────────────────────────

export const Playground = {
  name: '🎛 Playground',
};

// ─── 2. Variants (light, primary) ──────────────────────────────────────────────

export const Variants = {
  name: '📦 All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {THEMES.map((theme) => (
        <Section key={theme} label={`Theme: ${theme}`}>
          <Row>
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} theme={theme}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes = {
  name: '📐 Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {THEMES.map((theme) => (
        <Section key={theme} label={`Theme: ${theme}`}>
          <Row gap={16}>
            {SIZES.map((size) => (
              <Button key={size} theme={theme} size={size}>
                {size.toUpperCase()}
              </Button>
            ))}
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 4. Icon Positions ─────────────────────────────────────────────────────────

export const IconPositions = {
  name: '🔘 Icon Positions',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {VARIANTS.map((variant) => (
        <Section key={variant} label={`Variant: ${variant}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SIZES.map((size) => (
              <Row key={size} gap={12}>
                {/* No icon */}
                <Button variant={variant} size={size}>
                  Label
                </Button>
                {/* Left icon */}
                <Button variant={variant} size={size} leftIcon={iconForSize(size)}>
                  Add item
                </Button>
                {/* Right icon */}
                <Button variant={variant} size={size} rightIcon={<ChevronRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={2} />}>
                  Continue
                </Button>
                {/* Both icons */}
                <Button
                  variant={variant}
                  size={size}
                  leftIcon={iconForSize(size)}
                  rightIcon={<ChevronRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={2} />}
                >
                  Action
                </Button>
              </Row>
            ))}
          </div>
        </Section>
      ))}
    </div>
  ),
};

// ─── 5. States ─────────────────────────────────────────────────────────────────

export const States = {
  name: '⚡ States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {VARIANTS.map((variant) => (
        <Section key={variant} label={`Variant: ${variant}`}>
          <Row>
            <Button variant={variant}>Default</Button>
            <Button variant={variant} disabled>Disabled</Button>
            <Button variant={variant} loading>Loading</Button>
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 6. Dark Surface — All Variants ────────────────────────────────────────────

export const DarkSurface = {
  name: '🌑 Dark Surface — All Variants',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <DarkBox>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {VARIANTS.map((variant) => (
          <Section key={variant} label={<span style={{ color: 'rgba(255,255,255,0.45)' }}>{`${variant}`}</span>}>
            <Row>
              {THEMES.map((theme) => (
                <Button key={theme} variant={variant} theme={theme} surface="dark">
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Button>
              ))}
            </Row>
          </Section>
        ))}
      </div>
    </DarkBox>
  ),
};

// ─── 7. Dark Surface — With Icons ──────────────────────────────────────────────

export const DarkSurfaceWithIcons = {
  name: '🌑 Dark Surface — With Icons',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <DarkBox>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {VARIANTS.map((variant) => (
          <Section key={variant} label={<span style={{ color: 'rgba(255,255,255,0.45)' }}>{`${variant}`}</span>}>
            <Row>
              <Button variant={variant} surface="dark" leftIcon={<Download size={16} strokeWidth={2} />}>
                Download
              </Button>
              <Button variant={variant} surface="dark" rightIcon={<ChevronRight size={16} strokeWidth={2} />}>
                Continue
              </Button>
              <Button variant={variant} surface="dark" disabled>
                Disabled
              </Button>
            </Row>
          </Section>
        ))}
      </div>
    </DarkBox>
  ),
};

// ─── 8. Dark Surface — Sizes ───────────────────────────────────────────────────

export const DarkSurfaceSizes = {
  name: '🌑 Dark Surface — Sizes',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <DarkBox>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {VARIANTS.filter((v) => v !== 'link').map((variant) => (
          <Section key={variant} label={<span style={{ color: 'rgba(255,255,255,0.45)' }}>{`${variant}`}</span>}>
            <Row gap={16}>
              {SIZES.map((size) => (
                <Button key={size} variant={variant} surface="dark" size={size}>
                  {size.toUpperCase()}
                </Button>
              ))}
            </Row>
          </Section>
        ))}
      </div>
    </DarkBox>
  ),
};

// ─── 9. Full Matrix (light) ────────────────────────────────────────────────────

export const FullMatrix = {
  name: '📊 Full Matrix',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, marginBottom: 8 }}>
        <div />
        {VARIANTS.map((v) => (
          <span key={v} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--tp-slate-400, #A2A2A8)', textAlign: 'center' }}>
            {v}
          </span>
        ))}
      </div>
      {THEMES.map((theme) => (
        <div key={theme} style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tp-slate-600, #717179)' }}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </span>
          {VARIANTS.map((variant) => (
            <div key={variant} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant={variant} theme={theme}>
                Label
              </Button>
            </div>
          ))}
        </div>
      ))}

      {/* Disabled row */}
      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, alignItems: 'center', marginTop: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tp-slate-400, #A2A2A8)' }}>Disabled</span>
        {VARIANTS.map((variant) => (
          <div key={variant} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant={variant} disabled>
              Label
            </Button>
          </div>
        ))}
      </div>

      {/* Loading row */}
      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tp-slate-400, #A2A2A8)' }}>Loading</span>
        {VARIANTS.map((variant) => (
          <div key={variant} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant={variant} loading>
              Label
            </Button>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ─── 10. Icon-first buttons ────────────────────────────────────────────────────

export const WithIcons = {
  name: '🔷 With Icons — All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {VARIANTS.map((variant) => (
        <Section key={variant} label={`${variant}`}>
          <Row>
            <Button variant={variant} leftIcon={<Plus size={16} strokeWidth={2} />}>
              Add Patient
            </Button>
            <Button variant={variant} rightIcon={<ChevronRight size={16} strokeWidth={2} />}>
              View Details
            </Button>
            <Button variant={variant} leftIcon={<Download size={16} strokeWidth={2} />} rightIcon={<ChevronRight size={16} strokeWidth={2} />}>
              Export Report
            </Button>
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 11. Destructive / Error theme ─────────────────────────────────────────────

export const Destructive = {
  name: '🔴 Destructive (Error Theme)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Section label="Light surface">
        <Row>
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} theme="error" leftIcon={<Trash2 size={16} strokeWidth={2} />}>
              Delete
            </Button>
          ))}
        </Row>
      </Section>
      <Section label="Dark surface">
        <DarkBox>
          <Row>
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} theme="error" surface="dark" leftIcon={<Trash2 size={16} strokeWidth={2} />}>
                Delete
              </Button>
            ))}
          </Row>
        </DarkBox>
      </Section>
      <Section label="States">
        <Row>
          <Button theme="error" leftIcon={<Trash2 size={16} strokeWidth={2} />}>Delete Record</Button>
          <Button theme="error" disabled leftIcon={<Trash2 size={16} strokeWidth={2} />}>Delete Record</Button>
          <Button theme="error" loading>Deleting…</Button>
        </Row>
      </Section>
    </div>
  ),
};

// ─── 12. Use-case showcase ─────────────────────────────────────────────────────

export const UseCases = {
  name: '🏥 Use Cases — Healthcare CTAs',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section label="Patient actions">
        <Row>
          <Button leftIcon={<Plus size={16} strokeWidth={2} />}>New Patient</Button>
          <Button variant="outline" leftIcon={<Pencil size={16} strokeWidth={2} />}>Edit Profile</Button>
          <Button variant="ghost" leftIcon={<Search size={16} strokeWidth={2} />}>Search Records</Button>
          <Button variant="tonal" leftIcon={<Check size={16} strokeWidth={2} />}>Mark Complete</Button>
          <Button variant="link" rightIcon={<ChevronRight size={16} strokeWidth={2} />}>View All Patients</Button>
        </Row>
      </Section>
      <Section label="Report actions">
        <Row>
          <Button leftIcon={<Download size={16} strokeWidth={2} />} rightIcon={<ChevronRight size={16} strokeWidth={2} />}>
            Export Report
          </Button>
          <Button variant="outline" theme="error" leftIcon={<Trash2 size={16} strokeWidth={2} />}>
            Delete Report
          </Button>
          <Button variant="ghost" leftIcon={<Sparkles size={16} strokeWidth={2} />}>
            AI Summary
          </Button>
        </Row>
      </Section>
      <Section label="Form actions">
        <Row>
          <Button size="lg" leftIcon={<Check size={18} strokeWidth={2} />}>Save &amp; Submit</Button>
          <Button size="lg" variant="outline">Cancel</Button>
          <Button size="sm" variant="ghost" theme="error" leftIcon={<X size={14} strokeWidth={2} />}>Discard</Button>
        </Row>
      </Section>
    </div>
  ),
};

// helper for the UseCases story (X icon inline since not imported above)
function X({ size = 16, strokeWidth = 2 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      width={size} height={size} aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// ─── Shared split-button action sets ──────────────────────────────────────────

const splitActionsBase = [
  { id: 'view',     label: 'View details',    icon: <FileText size={14} strokeWidth={1.75} /> },
  { id: 'download', label: 'Download PDF',    icon: <Download size={14} strokeWidth={1.75} /> },
  { id: 'copy',     label: 'Duplicate',       icon: <Plus size={14} strokeWidth={1.75} /> },
  { id: 'delete',   label: 'Delete record',   icon: <Trash2 size={14} strokeWidth={1.75} />, disabled: false },
];

// ─── 13. Split Button — All Variants ──────────────────────────────────────────

export const SplitButtonVariants = {
  name: '✂️ Split Button — All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Section label="Primary theme">
        <Row gap={16}>
          {['solid', 'outline', 'tonal', 'ghost'].map((variant) => (
            <TPSplitButton
              key={variant}
              variant={variant}
              theme="primary"
              primaryAction={{ label: variant.charAt(0).toUpperCase() + variant.slice(1), onClick: () => {} }}
              secondaryActions={splitActionsBase}
            />
          ))}
        </Row>
      </Section>
      <Section label="Neutral theme">
        <Row gap={16}>
          {['solid', 'outline', 'tonal', 'ghost'].map((variant) => (
            <TPSplitButton
              key={variant}
              variant={variant}
              theme="neutral"
              primaryAction={{ label: variant.charAt(0).toUpperCase() + variant.slice(1), onClick: () => {} }}
              secondaryActions={splitActionsBase}
            />
          ))}
        </Row>
      </Section>
      <Section label="Error theme">
        <Row gap={16}>
          {['solid', 'outline', 'tonal', 'ghost'].map((variant) => (
            <TPSplitButton
              key={variant}
              variant={variant}
              theme="error"
              primaryAction={{ label: variant.charAt(0).toUpperCase() + variant.slice(1), onClick: () => {} }}
              secondaryActions={splitActionsBase}
            />
          ))}
        </Row>
      </Section>
    </div>
  ),
};

// ─── 14. Split Button — Sizes ─────────────────────────────────────────────────

export const SplitButtonSizes = {
  name: '✂️ Split Button — Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {SIZES.map((size) => (
        <Section key={size} label={`Size: ${size.toUpperCase()}`}>
          <Row gap={16}>
            <TPSplitButton
              size={size}
              primaryAction={{ label: 'Save', onClick: () => {} }}
              secondaryActions={splitActionsBase}
            />
            <TPSplitButton
              size={size}
              variant="outline"
              primaryAction={{ label: 'Export', icon: <Download size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={1.75} />, onClick: () => {} }}
              secondaryActions={splitActionsBase}
            />
            <TPSplitButton
              size={size}
              variant="tonal"
              primaryAction={{ label: 'Schedule', onClick: () => {} }}
              secondaryActions={splitActionsBase}
            />
          </Row>
        </Section>
      ))}
    </div>
  ),
};

// ─── 15. Split Button — States ────────────────────────────────────────────────

export const SplitButtonStates = {
  name: '✂️ Split Button — States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section label="Default">
        <Row gap={16}>
          {['solid', 'outline', 'tonal', 'ghost'].map((variant) => (
            <TPSplitButton
              key={variant}
              variant={variant}
              primaryAction={{ label: 'Submit', onClick: () => {} }}
              secondaryActions={splitActionsBase}
            />
          ))}
        </Row>
      </Section>
      <Section label="Loading">
        <Row gap={16}>
          {['solid', 'outline', 'tonal'].map((variant) => (
            <TPSplitButton
              key={variant}
              variant={variant}
              loading
              primaryAction={{ label: 'Saving…', onClick: () => {} }}
              secondaryActions={splitActionsBase}
            />
          ))}
        </Row>
      </Section>
      <Section label="Disabled">
        <Row gap={16}>
          {['solid', 'outline', 'tonal', 'ghost'].map((variant) => (
            <TPSplitButton
              key={variant}
              variant={variant}
              disabled
              primaryAction={{ label: 'Submit', onClick: () => {} }}
              secondaryActions={splitActionsBase}
            />
          ))}
        </Row>
      </Section>
    </div>
  ),
};

// ─── 16. Split Button — Dark Surface ─────────────────────────────────────────

export const SplitButtonDark = {
  name: '✂️ Split Button — Dark Surface',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <DarkBox>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {['solid', 'outline', 'tonal', 'ghost'].map((variant) => (
          <Section key={variant} label={<span style={{ color: 'rgba(255,255,255,0.45)' }}>{variant}</span>}>
            <Row gap={16}>
              <TPSplitButton
                variant={variant}
                surface="dark"
                primaryAction={{ label: 'Save Report', onClick: () => {} }}
                secondaryActions={splitActionsBase}
              />
              <TPSplitButton
                variant={variant}
                surface="dark"
                theme="neutral"
                primaryAction={{ label: 'Neutral', onClick: () => {} }}
                secondaryActions={splitActionsBase}
              />
            </Row>
          </Section>
        ))}
      </div>
    </DarkBox>
  ),
};

// ─── 17. Split Button — Healthcare Use Cases ──────────────────────────────────

export const SplitButtonUseCases = {
  name: '✂️ Split Button — Healthcare Use Cases',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section label="Appointment actions">
        <Row gap={16}>
          <TPSplitButton
            primaryAction={{ label: 'Book Appointment', icon: <Plus size={16} strokeWidth={1.75} />, onClick: () => {} }}
            secondaryActions={[
              { id: 'walkin',    label: 'Walk-in',          icon: <Plus size={14} strokeWidth={1.75} /> },
              { id: 'telecall',  label: 'Teleconsultation',  icon: <FileText size={14} strokeWidth={1.75} /> },
              { id: 'followup',  label: 'Follow-up',         icon: <ChevronRight size={14} strokeWidth={1.75} /> },
            ]}
          />
          <TPSplitButton
            variant="outline"
            primaryAction={{ label: 'Export Records', icon: <Download size={16} strokeWidth={1.75} />, onClick: () => {} }}
            secondaryActions={[
              { id: 'pdf',   label: 'Export as PDF',  icon: <FileText size={14} strokeWidth={1.75} /> },
              { id: 'csv',   label: 'Export as CSV',  icon: <Download size={14} strokeWidth={1.75} /> },
              { id: 'print', label: 'Print',           icon: <FileText size={14} strokeWidth={1.75} /> },
            ]}
          />
        </Row>
      </Section>
      <Section label="Patient record actions">
        <Row gap={16}>
          <TPSplitButton
            variant="tonal"
            primaryAction={{ label: 'Save Changes', icon: <Check size={16} strokeWidth={1.75} />, onClick: () => {} }}
            secondaryActions={[
              { id: 'draft',  label: 'Save as Draft',  icon: <FileText size={14} strokeWidth={1.75} /> },
              { id: 'share',  label: 'Share with Team', icon: <Sparkles size={14} strokeWidth={1.75} /> },
              { id: 'delete', label: 'Discard',         icon: <Trash2 size={14} strokeWidth={1.75} /> },
            ]}
          />
          <TPSplitButton
            variant="ghost"
            theme="error"
            primaryAction={{ label: 'Archive Patient', icon: <Trash2 size={16} strokeWidth={1.75} />, onClick: () => {} }}
            secondaryActions={[
              { id: 'suspend', label: 'Suspend account', icon: <Trash2 size={14} strokeWidth={1.75} /> },
              { id: 'delete',  label: 'Permanently delete', icon: <Trash2 size={14} strokeWidth={1.75} /> },
            ]}
          />
        </Row>
      </Section>
    </div>
  ),
};
