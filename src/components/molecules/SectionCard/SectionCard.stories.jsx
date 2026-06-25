import { SectionCard } from './SectionCard';
import { Timeline, TimelineItem } from '../Timeline/Timeline';
import { Button } from '../../atoms/Button/Button';
import { InputBox } from '../../atoms/Input/InputBox';
import { Badge } from '../../atoms/Badge/Badge';
import { TPLibraryIcon } from '../../atoms/icons/tp/TPLibraryIcon';

const TOOLS = [
  { icon: 'grid-5', title: 'Templates' },
  { icon: 'ram', title: 'Save as template' },
  { icon: 'eraser', title: 'Clear', danger: true },
];

const meta = {
  title: 'Molecules/SectionCard',
  component: SectionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A generic container shell: a card with an optional header, arbitrary body content, and an optional footer. Each band can be collapsed, recoloured, and filled with anything (a table, inputs, or a mix).',
          '',
          '**When to use** — rxpad sections, multi-section forms (e.g. patient: Personal · Additional · Address), grouped settings, dashboard blocks. Anywhere you need a titled, optionally-collapsible block with consistent chrome.',
          '',
          '**Key props** — `title`/`subtitle`/`icon`; `headerActions` + `footer` for CTAs; `collapsible` (collapsing hides the body, header + footer stay); `surface` or per-band `headerBg`/`bodyBg`/`footerBg`; `bordered`, `divided`, `radius`, `padding`. The body is whatever you pass as `children`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    icon: { control: 'text', description: 'Icon name (string) or ReactNode' },
    iconColor: { control: 'color' },
    collapsible: { control: 'boolean' },
    defaultCollapsed: { control: 'boolean' },
    bordered: { control: 'boolean' },
    divided: { control: 'boolean' },
    footerAlign: { control: 'inline-radio', options: ['start', 'between', 'end'] },
    radius: { control: 'select', options: ['sharp', 8, 12, 16, 'pill'] },
    padding: { control: 'number' },
    surface: { control: 'color', description: 'One background for all bands' },
    headerBg: { control: 'color' },
    bodyBg: { control: 'color' },
    footerBg: { control: 'color' },
    onCollapsedChange: { control: false, table: { category: 'Events' } },
  },
  args: {
    title: 'Personal details',
    subtitle: 'Basic information about the patient',
    icon: 'user',
    iconColor: 'var(--tesseract-blue-500)',
    collapsible: true,
    defaultCollapsed: false,
    bordered: true,
    divided: true,
    footerAlign: 'end',
  },
};
export default meta;

const FieldGrid = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>{children}</div>
);

export const Playground = {
  render: (a) => (
    <SectionCard
      {...a}
      headerActions={<Badge variant="soft" color="primary" size="sm">3 fields</Badge>}
      footer={<><Button variant="ghost" theme="neutral" size="sm">Cancel</Button><Button size="sm">Save</Button></>}
    >
      <FieldGrid>
        <InputBox label="First name" placeholder="Jane" fullWidth />
        <InputBox label="Last name" placeholder="Doe" fullWidth />
        <InputBox label="Date of birth" placeholder="DD / MM / YYYY" fullWidth />
        <InputBox label="Phone" placeholder="+91" fullWidth />
      </FieldGrid>
    </SectionCard>
  ),
};

/** A multi-section form — the headline use case (patient intake). */
export const MultiSectionForm = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <SectionCard title="Personal details" icon="user" iconColor="var(--tesseract-blue-500)" collapsible
        footer={<Button size="sm">Save</Button>}>
        <FieldGrid>
          <InputBox label="First name" placeholder="Jane" fullWidth />
          <InputBox label="Last name" placeholder="Doe" fullWidth />
        </FieldGrid>
      </SectionCard>
      <SectionCard title="Additional details" icon="note" iconColor="var(--tesseract-violet-500)" collapsible defaultCollapsed>
        <FieldGrid>
          <InputBox label="Blood group" placeholder="O+" fullWidth />
          <InputBox label="Occupation" placeholder="—" fullWidth />
        </FieldGrid>
      </SectionCard>
      <SectionCard title="Address" icon="location" iconColor="var(--tesseract-success-600)" collapsible defaultCollapsed>
        <InputBox label="Street" placeholder="221B Baker Street" fullWidth />
      </SectionCard>
    </div>
  ),
};

/** Per-band backgrounds — header, body and footer can differ. */
export const SegmentedBackgrounds = {
  render: () => (
    <SectionCard
      title="Vitals"
      icon="heart"
      iconColor="var(--tesseract-error-500)"
      headerBg="var(--tesseract-slate-50)"
      footerBg="var(--tesseract-slate-50)"
      headerActions={<Badge variant="soft" color="error" size="sm">Review</Badge>}
      footer={<><Button variant="ghost" theme="neutral" size="sm">Discard</Button><Button theme="error" size="sm">Flag</Button></>}
    >
      <p style={{ margin: 0, color: 'var(--tesseract-slate-600)', font: '14px var(--tesseract-font-body)' }}>
        BP 148/96 · HR 88 · SpO₂ 97%
      </p>
    </SectionCard>
  ),
};

/** Header search + chips body (rxpad-style usage). */
export const WithHeaderSearch = {
  render: () => (
    <SectionCard
      title="Symptoms"
      icon="virus"
      iconColor="var(--tesseract-violet-500)"
      collapsible
      headerExtra={<InputBox fullWidth leftIcon={<TPLibraryIcon name="search-normal-1" variant="linear" size={18} />} placeholder="Search & add symptoms" />}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {['Fever', 'Cough', 'Fatigue', 'Headache'].map((s) => (
          <Button key={s} variant="tonal" theme="neutral" size="sm">{s}</Button>
        ))}
      </div>
    </SectionCard>
  ),
};

/** Plan cluster — an outer tinted shell holding nested inner cards (number chip,
 *  amount pill, tone gradient header). The dental Plan-Estimates pattern. */
export const PlanCluster = {
  render: () => (
    <SectionCard
      title="Plan Estimates"
      amount="₹20,000"
      icon="document-text"
      tone="primary"
      headerGradient
      bodyBg="var(--tesseract-slate-50)"
      headerActions={<Button size="sm" leftIcon={<TPLibraryIcon name="add" variant="linear" size={18} />}>Create Plan</Button>}
    >
      <SectionCard
        number={1}
        title="Wisdom Tooth Removal"
        amount="₹20,000"
        tone="primary"
        collapsible
        headerActions={<Button variant="outline" theme="success" size="sm">Activate Plan</Button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, font: '13px var(--tesseract-font-body)', color: 'var(--tesseract-slate-700)' }}>
          {['T18', 'T28', 'T38', 'T48'].map((t) => (
            <div key={t} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Wisdom Tooth Removal · {t}</span><strong>₹5,000</strong>
            </div>
          ))}
        </div>
      </SectionCard>
    </SectionCard>
  ),
};

/** In-progress plan with a visit Timeline nested in the body (tone="active"). */
export const WithTimeline = {
  render: () => (
    <SectionCard title="Primary Care Plan" amount="₹11,500" icon="health" tone="active" headerGradient
      headerActions={<Button theme="success" size="sm" leftIcon={<TPLibraryIcon name="tick-circle" variant="linear" size={18} />}>End Plan</Button>}>
      <SectionCard number={1} title="Root Canal Treatment" subtitle="Lower Left First Molar (T36)" tone="active" tools={TOOLS} collapsible>
        <Timeline tone="violet">
          <TimelineItem title="Dr. Sheela B R" date="10 Apr 2026"
            action={<Button variant="tonal" theme="neutral" size="sm" leftIcon={<TPLibraryIcon name="document-text" variant="linear" size={14} />}>View Rx</Button>}>
            <strong>Clinical Notes:</strong> Canal shaping + obturation completed
          </TimelineItem>
          <TimelineItem title="Dr. Sheela B R" date="3 Apr 2026"
            action={<Button variant="tonal" theme="neutral" size="sm" leftIcon={<TPLibraryIcon name="document-text" variant="linear" size={14} />}>View Rx</Button>}>
            <strong>Clinical Notes:</strong> Initial debridement, access opening, BMP placed
          </TimelineItem>
          <TimelineItem title="Dr. Riya Kapoor" date="1 Apr 2026" muted>
            <strong>Clinical Notes:</strong> Patient rescheduled — no treatment performed.
          </TimelineItem>
        </Timeline>
      </SectionCard>
    </SectionCard>
  ),
};

/** Non-collapsible, borderless on a tinted page. */
export const Plain = {
  render: () => (
    <SectionCard title="Notes" bordered={false} surface="var(--tesseract-slate-50)">
      <p style={{ margin: 0, color: 'var(--tesseract-slate-600)', font: '14px var(--tesseract-font-body)' }}>
        Patient reports improvement since last visit.
      </p>
    </SectionCard>
  ),
};
