import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

const meta = {
  title: 'Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean' },
  },
  args: {
    type: 'single',
    collapsible: true,
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

export const Playground = {
  args: { defaultValue: 'item-1' },
  render: (args) => (
    <Frame>
      <Accordion {...args}>
        {items.map((it) => (
          <AccordionItem key={it.value} value={it.value}>
            <AccordionTrigger>{it.title}</AccordionTrigger>
            <AccordionContent>{it.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Frame>
  ),
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
        <p style={{ fontSize: 12, color: 'var(--tp-slate-500, #717179)' }}>
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
                  <span style={{ color: '#717179' }}>{med.freq} · Since {med.since}</span>
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
