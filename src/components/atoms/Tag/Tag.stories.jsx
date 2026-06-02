import { Tag } from './index.js';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const COLORS = ['blue', 'violet', 'amber', 'success', 'error', 'warning', 'slate'];
const VARIANTS = ['light', 'medium', 'filled', 'outline'];
const SIZES = ['sm', 'md', 'lg'];
const ICON_PX = { sm: 12, md: 14, lg: 16 };

const meta = {
  title: 'Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', name: 'label', table: { category: 'Content' } },
    color: { control: 'select', options: COLORS, table: { category: 'Style' } },
    variant: { control: 'select', options: VARIANTS, table: { category: 'Style' } },
    size: { control: 'inline-radio', options: SIZES, table: { category: 'Style' } },
    leftIconName: { control: 'text', tpIcon: true, name: 'left icon', description: 'TP icon before the label', table: { category: 'Icons' } },
    rightIconName: { control: 'text', tpIcon: true, name: 'right icon', description: 'TP icon after the label', table: { category: 'Icons' } },
    removable: { control: 'boolean', name: 'with dismiss (×)', table: { category: 'State' } },
  },
  args: {
    children: 'Tag',
    color: 'blue',
    variant: 'light',
    size: 'md',
    leftIconName: '',
    rightIconName: '',
    removable: false,
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground = {
  render: ({ leftIconName, rightIconName, removable, ...args }) => {
    const px = ICON_PX[args.size] || 14;
    return (
      <Tag
        {...args}
        icon={leftIconName ? <TPLibraryIcon name={leftIconName} size={px} /> : undefined}
        iconRight={rightIconName ? <TPLibraryIcon name={rightIconName} size={px} /> : undefined}
        onRemove={removable ? () => {} : undefined}
      />
    );
  },
};

export const Colors = {
  render: (args) => (
    <Row>
      {COLORS.map((color) => (
        <Tag key={color} {...args} color={color}>
          {color}
        </Tag>
      ))}
    </Row>
  ),
};

export const Variants = {
  render: (args) => (
    <Row>
      {VARIANTS.map((variant) => (
        <Tag key={variant} {...args} variant={variant}>
          {variant}
        </Tag>
      ))}
    </Row>
  ),
};

export const Sizes = {
  render: (args) => (
    <Row>
      {SIZES.map((size) => (
        <Tag key={size} {...args} size={size}>
          {size}
        </Tag>
      ))}
    </Row>
  ),
};

export const WithIcon = {
  render: (args) => (
    <Tag {...args} color="success" icon={<span aria-hidden>★</span>}>
      Featured
    </Tag>
  ),
};

export const Removable = {
  render: (args) => (
    <Row>
      {COLORS.map((color) => (
        <Tag key={color} {...args} color={color} onRemove={() => {}}>
          {color}
        </Tag>
      ))}
    </Row>
  ),
};

export const Matrix = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 8 }}>
          <strong style={{ fontSize: 12, color: 'var(--tp-slate-500, #54545C)' }}>
            {variant}
          </strong>
          <Row>
            {COLORS.map((color) => (
              <Tag key={color} variant={variant} color={color}>
                {color}
              </Tag>
            ))}
          </Row>
        </div>
      ))}
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Diagnosis tags on a patient record — ICD-10 categories. */
export const DiagnosisTags = {
  name: '🩺 Diagnosis Tags',
  render: (args) => (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#54545C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active diagnoses — Rohan Sharma</div>
      <Row>
        <Tag {...args} color="error" variant="light">Hypertension (I10)</Tag>
        <Tag {...args} color="amber" variant="light">Type 2 Diabetes (E11)</Tag>
        <Tag {...args} color="warning" variant="light">Dyslipidaemia (E78.5)</Tag>
        <Tag {...args} color="blue" variant="light">Coronary artery disease (I25.1)</Tag>
        <Tag {...args} color="slate" variant="outline">Allergy: Penicillin</Tag>
      </Row>
    </div>
  ),
};

/** Department and specialty tags for provider profiles. */
export const SpecialtyTags = {
  name: '🏥 Specialties',
  render: (args) => (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#54545C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dr. Ananya Mehta</div>
      <Row>
        <Tag {...args} color="blue" variant="filled" size="sm">Cardiology</Tag>
        <Tag {...args} color="violet" variant="filled" size="sm">Interventional</Tag>
        <Tag {...args} color="blue" variant="light" size="sm">Heart Failure</Tag>
        <Tag {...args} color="slate" variant="light" size="sm">Echocardiography</Tag>
      </Row>
    </div>
  ),
};

/** Prescription status tags in a medication table. */
export const PrescriptionStatus = {
  name: '💊 Prescription Status',
  render: (args) => {
    const meds = [
      { name: 'Amlodipine 5mg', status: 'Active', color: 'success' },
      { name: 'Metformin 500mg', status: 'Active', color: 'success' },
      { name: 'Aspirin 75mg', status: 'Refill due', color: 'amber' },
      { name: 'Simvastatin 20mg', status: 'Discontinued', color: 'slate' },
      { name: 'Lisinopril 10mg', status: 'On hold', color: 'error' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'Inter, sans-serif' }}>
        {meds.map((m) => (
          <div key={m.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', border: '1px solid #E2E2EA', borderRadius: 8 }}>
            <span style={{ fontSize: 13, color: '#454551' }}>{m.name}</span>
            <Tag {...args} color={m.color} variant="light" size="sm">{m.status}</Tag>
          </div>
        ))}
      </div>
    );
  },
};
