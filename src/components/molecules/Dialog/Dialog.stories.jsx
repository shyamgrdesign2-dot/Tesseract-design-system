import React from 'react';
import { Dialog } from './Dialog';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/Dialog',
  component: Dialog,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    width: { control: 'select', options: ['default', 'sm', 'md', 'lg'] },
    title: { control: 'text' },
    description: { control: 'text' },
    open: { control: 'boolean' },
  },
  args: {
    title: 'Dialog title',
    description: 'A short supporting description explaining the dialog.',
    width: 'default',
  },
};

export default meta;

/** Triggered: closed until the button is clicked. */
export const Playground = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          footer={
            <>
              <Button variant="link" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p style={{ color: 'var(--tp-slate-600, #54545c)', margin: 0 }}>
            Body content lives here.
          </p>
        </Dialog>
      </>
    );
  },
};

/** Rendered already open so the surface is visible in docs/snapshots. */
export const Open = {
  render: (args) => {
    const [open, setOpen] = React.useState(true);
    return (
      <Dialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        footer={
          <>
            <Button variant="link" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </>
        }
      >
        <p style={{ color: 'var(--tp-slate-600, #54545c)', margin: 0 }}>
          This dialog is open by default to showcase the panel surface.
        </p>
      </Dialog>
    );
  },
};

/** No footer, description-only body. */
export const DescriptionOnly = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Heads up"
        description="This dialog has only a title and a description, no footer actions."
      />
    );
  },
};

/** Wide panel via the width prop. */
export const WideWidth = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        width="lg"
        title="Wide dialog"
        description="Uses data-width=lg for a larger panel."
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <p style={{ color: 'var(--tp-slate-600, #54545c)', margin: 0 }}>
          Roomier layout for richer content.
        </p>
      </Dialog>
    );
  },
};

// ─── Healthcare stories ────────────────────────────────────────────────────

import { TPButton } from '@/src/components/atoms/Button/button-system/TPButton';
import { TPInput } from '@/src/components/atoms/Input/TPInput';

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};
const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: '#171725',
  fontFamily: 'Inter, sans-serif',
};
const selectStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #E2E2EA',
  borderRadius: 8,
  fontSize: 14,
  color: '#171725',
  fontFamily: 'Inter, sans-serif',
  background: '#fff',
  outline: 'none',
};
const textareaStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #E2E2EA',
  borderRadius: 8,
  fontSize: 14,
  color: '#171725',
  fontFamily: 'Inter, sans-serif',
  resize: 'vertical',
  minHeight: 80,
  outline: 'none',
  boxSizing: 'border-box',
};

/** Patient appointment booking — md width with form fields. */
export const BookAppointmentDialog = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        width="md"
        title="Book Appointment"
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <TPButton variant="ghost" onClick={() => setOpen(false)}>Cancel</TPButton>
            <TPButton variant="solid" theme="primary" onClick={() => setOpen(false)}>Book Appointment</TPButton>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={fieldStyle}>
            <label htmlFor="book-patient" style={labelStyle}>Patient Name</label>
            <select id="book-patient" style={selectStyle} defaultValue="">
              <option value="" disabled>Select patient</option>
              <option>Priya Sharma</option>
              <option>Rohan Mehta</option>
              <option>Ananya Iyer</option>
              <option>Vikram Nair</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label htmlFor="book-doctor" style={labelStyle}>Doctor Name</label>
            <select id="book-doctor" style={selectStyle} defaultValue="">
              <option value="" disabled>Select doctor</option>
              <option>Dr. Arun Kapoor — Cardiologist</option>
              <option>Dr. Neha Gupta — Diabetologist</option>
              <option>Dr. Suresh Patel — Nephrologist</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label htmlFor="book-date" style={labelStyle}>Appointment Date</label>
            <input
              id="book-date"
              type="date"
              style={selectStyle}
              defaultValue="2026-06-05"
            />
          </div>
          <div style={fieldStyle}>
            <label htmlFor="book-slot" style={labelStyle}>Time Slot</label>
            <select id="book-slot" style={selectStyle} defaultValue="">
              <option value="" disabled>Select time slot</option>
              <option value="morning">Morning — 9:00 AM to 12:00 PM</option>
              <option value="afternoon">Afternoon — 1:00 PM to 5:00 PM</option>
              <option value="evening">Evening — 5:00 PM to 8:00 PM</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label htmlFor="book-notes" style={labelStyle}>Notes (optional)</label>
            <textarea
              id="book-notes"
              style={textareaStyle}
              placeholder="Add any relevant clinical notes or patient concerns…"
            />
          </div>
        </div>
      </Dialog>
    );
  },
};

/** Destructive confirmation for deleting a patient record — sm width, error styling. */
export const DeleteConfirmDialog = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        width="sm"
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Delete Patient Record
          </span>
        }
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <TPButton variant="outline" theme="neutral" onClick={() => setOpen(false)}>Cancel</TPButton>
            <TPButton variant="solid" theme="error" onClick={() => setOpen(false)}>Delete</TPButton>
          </div>
        }
      >
        <div
          style={{
            border: '1px solid #FECDD3',
            background: '#FFF1F2',
            borderRadius: 8,
            padding: '12px 14px',
            marginBottom: 4,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: '#9F1239', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
            This will permanently delete all clinical data including prescriptions, lab reports and visit history.
          </p>
        </div>
      </Dialog>
    );
  },
};

/** Displays lab results in a colour-coded grid — lg width. */
export const ViewLabResultsDialog = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const results = [
      { test: 'HbA1c', value: '6.2 %', ref: '< 5.7 %', status: 'warning' },
      { test: 'LDL Cholesterol', value: '142 mg/dL', ref: '< 130 mg/dL', status: 'warning' },
      { test: 'Creatinine', value: '0.9 mg/dL', ref: '0.6–1.2 mg/dL', status: 'normal' },
      { test: 'Haemoglobin', value: '13.1 g/dL', ref: '12–16 g/dL', status: 'normal' },
      { test: 'Platelets', value: '2.4 lakh/μL', ref: '1.5–4.0 lakh/μL', status: 'normal' },
    ];
    const statusColor = { normal: '#15803D', warning: '#92400E', error: '#9F1239' };
    const statusBg = { normal: '#F0FDF4', warning: '#FFFBEB', error: '#FFF1F2' };
    const statusDot = { normal: '✅', warning: '🟡', error: '🔴' };
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        width="lg"
        title="Lab Results — Rohan Sharma"
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <TPButton variant="outline" theme="neutral" onClick={() => setOpen(false)}>Download PDF</TPButton>
            <TPButton variant="ghost" theme="neutral" onClick={() => setOpen(false)}>Close</TPButton>
          </div>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {results.map((r) => (
            <div
              key={r.test}
              style={{
                border: `1px solid ${statusColor[r.status]}33`,
                background: statusBg[r.status],
                borderRadius: 8,
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#54545C', fontFamily: 'Inter, sans-serif' }}>{r.test}</span>
                <span style={{ fontSize: 14 }}>{statusDot[r.status]}</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: statusColor[r.status], fontFamily: 'Inter, sans-serif' }}>{r.value}</span>
              <span style={{ fontSize: 11, color: '#54545C', fontFamily: 'Inter, sans-serif' }}>Ref: {r.ref}</span>
            </div>
          ))}
        </div>
      </Dialog>
    );
  },
};

/** Scheduling a follow-up visit with radio group, date picker and reminder toggle — default width. */
export const ScheduleFollowUpDialog = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [visitType, setVisitType] = React.useState('in-person');
    const [reminder, setReminder] = React.useState(true);
    const visitTypes = [
      { value: 'in-person', label: 'In-person' },
      { value: 'teleconsultation', label: 'Teleconsultation' },
      { value: 'home-visit', label: 'Home visit' },
    ];
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Schedule Follow-up"
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <TPButton variant="link" theme="neutral" onClick={() => setOpen(false)}>Cancel</TPButton>
            <TPButton variant="solid" theme="primary" onClick={() => setOpen(false)}>Schedule</TPButton>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Patient summary row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#F8F8FC', borderRadius: 8, border: '1px solid #E2E2EA' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4B4AD5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>PS</div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#171725', fontFamily: 'Inter, sans-serif' }}>Priya Sharma</p>
              <p style={{ margin: 0, fontSize: 12, color: '#54545C', fontFamily: 'Inter, sans-serif' }}>Last visit: 15 Apr 2026 · Diabetes follow-up</p>
            </div>
          </div>

          {/* Follow-up type */}
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 16px' }}>
            <legend style={labelStyle}>Follow-up Type</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {visitTypes.map((t) => (
                <label key={t.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#171725' }}>
                  <input
                    type="radio"
                    name="visitType"
                    value={t.value}
                    checked={visitType === t.value}
                    onChange={() => setVisitType(t.value)}
                    style={{ accentColor: '#4B4AD5', width: 16, height: 16 }}
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Date picker */}
          <div style={fieldStyle}>
            <label htmlFor="followup-date" style={labelStyle}>Date</label>
            <input id="followup-date" type="date" style={selectStyle} defaultValue="2026-06-15" />
          </div>

          {/* Reminder toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <label htmlFor="followup-reminder" style={{ fontSize: 14, color: '#171725', fontFamily: 'Inter, sans-serif' }}>Send reminder to patient</label>
            <button
              id="followup-reminder"
              type="button"
              role="switch"
              aria-checked={reminder}
              onClick={() => setReminder((v) => !v)}
              style={{
                width: 42,
                height: 24,
                borderRadius: 12,
                background: reminder ? '#4B4AD5' : '#E2E2EA',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 3,
                  left: reminder ? 21 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </button>
          </div>
        </div>
      </Dialog>
    );
  },
};

/** Four trigger buttons showcasing sm / md / lg / default widths simultaneously. */
export const AllWidths = {
  render: () => {
    const [activeWidth, setActiveWidth] = React.useState(null);
    const widths = [
      { id: 'sm', label: 'Small (sm)' },
      { id: 'md', label: 'Medium (md)' },
      { id: 'lg', label: 'Large (lg)' },
      { id: 'default', label: 'Default' },
    ];
    return (
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {widths.map((w) => (
          <React.Fragment key={w.id}>
            <TPButton variant="outline" onClick={() => setActiveWidth(w.id)}>{w.label}</TPButton>
            <Dialog
              open={activeWidth === w.id}
              onOpenChange={(v) => !v && setActiveWidth(null)}
              width={w.id}
              title={`${w.label} Dialog`}
              description={`This dialog uses width="${w.id}". Resize to compare available panel widths.`}
              footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <TPButton variant="solid" onClick={() => setActiveWidth(null)}>Close</TPButton>
                </div>
              }
            />
          </React.Fragment>
        ))}
      </div>
    );
  },
};
