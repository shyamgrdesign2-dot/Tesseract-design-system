import React from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from './Drawer';
import { TPButton } from '@/src/components/atoms/Button/button-system/TPButton';
import { TPInput } from '@/src/components/atoms/Input/TPInput';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  HeartPulse,
  Hospital,
  Pencil,
  Plus,
  Stethoscope,
  UploadCloud,
  Users,
  X,
  Activity,
} from '@/src/components/atoms/icons/lucide';

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  text:      '#171725',
  secondary: '#717179',
  border:    '#E2E2EA',
  primary:   '#4B4AD5',
  success:   '#10B981',
  error:     '#E11D48',
  bg:        '#FFFFFF',
  surface:   '#F8F8FC',
};

const font = { fontFamily: 'Inter, sans-serif' };

// ─── Meta ─────────────────────────────────────────────────────────────────────
export default {
  title: 'Molecules/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

// ─── Shared primitives ────────────────────────────────────────────────────────
function Divider() {
  return <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '12px 0' }} />;
}

function Label({ children, style }) {
  return (
    <p style={{ ...font, fontSize: 11, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px', ...style }}>
      {children}
    </p>
  );
}

function StatusChip({ status }) {
  const map = {
    Confirmed: { bg: '#D1FAE5', color: '#065F46' },
    Pending:   { bg: '#FEF9C3', color: '#854D0E' },
    Cancelled: { bg: '#FFE4E6', color: '#9F1239' },
    Completed: { bg: '#EDE9FE', color: '#4C1D95' },
  };
  const s = map[status] || map.Confirmed;
  return (
    <span style={{
      ...font, fontSize: 11, fontWeight: 600, padding: '2px 8px',
      borderRadius: 99, background: s.bg, color: s.color,
    }}>
      {status}
    </span>
  );
}

// ─── 1. Playground ────────────────────────────────────────────────────────────
export const Playground = {
  argTypes: {
    side: { control: 'select', options: ['right', 'left', 'top', 'bottom'], defaultValue: 'right' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'], defaultValue: 'md' },
  },
  args: { side: 'right', size: 'md' },
  render: ({ side, size }) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ ...font, padding: 32 }}>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <TPButton variant="solid">Open Drawer ({side} / {size})</TPButton>
          </DrawerTrigger>
          <DrawerContent side={side} size={size}>
            <DrawerHeader>
              <DrawerTitle>Playground Drawer</DrawerTitle>
              <DrawerDescription>
                Currently: <strong>{side}</strong> side, <strong>{size}</strong> size. Use the controls panel to change these.
              </DrawerDescription>
            </DrawerHeader>
            <div style={{ padding: '16px 24px', flex: 1 }}>
              <p style={{ ...font, color: C.secondary, lineHeight: 1.6 }}>
                This is the drawer body. It scrolls independently from the header and footer when content overflows.
              </p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <TPButton variant="ghost">Cancel</TPButton>
              </DrawerClose>
              <TPButton variant="solid" onClick={() => setOpen(false)}>Save Changes</TPButton>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

// ─── 2. AllSides ──────────────────────────────────────────────────────────────
export const AllSides = {
  render: () => {
    const [openSide, setOpenSide] = React.useState(null);
    const sides = [
      { side: 'right',  label: 'Patient Details →', desc: 'Slides in from the right edge' },
      { side: 'left',   label: '← Navigation',      desc: 'Slides in from the left edge' },
      { side: 'top',    label: '↑ Filters',          desc: 'Drops down from the top edge' },
      { side: 'bottom', label: '↓ Actions',          desc: 'Rises up from the bottom edge' },
    ];
    return (
      <div style={{ ...font, padding: 40, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.surface }}>
        {sides.map(({ side, label }) => (
          <TPButton key={side} variant="outline" onClick={() => setOpenSide(side)}>
            {label}
          </TPButton>
        ))}
        {sides.map(({ side, label, desc }) => (
          <Drawer key={side} open={openSide === side} onOpenChange={(v) => !v && setOpenSide(null)}>
            <DrawerContent side={side} size="md">
              <DrawerHeader>
                <DrawerTitle>{label}</DrawerTitle>
                <DrawerDescription>{desc}</DrawerDescription>
              </DrawerHeader>
              <div style={{ padding: '16px 24px', flex: 1 }}>
                <p style={{ ...font, color: C.secondary }}>
                  This drawer slides in from the <strong>{side}</strong> edge. The overlay darkens the content behind it.
                </p>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <TPButton variant="ghost">Close</TPButton>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    );
  },
};

// ─── 3. AllSizes ──────────────────────────────────────────────────────────────
export const AllSizes = {
  render: () => {
    const [openSize, setOpenSize] = React.useState(null);
    const sizes = [
      { size: 'sm', label: 'sm — 320px',  desc: 'Compact panel, ideal for confirmations or filters.' },
      { size: 'md', label: 'md — 448px',  desc: 'Default size. Good for forms and detail views.' },
      { size: 'lg', label: 'lg — 560px',  desc: 'Wider panel for data-dense forms.' },
      { size: 'xl', label: 'xl — 720px',  desc: 'Extra-wide panel for rich content.' },
      { size: 'full', label: 'full — 100%', desc: 'Full-width panel for immersive flows.' },
    ];
    return (
      <div style={{ ...font, padding: 40, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.surface }}>
        {sizes.map(({ size, label }) => (
          <TPButton key={size} variant="outline" onClick={() => setOpenSize(size)}>
            {label}
          </TPButton>
        ))}
        {sizes.map(({ size, label, desc }) => (
          <Drawer key={size} open={openSize === size} onOpenChange={(v) => !v && setOpenSize(null)}>
            <DrawerContent side="right" size={size}>
              <DrawerHeader>
                <DrawerTitle>{label}</DrawerTitle>
                <DrawerDescription>{desc}</DrawerDescription>
              </DrawerHeader>
              <div style={{ padding: '16px 24px', flex: 1 }}>
                <p style={{ ...font, color: C.secondary }}>
                  This panel uses <code style={{ background: '#F3F4F6', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>size="{size}"</code>.
                </p>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <TPButton variant="ghost">Close</TPButton>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    );
  },
};

// ─── 4. PatientDetailDrawer ───────────────────────────────────────────────────
export const PatientDetailDrawer = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const vitals = [
      { label: 'Blood Pressure', value: '128/82', unit: 'mmHg', icon: <Activity size={16} /> },
      { label: 'Heart Rate',     value: '74',     unit: 'bpm',  icon: <HeartPulse size={16} /> },
      { label: 'SpO₂',           value: '98',     unit: '%',    icon: <Activity size={16} /> },
      { label: 'Temperature',    value: '36.8',   unit: '°C',   icon: <Activity size={16} /> },
    ];
    const diagnoses = [
      { name: 'Type 2 Diabetes Mellitus', code: 'E11.9',  date: '12 Jan 2025', status: 'Confirmed' },
      { name: 'Hypertension Stage 1',     code: 'I10',    date: '03 Mar 2025', status: 'Confirmed' },
      { name: 'Dyslipidaemia',            code: 'E78.5',  date: '15 Apr 2025', status: 'Pending' },
    ];
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side="right" size="xl">
          <DrawerHeader>
            <DrawerTitle>Patient Details</DrawerTitle>
            <DrawerDescription>Full clinical summary for the selected patient.</DrawerDescription>
          </DrawerHeader>

          {/* Body */}
          <div style={{ padding: '0 24px 24px', flex: 1, overflowY: 'auto' }}>

            {/* Avatar section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ ...font, fontSize: 20, fontWeight: 700, color: C.primary }}>AM</span>
              </div>
              <div>
                <p style={{ ...font, fontSize: 18, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Arjun Mehta</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ ...font, fontSize: 12, color: C.secondary }}>MRN: <strong style={{ color: C.text }}>PT-2024-00382</strong></span>
                  <span style={{ ...font, fontSize: 12, color: C.secondary }}>Age: <strong style={{ color: C.text }}>42 yrs</strong></span>
                  <span style={{ ...font, fontSize: 12, color: C.secondary }}>Blood Group: <strong style={{ color: '#E11D48' }}>B+</strong></span>
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div style={{ padding: '16px 0' }}>
              <Label>Latest Vitals</Label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {vitals.map(v => (
                  <div key={v.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 14px' }}>
                    <p style={{ ...font, fontSize: 11, color: C.secondary, margin: '0 0 4px' }}>{v.label}</p>
                    <p style={{ ...font, fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>
                      {v.value} <span style={{ fontSize: 12, fontWeight: 400, color: C.secondary }}>{v.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* Diagnoses */}
            <div style={{ padding: '4px 0' }}>
              <Label>Recent Diagnoses</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {diagnoses.map(d => (
                  <div key={d.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                    <div>
                      <p style={{ ...font, fontSize: 13, fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{d.name}</p>
                      <p style={{ ...font, fontSize: 11, color: C.secondary, margin: 0 }}>{d.code} · {d.date}</p>
                    </div>
                    <StatusChip status={d.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <TPButton variant="ghost">Close</TPButton>
            </DrawerClose>
            <TPButton variant="solid">
              <Pencil size={14} style={{ marginRight: 6 }} />
              Edit Patient
            </TPButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};

// ─── 5. FilterDrawer ──────────────────────────────────────────────────────────
export const FilterDrawer = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [statuses, setStatuses] = React.useState({ All: true, Confirmed: false, Pending: false, Cancelled: false });
    const toggle = (key) => setStatuses(prev => ({ ...prev, [key]: !prev[key] }));

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side="right" size="sm">
          <DrawerHeader>
            <DrawerTitle>Filter Appointments</DrawerTitle>
            <DrawerDescription>Narrow down the appointment list.</DrawerDescription>
          </DrawerHeader>

          <div style={{ padding: '0 24px 24px', flex: 1, overflowY: 'auto' }}>
            {/* Status checkboxes */}
            <div style={{ marginBottom: 20 }}>
              <Label>Appointment Status</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.keys(statuses).map(s => (
                  <label key={s} style={{ ...font, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: C.text }}>
                    <input
                      type="checkbox"
                      checked={statuses[s]}
                      onChange={() => toggle(s)}
                      style={{ width: 16, height: 16, accentColor: C.primary, cursor: 'pointer' }}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <Divider />

            {/* Date range */}
            <div style={{ marginBottom: 20 }}>
              <Label>Date Range</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <TPInput label="From" type="date" size="sm" />
                <TPInput label="To"   type="date" size="sm" />
              </div>
            </div>

            <Divider />

            {/* Doctor name */}
            <div>
              <Label>Doctor Name</Label>
              <TPInput label="Search doctor" placeholder="e.g. Dr. Ananya Sharma" size="sm" />
            </div>
          </div>

          <DrawerFooter>
            <TPButton variant="ghost" onClick={() => setStatuses({ All: true, Confirmed: false, Pending: false, Cancelled: false })}>
              Clear Filters
            </TPButton>
            <TPButton variant="solid" onClick={() => setOpen(false)}>Apply Filters</TPButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};

// ─── 6. AddPatientDrawer ──────────────────────────────────────────────────────
export const AddPatientDrawer = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side="right" size="lg">
          <DrawerHeader>
            <DrawerTitle>Register New Patient</DrawerTitle>
            <DrawerDescription>Fill in the patient's details to create their profile.</DrawerDescription>
          </DrawerHeader>

          <div style={{ padding: '0 24px 24px', flex: 1, overflowY: 'auto' }}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <TPInput label="First Name" placeholder="Arjun" required />
              <TPInput label="Last Name"  placeholder="Mehta"  required />
            </div>

            {/* Mobile */}
            <div style={{ marginBottom: 16 }}>
              <Label>Mobile Number</Label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ ...font, fontSize: 14, color: C.text, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '0 12px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  +91
                </div>
                <TPInput placeholder="98765 43210" style={{ flex: 1 }} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <TPInput label="Email Address" type="email" placeholder="arjun.mehta@email.com" />
            </div>

            {/* DOB */}
            <div style={{ marginBottom: 16 }}>
              <TPInput label="Date of Birth" type="date" required />
            </div>

            {/* Blood group */}
            <div style={{ marginBottom: 16 }}>
              <Label>Blood Group</Label>
              <select style={{
                ...font, fontSize: 14, color: C.text,
                width: '100%', padding: '9px 12px',
                border: `1px solid ${C.border}`, borderRadius: 6,
                background: C.bg, outline: 'none', cursor: 'pointer',
              }}>
                {['Select blood group', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Chief complaint */}
            <div>
              <Label>Chief Complaint</Label>
              <textarea
                placeholder="Describe the primary reason for visit..."
                rows={4}
                style={{
                  ...font, fontSize: 14, color: C.text,
                  width: '100%', padding: '9px 12px',
                  border: `1px solid ${C.border}`, borderRadius: 6,
                  background: C.bg, outline: 'none', resize: 'vertical',
                  boxSizing: 'border-box', lineHeight: 1.5,
                }}
              />
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <TPButton variant="ghost">Cancel</TPButton>
            </DrawerClose>
            <TPButton variant="solid" onClick={() => setOpen(false)}>
              <Plus size={14} style={{ marginRight: 6 }} />
              Register Patient
            </TPButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};

// ─── 7. MedicalHistoryDrawer ──────────────────────────────────────────────────
export const MedicalHistoryDrawer = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const timeline = [
      { date: '14 Apr 2025', doctor: 'Dr. Ananya Sharma',   diagnosis: 'Hypertension follow-up',      status: 'Completed' },
      { date: '01 Mar 2025', doctor: 'Dr. Rajesh Pillai',   diagnosis: 'Fasting glucose monitoring',  status: 'Completed' },
      { date: '10 Jan 2025', doctor: 'Dr. Ananya Sharma',   diagnosis: 'Type 2 Diabetes — initial Dx', status: 'Confirmed' },
      { date: '22 Nov 2024', doctor: 'Dr. Priya Nair',      diagnosis: 'Chest pain evaluation',       status: 'Completed' },
      { date: '05 Sep 2024', doctor: 'Dr. Vikram Choudhary', diagnosis: 'Annual health check',        status: 'Completed' },
    ];
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side="left" size="md">
          <DrawerHeader>
            <DrawerTitle>Medical History</DrawerTitle>
            <DrawerDescription>Past appointments for Arjun Mehta</DrawerDescription>
          </DrawerHeader>

          <div style={{ padding: '0 24px 24px', flex: 1, overflowY: 'auto' }}>
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 2, background: C.border }} />

              {timeline.map((entry, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: 20 }}>
                  {/* Dot */}
                  <div style={{ position: 'absolute', left: -18, top: 4, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? C.primary : C.border, border: `2px solid ${i === 0 ? C.primary : C.secondary}` }} />

                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <p style={{ ...font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{entry.diagnosis}</p>
                      <StatusChip status={entry.status} />
                    </div>
                    <p style={{ ...font, fontSize: 12, color: C.secondary, margin: '0 0 2px' }}>{entry.doctor}</p>
                    <div style={{ ...font, fontSize: 11, color: C.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} />
                      {entry.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <TPButton variant="ghost">Close</TPButton>
            </DrawerClose>
            <TPButton variant="outline">
              <FileText size={14} style={{ marginRight: 6 }} />
              Export History
            </TPButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};

// ─── 8. BottomSheetDrawer ─────────────────────────────────────────────────────
export const BottomSheetDrawer = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const actions = [
      { icon: <Calendar size={24} />,      label: 'Book Appointment', color: '#EDE9FE', iconColor: C.primary },
      { icon: <UploadCloud size={24} />,   label: 'Upload Document',  color: '#D1FAE5', iconColor: '#059669' },
      { icon: <HeartPulse size={24} />,    label: 'Add Vital',        color: '#FEF9C3', iconColor: '#B45309' },
      { icon: <Stethoscope size={24} />,   label: 'Contact Doctor',   color: '#FCE7F3', iconColor: '#BE185D' },
    ];
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side="bottom" size="md">
          {/* Handle indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <div style={{ width: 40, height: 4, borderRadius: 99, background: C.border }} />
          </div>

          <DrawerHeader>
            <DrawerTitle>Quick Actions</DrawerTitle>
            <DrawerDescription>Choose an action for this patient.</DrawerDescription>
          </DrawerHeader>

          <div style={{ padding: '8px 24px 32px', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {actions.map(a => (
                <button
                  key={a.label}
                  onClick={() => setOpen(false)}
                  style={{
                    ...font, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.iconColor }}>
                    {a.icon}
                  </div>
                  <span style={{ fontSize: 12, color: C.text, textAlign: 'center', lineHeight: 1.3 }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
};

// ─── 9. ConfirmActionDrawer ───────────────────────────────────────────────────
export const ConfirmActionDrawer = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side="right" size="sm">
          <DrawerHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={18} color={C.error} />
              </div>
              <DrawerTitle>Cancel Appointment</DrawerTitle>
            </div>
            <DrawerDescription>
              This action cannot be undone. The appointment slot will be released and the patient will be notified.
            </DrawerDescription>
          </DrawerHeader>

          <div style={{ padding: '0 24px 24px', flex: 1 }}>
            {/* Appointment card */}
            <div style={{ background: '#FFF5F7', border: `1px solid #FECDD3`, borderRadius: 8, padding: '14px 16px' }}>
              <p style={{ ...font, fontSize: 12, color: C.secondary, margin: '0 0 6px' }}>Appointment to be cancelled</p>
              <p style={{ ...font, fontSize: 14, fontWeight: 600, color: C.text, margin: '0 0 4px' }}>Arjun Mehta</p>
              <p style={{ ...font, fontSize: 13, color: C.secondary, margin: '0 0 2px' }}>Dr. Ananya Sharma — Cardiology</p>
              <div style={{ ...font, fontSize: 12, color: C.secondary, display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <Calendar size={12} />
                28 May 2025 · 10:30 AM
              </div>
            </div>

            <div style={{ marginTop: 16, padding: '12px 16px', background: '#FFFBEB', border: `1px solid #FDE68A`, borderRadius: 8 }}>
              <p style={{ ...font, fontSize: 12, color: '#92400E', margin: 0 }}>
                ⚠ The patient will receive a cancellation SMS and email notification.
              </p>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <TPButton variant="outline">Keep Appointment</TPButton>
            </DrawerClose>
            <TPButton
              variant="solid"
              style={{ background: C.error, borderColor: C.error }}
              onClick={() => setOpen(false)}
            >
              Confirm Cancel
            </TPButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};

// ─── 10. NoScrollContent ──────────────────────────────────────────────────────
export const NoScrollContent = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const patients = [
      { name: 'Arjun Mehta',       mrn: 'PT-00382', status: 'Confirmed' },
      { name: 'Priya Nair',        mrn: 'PT-00401', status: 'Pending' },
      { name: 'Ramesh Kumar',      mrn: 'PT-00419', status: 'Confirmed' },
      { name: 'Sunita Verma',      mrn: 'PT-00422', status: 'Cancelled' },
      { name: 'Kiran Desai',       mrn: 'PT-00438', status: 'Confirmed' },
      { name: 'Divya Iyer',        mrn: 'PT-00444', status: 'Pending' },
      { name: 'Manoj Tiwari',      mrn: 'PT-00451', status: 'Confirmed' },
      { name: 'Anita Bose',        mrn: 'PT-00462', status: 'Confirmed' },
      { name: 'Suresh Pillai',     mrn: 'PT-00477', status: 'Cancelled' },
      { name: 'Kavya Reddy',       mrn: 'PT-00483', status: 'Confirmed' },
      { name: 'Harish Menon',      mrn: 'PT-00490', status: 'Pending' },
      { name: 'Lakshmi Patel',     mrn: 'PT-00501', status: 'Confirmed' },
      { name: 'Ravi Chandran',     mrn: 'PT-00512', status: 'Confirmed' },
      { name: 'Neha Gupta',        mrn: 'PT-00524', status: 'Pending' },
      { name: 'Vijay Krishnamurthy', mrn: 'PT-00531', status: 'Confirmed' },
    ];
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side="right" size="md">
          {/* Sticky header */}
          <DrawerHeader>
            <DrawerTitle>Today's Patient List</DrawerTitle>
            <DrawerDescription>
              {patients.length} patients · Header and footer remain fixed while the list scrolls.
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
            {patients.map((p, i) => (
              <div key={p.mrn} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: i < patients.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ ...font, fontSize: 11, fontWeight: 700, color: C.primary }}>
                      {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p style={{ ...font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{p.name}</p>
                    <p style={{ ...font, fontSize: 11, color: C.secondary, margin: 0 }}>{p.mrn}</p>
                  </div>
                </div>
                <StatusChip status={p.status} />
              </div>
            ))}
          </div>

          {/* Sticky footer */}
          <DrawerFooter>
            <DrawerClose asChild>
              <TPButton variant="ghost">Close</TPButton>
            </DrawerClose>
            <TPButton variant="solid">
              <Users size={14} style={{ marginRight: 6 }} />
              View All Patients
            </TPButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};
