import { MedicalIcon } from './MedicalIcon';

const VARIANTS = ['linear', 'bulk', 'bold'];
const SAMPLE = ['ambulance', 'brain', 'cardiogram', 'dna', 'first-aid', 'health-care'];

const meta = {
  title: 'Atoms/MedicalIcon',
  component: MedicalIcon,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A thin wrapper over `TPLibraryIcon` that defaults `family="medical"`, so clinical glyphs resolve by short name.',
          '',
          '**When to use** — reaching for a medical glyph (ambulance, cardiogram, dna, first-aid) where you want the curated medical subset resolved first.',
          '**When not** — a general UI glyph is `TPIcon` / `TPLibraryIcon` directly; a configurable icon SLOT inside another component should use that component\'s `tpIcon` prop, not a nested MedicalIcon.',
          '',
          '**Key props** — `name` (resolved against the medical subset, then the full library); `variant` linear / bulk / bold (legacy `line`/`solid` accepted); `size` in px; `color` overrides the inherited `currentColor`; `family` overrides the `medical` default so it doubles as a general alias; `alt` sets an a11y label.',
          '',
          '**Good to know** — extra props (onClick, aria-*, data-*, style) pass straight through to the underlying icon, so it can act as a button. Leave `alt` blank for purely decorative glyphs; set it (→ `role="img"`) when the icon carries meaning.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    name: { control: 'text', tpIcon: true, description: 'Icon name (resolved against the medical subset, then the full library)', table: { category: 'Content' } },
    variant: { control: 'inline-radio', options: VARIANTS, description: 'Icon style (legacy "line"/"solid" also accepted)', table: { category: 'Content' } },
    size: { control: { type: 'range', min: 12, max: 96, step: 2 }, table: { category: 'Layout' } },
    color: { control: 'color', description: 'Override fill (blank = inherit currentColor)', table: { category: 'Layout' } },
    family: { control: 'text', description: 'Icon family — defaults to "medical"; override to address any family (general icon alias)', table: { category: 'Content' } },
    alt: { control: 'text', description: 'Accessible label (sets role="img"); blank = decorative', table: { category: 'Accessibility' } },
  },
  args: {
    name: 'ambulance',
    variant: 'linear',
    size: 32,
    color: '',
    family: 'medical',
    alt: '',
  },
};

export default meta;

// Strip blank/default fields so the snippet matches what a consumer would write.
const medicalIconCode = ({ name, variant = 'linear', size = 24, color, family, alt }) => {
  const lines = [`  name="${name}"`];
  if (variant && variant !== 'linear') lines.push(`  variant="${variant}"`);
  if (size != null && size !== 24) lines.push(`  size={${size}}`);
  if (color) lines.push(`  color="${color}"`);
  if (family && family !== 'medical') lines.push(`  family="${family}"`);
  if (alt) lines.push(`  alt="${alt}"`);
  return `<MedicalIcon\n${lines.join('\n')}\n/>`;
};

// Coerce blank string controls back to undefined so defaults are preserved.
const clean = ({ color, family, alt, ...args }) => ({
  ...args,
  color: color || undefined,
  family: family || undefined,
  alt: alt || undefined,
});

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', color: 'var(--tesseract-slate-700, #3f3f46)' }}>
    {children}
  </div>
);

export const Playground = {
  render: (args) => <MedicalIcon {...clean(args)} />,
  parameters: { docs: { source: { transform: (_code, ctx) => medicalIconCode(ctx.args) } } },
};

/** The three icon styles. */
export const Variants = {
  render: (args) => (
    <Row>
      {VARIANTS.map((variant) => (
        <MedicalIcon key={variant} {...clean(args)} variant={variant} alt={variant} />
      ))}
    </Row>
  ),
};

/** A sample of the curated medical subset. */
export const Gallery = {
  render: (args) => (
    <Row>
      {SAMPLE.map((name) => (
        <MedicalIcon key={name} {...clean(args)} name={name} alt={name} />
      ))}
    </Row>
  ),
};

/**
 * Interactive — extra props (onClick, aria-*, data-*) now reach the icon, so it
 * can act as a button. Click to toggle the color.
 */
export const Interactive = {
  render: (args) => (
    <Row>
      <MedicalIcon
        {...clean(args)}
        name="health-care"
        size={40}
        alt="Toggle"
        role="button"
        tabIndex={0}
        data-testid="medical-icon-button"
        style={{ cursor: 'pointer' }}
        onClick={() => window.alert('MedicalIcon onClick fired — props now pass through')}
      />
    </Row>
  ),
};

/** `family` override — the medical default can be swapped to any other family. */
export const FamilyOverride = {
  render: (args) => <MedicalIcon {...clean(args)} family="" name="home" alt="home" />,
};
