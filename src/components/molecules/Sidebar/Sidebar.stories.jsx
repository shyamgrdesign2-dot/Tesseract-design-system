import React from 'react';
import { Sidebar } from './Sidebar';
import { SidebarHeader } from '@/src/components/molecules';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/Sidebar',
  component: Sidebar,
  tags: ['autodocs', 'ai-generated'],
  parameters: { layout: 'fullscreen' },
};

export default meta;

const CloseIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const BodyContent = () => (
  <div style={{ padding: 16, display: 'grid', gap: 12 }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <p key={i} style={{ margin: 0, color: 'var(--tp-slate-600, #54545c)' }}>
        Scrollable body row {i + 1}. The header stays sticky while this area scrolls.
      </p>
    ))}
  </div>
);

const Stage = ({ children }) => (
  <div style={{ position: 'relative', height: 480, background: 'var(--tp-slate-50, #fafafb)' }}>
    {children}
  </div>
);

/** Triggered — opens the slide-in panel as a fixed overlay. */
export const Playground = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Stage>
        <div style={{ padding: 24 }}>
          <Button onClick={() => setOpen(true)}>Open sidebar</Button>
        </div>
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          width="480px"
          header={
            <SidebarHeader
              title="Rx Preview"
              closeIcon={CloseIcon}
              onClose={() => setOpen(false)}
              actions={<Button size="sm">Save</Button>}
            />
          }
        >
          <BodyContent />
        </Sidebar>
      </Stage>
    );
  },
};

/** Open by default so the panel surface is visible. */
export const Open = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Stage>
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          width="480px"
          header={
            <SidebarHeader title="Settings" closeIcon={CloseIcon} onClose={() => setOpen(false)} />
          }
        >
          <BodyContent />
        </Sidebar>
      </Stage>
    );
  },
};

/** Slides in from the left. */
export const LeftSide = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Stage>
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          side="left"
          width="420px"
          header={
            <SidebarHeader title="Navigation" closeIcon={CloseIcon} onClose={() => setOpen(false)} />
          }
        >
          <BodyContent />
        </Sidebar>
      </Stage>
    );
  },
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Prescription preview sidebar — opened when clicking a prescription row. */
export const PrescriptionPreview = {
  name: '💊 Prescription Preview',
  render: () => {
    const [open, setOpen] = React.useState(true);
    const meds = [
      { name: 'Amlodipine', dose: '5 mg', freq: 'Once daily', duration: '30 days' },
      { name: 'Atorvastatin', dose: '40 mg', freq: 'Once daily at night', duration: '90 days' },
      { name: 'Aspirin', dose: '75 mg', freq: 'Once daily with food', duration: '90 days' },
    ];
    return (
      <Stage>
        <div style={{ padding: 24 }}>
          <Button onClick={() => setOpen(true)}>Open Rx Preview</Button>
        </div>
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          width="480px"
          header={
            <SidebarHeader
              title="Prescription — 15 May 2026"
              closeIcon={CloseIcon}
              onClose={() => setOpen(false)}
              actions={
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="ghost">Print</Button>
                  <Button size="sm">Send to pharmacy</Button>
                </div>
              }
            />
          }
        >
          <div style={{ padding: 20, display: 'grid', gap: 16, fontFamily: 'Inter, sans-serif' }}>
            <div style={{ padding: '12px 14px', background: '#F7F7FB', borderRadius: 10, border: '1px solid #E2E2EA' }}>
              <div style={{ fontSize: 12, color: '#54545C', marginBottom: 2 }}>Patient</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#171725' }}>Rohan Sharma · MRN-20240812-001</div>
              <div style={{ fontSize: 12, color: '#54545C', marginTop: 2 }}>Dr. Ananya Mehta · Apollo Clinic</div>
            </div>
            {meds.map((m) => (
              <div key={m.name} style={{ padding: '14px 16px', border: '1px solid #E2E2EA', borderRadius: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#171725' }}>{m.name} {m.dose}</div>
                <div style={{ fontSize: 12, color: '#54545C', marginTop: 4 }}>{m.freq} · {m.duration}</div>
              </div>
            ))}
            <div style={{ fontSize: 12, color: '#54545C', borderTop: '1px solid #F0F0F6', paddingTop: 14 }}>
              Prescribed by: Dr. Ananya Mehta (Reg. MCI-KA-2012-0042)<br />
              Valid until: 14 Jun 2026
            </div>
          </div>
        </Sidebar>
      </Stage>
    );
  },
};

/** Patient filter panel — opens as a right sidebar over a patient list. */
export const PatientFilterPanel = {
  name: '🔽 Patient Filter Panel',
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [filters, setFilters] = React.useState({ dept: 'all', status: 'active', gender: 'all' });
    const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
    const SelectRow = ({ label, field, options }) => {
      const id = `filter-${field}`;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor={id} style={{ fontSize: 12, fontWeight: 500, color: '#54545C' }}>{label}</label>
          <select id={id} value={filters[field]} onChange={(e) => set(field, e.target.value)} style={{ padding: '8px 10px', border: '1px solid #E2E2EA', borderRadius: 6, fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#171725', background: '#fff' }}>
            {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      );
    };
    return (
      <Stage>
        <div style={{ padding: 24 }}>
          <Button onClick={() => setOpen(true)}>Open filters</Button>
        </div>
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          width="320px"
          header={
            <SidebarHeader title="Filter patients" closeIcon={CloseIcon} onClose={() => setOpen(false)} />
          }
        >
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif' }}>
            <SelectRow label="Department" field="dept" options={[['all','All departments'],['cardiology','Cardiology'],['neurology','Neurology'],['orthopedics','Orthopedics']]} />
            <SelectRow label="Patient status" field="status" options={[['active','Active'],['discharged','Discharged'],['follow-up','Follow-up due']]} />
            <SelectRow label="Gender" field="gender" options={[['all','All'],['male','Male'],['female','Female'],['other','Other']]} />
            <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid #F0F0F6', marginTop: 4 }}>
              <Button fullWidth variant="ghost" onClick={() => setFilters({ dept: 'all', status: 'active', gender: 'all' })}>Reset</Button>
              <Button fullWidth onClick={() => setOpen(false)}>Apply filters</Button>
            </div>
          </div>
        </Sidebar>
      </Stage>
    );
  },
};
