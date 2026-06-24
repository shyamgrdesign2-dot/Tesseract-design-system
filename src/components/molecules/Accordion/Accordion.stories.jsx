import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean' },
    itemIcon: { control: 'text', tpIcon: true, name: 'item icon', description: 'Tesseract icon shown before each item title' },
    // ── Disclosure indicator (root defaults; can be overridden per-trigger) ──
    expandIcon: { control: 'text', tpIcon: true, name: 'expand icon', description: 'CDN icon name for the disclosure indicator (rotates on open)', table: { category: 'Indicator' } },
    iconPosition: { control: 'inline-radio', options: ['right', 'left'], name: 'icon position', description: 'Which side the indicator sits on', table: { category: 'Indicator' } },
    // ── Layout ──
    density: { control: 'inline-radio', options: ['comfortable', 'compact'], description: 'Row padding + font scale', table: { category: 'Layout' } },
  },
  args: {
    type: 'single',
    collapsible: true,
    itemIcon: 'info-circle-pro',
    expandIcon: 'chevron-down',
    iconPosition: 'right',
    density: 'comfortable',
  },
};

export default meta;

const Frame = ({ children }) => (
  <div style={{ maxWidth: 520, display: 'grid', gap: 4 }}>{children}</div>
);

const items = [
  {
    value: 'item-1',
    title: 'What is TatvaPractice?',
    body: 'TatvaPractice is a clinical workflow platform for outpatient care teams.',
  },
  {
    value: 'item-2',
    title: 'How do appointments sync?',
    body: 'Appointments sync in real time across web and mobile clients.',
  },
  {
    value: 'item-3',
    title: 'Is my data secure?',
    body: 'All patient data is encrypted at rest and in transit.',
  },
];

// Build an accurate "Show code" snippet from the controls. Defaults
// (chevron-down / right / comfortable) are omitted so the output stays clean.
const accordionCode = ({ type = 'single', collapsible, expandIcon, iconPosition, density } = {}) => {
  const root = [`  type="${type}"`];
  if (collapsible) root.push('  collapsible');
  if (expandIcon && expandIcon !== 'chevron-down') root.push(`  expandIcon="${expandIcon}"`);
  if (iconPosition && iconPosition !== 'right') root.push(`  iconPosition="${iconPosition}"`);
  if (density && density !== 'comfortable') root.push(`  density="${density}"`);
  return [
    `<Accordion`,
    root.join('\n'),
    `>`,
    `  <AccordionItem value="item-1">`,
    `    <AccordionTrigger>What is TatvaPractice?</AccordionTrigger>`,
    `    <AccordionContent>…</AccordionContent>`,
    `  </AccordionItem>`,
    `</Accordion>`,
  ].join('\n');
};

export const Playground = {
  args: { defaultValue: 'item-1' },
  render: ({ itemIcon, ...args }) => (
    <Frame>
      <Accordion {...args}>
        {items.map((it) => (
          <AccordionItem key={it.value} value={it.value}>
            <AccordionTrigger>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                {itemIcon ? <TPLibraryIcon name={itemIcon} size={18} /> : null}
                {it.title}
              </span>
            </AccordionTrigger>
            <AccordionContent>{it.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Frame>
  ),
  parameters: { docs: { source: { transform: (_code, ctx) => accordionCode(ctx.args) } } },
};

export const SingleCollapsible = {
  args: { type: 'single', collapsible: true, defaultValue: 'item-1' },
  render: Playground.render,
};

export const Multiple = {
  args: { type: 'multiple', defaultValue: ['item-1', 'item-2'] },
  render: Playground.render,
};

export const NonCollapsibleSingle = {
  args: { type: 'single', collapsible: false, defaultValue: 'item-1' },
  render: Playground.render,
};

/** Indicator on the left, with a custom expand icon set on the root. */
export const IconLeft = {
  args: { iconPosition: 'left', expandIcon: 'arrow-down-01', defaultValue: 'item-1' },
  render: Playground.render,
};

/** Compact density — tighter rows + smaller type for dense panels. */
export const Compact = {
  args: { density: 'compact', defaultValue: 'item-1' },
  render: Playground.render,
};

/** A disabled item is dimmed and can't be toggled; siblings still work. */
export const DisabledItem = {
  render: () => (
    <Frame>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is TatvaPractice?</AccordionTrigger>
          <AccordionContent>{items[0].body}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>How do appointments sync? (coming soon)</AccordionTrigger>
          <AccordionContent>{items[1].body}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is my data secure?</AccordionTrigger>
          <AccordionContent>{items[2].body}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Frame>
  ),
};

/** Custom heading level for a11y — each trigger wraps in an h2 instead of h3. */
export const CustomHeadingLevel = {
  render: () => (
    <Frame>
      <Accordion type="single" collapsible defaultValue="item-1">
        {items.map((it) => (
          <AccordionItem key={it.value} value={it.value}>
            <AccordionTrigger headingLevel={2}>{it.title}</AccordionTrigger>
            <AccordionContent>{it.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Frame>
  ),
};

export const Controlled = {
  render: () => {
    const [value, setValue] = React.useState('item-2');
    return (
      <Frame>
        <Accordion type="single" collapsible value={value} onValueChange={setValue}>
          {items.map((it) => (
            <AccordionItem key={it.value} value={it.value}>
              <AccordionTrigger>{it.title}</AccordionTrigger>
              <AccordionContent>{it.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #54545C)' }}>
          Open item: {value || '(none)'}
        </p>
      </Frame>
    );
  },
};

// ─── Healthcare use cases ──────────────────────────────────────────────────────

export const PatientMedicalHistory = {
  name: '🏥 Patient Medical History',
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion type="single" collapsible defaultValue="current">
        <AccordionItem value="current">
          <AccordionTrigger>Current Medications (4)</AccordionTrigger>
          <AccordionContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Amlodipine 5mg', freq: 'Once daily', since: 'Jan 2026' },
                { name: 'Atorvastatin 10mg', freq: 'Once daily (night)', since: 'Jan 2026' },
                { name: 'Metformin 500mg', freq: 'Twice daily', since: 'Mar 2025' },
                { name: 'Aspirin 75mg', freq: 'Once daily', since: 'Jun 2024' },
              ].map((med) => (
                <div key={med.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #F1F1F5' }}>
                  <span style={{ fontWeight: 600, color: '#171725' }}>{med.name}</span>
                  <span style={{ color: '#54545C' }}>{med.freq} · Since {med.since}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="allergies">
          <AccordionTrigger>Known Allergies (2)</AccordionTrigger>
          <AccordionContent>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Penicillin', 'Sulfa drugs'].map((a) => (
                <span key={a} style={{ background: '#FFF1F2', color: '#E11D48', border: '1px solid #FECDD3', borderRadius: 6, padding: '3px 10px', fontSize: 13, fontWeight: 600 }}>
                  {a}
                </span>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="diagnoses">
          <AccordionTrigger>Past Diagnoses (3)</AccordionTrigger>
          <AccordionContent>
            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13, color: '#454551', lineHeight: 2 }}>
              <li>Type 2 Diabetes Mellitus — diagnosed Mar 2025</li>
              <li>Essential Hypertension — diagnosed Jan 2026</li>
              <li>Hyperlipidaemia — diagnosed Jan 2026</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="surgical">
          <AccordionTrigger>Surgical History (1)</AccordionTrigger>
          <AccordionContent>
            <p style={{ margin: 0, fontSize: 13, color: '#454551' }}>
              Appendectomy — Apollo Hospitals, Hyderabad — April 2019. No complications.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="family">
          <AccordionTrigger>Family History</AccordionTrigger>
          <AccordionContent>
            <div style={{ fontSize: 13, color: '#454551', lineHeight: 1.8 }}>
              <div><strong>Father:</strong> Hypertension, Type 2 Diabetes</div>
              <div><strong>Mother:</strong> Thyroid disorder</div>
              <div><strong>Siblings:</strong> No significant history</div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const FAQAccordion = {
  name: '❓ FAQ — Multiple open',
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion type="multiple" defaultValue={['q1', 'q3']}>
        {[
          { id: 'q1', q: 'How do I schedule an appointment?', a: 'Go to Appointments → New Appointment. Select the patient, doctor, date, and time slot. Confirm to create the booking.' },
          { id: 'q2', q: 'Can I access records on mobile?', a: 'Yes. TatvaPractice is fully responsive and available as a progressive web app on iOS and Android.' },
          { id: 'q3', q: 'How is patient data protected?', a: 'All data is encrypted with AES-256 at rest and TLS 1.3 in transit. We are HIPAA and ABDM compliant.' },
          { id: 'q4', q: 'What happens if there is a network issue?', a: 'The app stores work locally and syncs automatically when connectivity is restored. No data is lost offline.' },
        ].map(({ id, q, a }) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

// ── Additional healthcare scenarios ──────────────────────────────────────────

/** SOAP clinical note — each section expands to show structured note content. */
export const SOAPClinicalNote = {
  name: '📋 SOAP Clinical Note',
  render: () => (
    <div style={{ maxWidth: 560, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#171725' }}>Visit Note — 27 May 2026</span>
        <span style={{ fontSize: 12, color: '#54545C', marginLeft: 8 }}>Dr. Ananya Mehta · Rohan Sharma</span>
      </div>
      <Accordion type="multiple" defaultValue={['subjective']}>
        <AccordionItem value="subjective">
          <AccordionTrigger>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#EEF0FF', color: '#4B4AD5' }}>S</span>
              Subjective — Chief Complaint & History
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#171725', fontSize: 14, lineHeight: 1.6 }}>
              <div><strong>Chief complaint:</strong> Persistent headache and mild dizziness for 3 days.</div>
              <div><strong>History of present illness:</strong> Patient reports bilateral throbbing headache, 6/10 severity, worse in the morning. Denies nausea, vomiting, vision changes, or neurological symptoms. No fever or neck stiffness.</div>
              <div><strong>Current medications:</strong> Amlodipine 5 mg OD, Atorvastatin 40 mg OD, Aspirin 75 mg OD.</div>
              <div><strong>Allergies:</strong> Penicillin (rash), Sulfa drugs.</div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="objective">
          <AccordionTrigger>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#FEF3C7', color: '#92400E' }}>O</span>
              Objective — Examination Findings
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
              {[['BP', '142/92 mmHg ↑'], ['HR', '84 bpm'], ['SpO₂', '98%'], ['Temp', '37.2°C'], ['Weight', '72 kg'], ['RR', '16/min']].map(([k, v]) => (
                <div key={k} style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E2EA' }}>
                  <div style={{ fontSize: 11, color: '#54545C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: k === 'BP' ? '#92400E' : '#171725', marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="assessment">
          <AccordionTrigger>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#DCFCE7', color: '#15803D' }}>A</span>
              Assessment — Diagnosis
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ background: '#EEF0FF', color: '#4B4AD5', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', marginTop: 2 }}>ICD-10</span>
                <div><strong>I10</strong> — Essential (primary) hypertension — <em>Stage 1, uncontrolled</em></div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ background: '#EEF0FF', color: '#4B4AD5', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', marginTop: 2 }}>ICD-10</span>
                <div><strong>G43.909</strong> — Migraine, unspecified, not intractable</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="plan">
          <AccordionTrigger>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#FCE7F3', color: '#BE185D' }}>P</span>
              Plan — Treatment & Follow-up
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div><strong>Medications:</strong> Increase Amlodipine to 10 mg OD. Add Losartan 50 mg OD. Continue existing Rx.</div>
              <div><strong>Investigations:</strong> Repeat lipid profile, renal function test, serum electrolytes.</div>
              <div><strong>Lifestyle:</strong> Restrict sodium to &lt;2 g/day. 30 min moderate exercise 5×/week. Reduce caffeine.</div>
              <div><strong>Follow-up:</strong> Review in 2 weeks with BP diary. Emergency visit if BP &gt; 160/100.</div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

/** Medication history grouped by status — active, discontinued, and allergies. */
export const MedicationHistory = {
  name: '💊 Medication History',
  render: () => (
    <div style={{ maxWidth: 540, fontFamily: 'Inter, sans-serif' }}>
      <Accordion type="multiple" defaultValue={['active']}>
        <AccordionItem value="active">
          <AccordionTrigger>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              Active Medications
              <span style={{ fontSize: 11, fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 99 }}>3</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {[
              { drug: 'Amlodipine 5 mg', freq: 'Once daily', since: 'Apr 2025', note: 'BP control' },
              { drug: 'Atorvastatin 40 mg', freq: 'Once daily at night', since: 'Apr 2025', note: 'Lipid management' },
              { drug: 'Aspirin 75 mg', freq: 'Once daily with food', since: 'Apr 2025', note: 'Antiplatelet' },
            ].map(({ drug, freq, since, note }) => (
              <div key={drug} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F6', fontSize: 14 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#171725' }}>{drug}</div>
                  <div style={{ fontSize: 12, color: '#54545C' }}>{freq} · Since {since}</div>
                </div>
                <div style={{ fontSize: 12, color: '#54545C', textAlign: 'right' }}>{note}</div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="discontinued">
          <AccordionTrigger>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              Discontinued
              <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#64748B', padding: '2px 8px', borderRadius: 99 }}>2</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {[
              { drug: 'Metoprolol 25 mg', freq: 'Twice daily', stopped: 'Jan 2026', reason: 'Bradycardia' },
              { drug: 'Ramipril 5 mg', freq: 'Once daily', stopped: 'Mar 2026', reason: 'Persistent cough' },
            ].map(({ drug, stopped, reason }) => (
              <div key={drug} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F6', fontSize: 14 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#54545C', textDecoration: 'line-through' }}>{drug}</div>
                  <div style={{ fontSize: 12, color: '#8F8FA0' }}>Stopped {stopped} · {reason}</div>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="allergies">
          <AccordionTrigger>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              Allergies & Intolerances
              <span style={{ fontSize: 11, fontWeight: 700, background: '#FFE4E6', color: '#9F1239', padding: '2px 8px', borderRadius: 99 }}>2</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {[
              { allergen: 'Penicillin', reaction: 'Urticaria (skin rash)', severity: 'Moderate' },
              { allergen: 'Sulfa drugs', reaction: 'Angioedema', severity: 'Severe' },
            ].map(({ allergen, reaction, severity }) => (
              <div key={allergen} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #F0F0F6', fontSize: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#9F1239' }}>{allergen}</div>
                  <div style={{ fontSize: 12, color: '#54545C' }}>{reaction} · <strong>{severity}</strong></div>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
