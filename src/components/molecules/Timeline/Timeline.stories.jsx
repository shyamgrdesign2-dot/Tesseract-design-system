import { Timeline } from './index.js';

const meta = {
  title: 'Molecules/Timeline',
  component: Timeline,
  tags: ['autodocs', 'ai-generated'],
};

export default meta;

const baseItems = [
  {
    title: 'Appointment booked',
    description: 'Anita Sharma scheduled a cardiology consult.',
    timestamp: '09:12 AM',
    color: 'blue',
  },
  {
    title: 'Vitals recorded',
    description: 'BP 120/80, HR 72 bpm.',
    timestamp: '10:28 AM',
    color: 'success',
  },
  {
    title: 'Prescription issued',
    description: 'Atorvastatin 10mg, once daily.',
    timestamp: '10:45 AM',
    color: 'violet',
  },
  {
    title: 'Follow-up pending',
    description: 'Review in 4 weeks.',
    timestamp: '—',
    color: 'slate',
  },
];

export const Playground = {
  args: { items: baseItems },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Timeline {...args} />
    </div>
  ),
};

export const Colors = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline
        items={[
          { title: 'blue', timestamp: 'dot', color: 'blue' },
          { title: 'success', timestamp: 'dot', color: 'success' },
          { title: 'error', timestamp: 'dot', color: 'error' },
          { title: 'warning', timestamp: 'dot', color: 'warning' },
          { title: 'slate', timestamp: 'dot', color: 'slate' },
          { title: 'violet', timestamp: 'dot', color: 'violet' },
        ]}
      />
    </div>
  ),
};

export const WithIcons = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline
        items={[
          {
            title: 'Order placed',
            description: 'Lab tests requested.',
            timestamp: '08:00 AM',
            color: 'blue',
            icon: <span aria-hidden>📋</span>,
          },
          {
            title: 'Sample collected',
            timestamp: '08:30 AM',
            color: 'success',
            icon: <span aria-hidden>🧪</span>,
          },
          {
            title: 'Results ready',
            description: 'All values within range.',
            timestamp: '02:15 PM',
            color: 'violet',
            icon: <span aria-hidden>✔</span>,
          },
        ]}
      />
    </div>
  ),
};

export const TitleOnly = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline
        items={[
          { title: 'Step one' },
          { title: 'Step two' },
          { title: 'Step three' },
        ]}
      />
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Full clinical visit timeline — from check-in to discharge. */
export const ClinicalVisitTimeline = {
  name: '🏥 Clinical Visit Timeline',
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <Timeline
        items={[
          {
            title: 'Patient checked in',
            description: 'Rohan Sharma arrived at Apollo Clinic, Banjara Hills.',
            timestamp: '09:05 AM',
            color: 'blue',
          },
          {
            title: 'Vitals recorded',
            description: 'BP 148/92 mmHg · HR 88 bpm · SpO₂ 97% · Temp 98.4°F',
            timestamp: '09:18 AM',
            color: 'warning',
          },
          {
            title: 'Consultation — Dr. Ananya Mehta',
            description: 'Chief complaint: persistent chest discomfort for 3 days. ECG ordered.',
            timestamp: '09:45 AM',
            color: 'violet',
          },
          {
            title: 'Lab tests ordered',
            description: 'CBC, Lipid panel, Troponin I, BNP.',
            timestamp: '10:10 AM',
            color: 'blue',
          },
          {
            title: 'Results received',
            description: 'Troponin I: 0.04 ng/mL (borderline). Cardiologist review advised.',
            timestamp: '11:30 AM',
            color: 'error',
          },
          {
            title: 'Prescription issued',
            description: 'Aspirin 75mg OD · Atorvastatin 40mg OD · follow-up in 7 days.',
            timestamp: '11:55 AM',
            color: 'success',
          },
          {
            title: 'Follow-up scheduled',
            description: '2 Jun 2026, 10:30 AM — Cardiology, Apollo Clinic.',
            timestamp: '12:01 PM',
            color: 'slate',
          },
        ]}
      />
    </div>
  ),
};

/** Prescription lifecycle — from issue to refill. */
export const PrescriptionLifecycle = {
  name: '💊 Prescription Lifecycle',
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline
        items={[
          {
            title: 'Prescription issued',
            description: 'Amlodipine 5mg, 30-day supply.',
            timestamp: '15 May 2026',
            color: 'success',
          },
          {
            title: 'Sent to pharmacy',
            description: 'Apollo Pharmacy, Banjara Hills — e-prescription delivered.',
            timestamp: '15 May 2026',
            color: 'blue',
          },
          {
            title: 'Dispensed',
            description: 'Collected by patient or carer.',
            timestamp: '16 May 2026',
            color: 'violet',
          },
          {
            title: 'Refill reminder sent',
            description: 'SMS reminder sent: 7 days of supply remaining.',
            timestamp: '8 Jun 2026',
            color: 'warning',
          },
          {
            title: 'Refill requested',
            description: 'Patient requested refill via app.',
            timestamp: '10 Jun 2026',
            color: 'blue',
          },
          {
            title: 'Awaiting doctor approval',
            description: 'Refill pending review by Dr. Ananya Mehta.',
            timestamp: '—',
            color: 'slate',
          },
        ]}
      />
    </div>
  ),
};

/** Compact audit log for a patient record change history. */
export const AuditLog = {
  name: '📋 Record Audit Log',
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Timeline
        items={[
          { title: 'Record created', description: 'Created by Dr. Mehta.', timestamp: '1 Jan 2025 · 09:00', color: 'blue' },
          { title: 'Mobile number updated', description: 'Changed from +91 98xxx to +91 99xxx.', timestamp: '4 Mar 2025 · 14:22', color: 'slate' },
          { title: 'Insurance info added', description: 'Cigna Health policy #CH-2024-8821 linked.', timestamp: '10 Apr 2025 · 11:05', color: 'success' },
          { title: 'Allergy flagged', description: 'Penicillin allergy recorded.', timestamp: '2 May 2026 · 16:45', color: 'error' },
          { title: 'Record exported', description: 'FHIR export by Dr. Rao for specialist referral.', timestamp: '20 May 2026 · 09:30', color: 'violet' },
        ]}
      />
    </div>
  ),
};
