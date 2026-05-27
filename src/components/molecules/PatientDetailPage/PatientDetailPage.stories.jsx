import React, { useState } from 'react';
import { Avatar } from '@/src/components/atoms/Avatar/Avatar';
import { Badge } from '@/src/components/atoms/Badge/Badge';
import { TPChip } from '@/src/components/atoms/Chip/Chip';
import { TPButton } from '@/src/components/atoms/Button/button-system/TPButton';
import { Breadcrumbs, BreadcrumbItem } from '@/src/components/molecules/Breadcrumbs/Breadcrumbs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/molecules/Tabs/Tabs';
import { Timeline } from '@/src/components/molecules/Timeline/index.js';
import { Card, CardHeader, CardContent, CardFooter } from '@/src/components/molecules/Card/Card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/src/components/molecules/Accordion/Accordion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/src/components/molecules/Drawer/Drawer';
import {
  Calendar,
  Download,
  FileText,
  FlaskConical,
  HeartPulse,
  Pill,
  Stethoscope,
  Activity,
  ClipboardList,
  CheckCircle,
  Clock,
  BellRing,
} from '@/src/components/atoms/icons/lucide.jsx';

export default {
  title: 'Compositions/Patient Detail Page',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  heading: '#171725',
  secondary: '#717179',
  border: '#E2E2EA',
  blue: '#4B4AD5',
  surface: '#F7F7FB',
  font: "'Inter', sans-serif",
};

// ─── Mini Vital Card ──────────────────────────────────────────────────────────
function VitalCard({ label, value, unit }) {
  return (
    <Card
      padding="sm"
      style={{
        minWidth: 110,
        flex: '1 1 0',
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
      }}
    >
      <div style={{ fontFamily: T.font }}>
        <div style={{ fontSize: 11, color: T.secondary, marginBottom: 4, fontWeight: 500 }}>
          {label}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.heading }}>
          {value}
          {unit && (
            <span style={{ fontSize: 11, fontWeight: 400, color: T.secondary, marginLeft: 3 }}>
              {unit}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Prescription Card ────────────────────────────────────────────────────────
function PrescriptionCard({ drug, dose, frequency, duration }) {
  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        fontFamily: T.font,
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#EEF0FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.blue,
            flexShrink: 0,
          }}
        >
          <Pill size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: T.heading, fontSize: 14 }}>{drug}</div>
          <div style={{ fontSize: 12, color: T.secondary, marginTop: 2 }}>
            {dose} · {frequency} · {duration}
          </div>
        </div>
      </div>
      <TPButton variant="ghost" size="sm">
        Refill
      </TPButton>
    </div>
  );
}

// ─── Lab Result Table ─────────────────────────────────────────────────────────
const LAB_ROWS = [
  { test: 'Haemoglobin', value: '13.2 g/dL', normal: '13.5–17.5 g/dL', status: 'Abnormal' },
  { test: 'Fasting Blood Sugar', value: '96 mg/dL', normal: '70–99 mg/dL', status: 'Normal' },
  { test: 'Total Cholesterol', value: '182 mg/dL', normal: '< 200 mg/dL', status: 'Normal' },
  { test: 'Serum Creatinine', value: '0.9 mg/dL', normal: '0.7–1.2 mg/dL', status: 'Normal' },
  { test: 'TSH', value: '5.8 mIU/L', normal: '0.4–4.0 mIU/L', status: 'Abnormal' },
];

function LabTable() {
  const thStyle = {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: T.secondary,
    borderBottom: `1px solid ${T.border}`,
    background: T.surface,
    fontFamily: T.font,
  };
  const tdStyle = {
    padding: '12px 14px',
    fontSize: 13,
    color: T.heading,
    borderBottom: `1px solid ${T.border}`,
    fontFamily: T.font,
  };
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Test</th>
            <th style={thStyle}>Value</th>
            <th style={thStyle}>Normal Range</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {LAB_ROWS.map((row, i) => (
            <tr key={i}>
              <td style={tdStyle}>{row.test}</td>
              <td style={tdStyle}>{row.value}</td>
              <td style={{ ...tdStyle, color: T.secondary }}>{row.normal}</td>
              <td style={tdStyle}>
                <TPChip
                  label={row.status}
                  color={row.status === 'Normal' ? 'success' : 'error'}
                  size="sm"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Appointment Row ──────────────────────────────────────────────────────────
function AppointmentRow({ day, month, doctor, specialty, status, statusColor, past }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 0',
        borderBottom: `1px solid ${T.border}`,
        fontFamily: T.font,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: past ? T.surface : '#EEF0FD',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: past ? T.secondary : T.blue, lineHeight: 1 }}>
          {day}
        </span>
        <span style={{ fontSize: 10, color: T.secondary, marginTop: 1 }}>{month}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: T.heading }}>{doctor}</div>
        <div style={{ fontSize: 12, color: T.secondary, marginTop: 2 }}>{specialty}</div>
      </div>
      <TPChip label={status} color={statusColor} />
      <div style={{ display: 'flex', gap: 8 }}>
        <TPButton variant="ghost" size="sm">View</TPButton>
        {!past && <TPButton variant="outline" size="sm">Reschedule</TPButton>}
      </div>
    </div>
  );
}

// ─── Document Row ─────────────────────────────────────────────────────────────
function DocumentRow({ name, date }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 0',
        borderBottom: `1px solid ${T.border}`,
        fontFamily: T.font,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: '#EEF0FD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: T.blue,
          flexShrink: 0,
        }}
      >
        <FileText size={16} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: T.heading }}>{name}</div>
        <div style={{ fontSize: 12, color: T.secondary, marginTop: 2 }}>{date}</div>
      </div>
      <TPButton variant="ghost" size="sm" leftIcon={<Download size={14} />}>
        Download
      </TPButton>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Medical History */}
      <Card padding="md" style={{ border: `1px solid ${T.border}`, borderRadius: 12 }}>
        <CardHeader>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.heading, fontFamily: T.font }}>
            Medical History
          </h3>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="medications">
            <AccordionItem value="medications">
              <AccordionTrigger>Current Medications</AccordionTrigger>
              <AccordionContent>
                <ul style={{ margin: 0, paddingLeft: 18, color: T.secondary, fontSize: 13, fontFamily: T.font, lineHeight: 1.8 }}>
                  <li>Metoprolol 25 mg — twice daily</li>
                  <li>Aspirin 75 mg — once daily</li>
                  <li>Atorvastatin 10 mg — once at night</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="allergies">
              <AccordionTrigger>Allergies</AccordionTrigger>
              <AccordionContent>
                <ul style={{ margin: 0, paddingLeft: 18, color: T.secondary, fontSize: 13, fontFamily: T.font, lineHeight: 1.8 }}>
                  <li>Penicillin — Rash</li>
                  <li>Sulfa drugs — Urticaria</li>
                  <li>Latex — Contact dermatitis</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="diagnoses">
              <AccordionTrigger>Past Diagnoses</AccordionTrigger>
              <AccordionContent>
                <ul style={{ margin: 0, paddingLeft: 18, color: T.secondary, fontSize: 13, fontFamily: T.font, lineHeight: 1.8 }}>
                  <li>Hypertension (2019)</li>
                  <li>Mild dyslipidemia (2021)</li>
                  <li>Sinus tachycardia (2023)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card padding="md" style={{ border: `1px solid ${T.border}`, borderRadius: 12 }}>
        <CardHeader>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.heading, fontFamily: T.font }}>
            Recent Activity
          </h3>
        </CardHeader>
        <CardContent>
          <Timeline
            items={[
              {
                title: 'Appointment Booked',
                description: 'Cardiology follow-up with Dr. Ananya Mehta',
                timestamp: '12 May 2026',
                color: 'blue',
                icon: <Calendar size={14} />,
              },
              {
                title: 'Vitals Recorded',
                description: 'BP 128/84, HR 76, SpO₂ 98%',
                timestamp: '10 May 2026',
                color: 'success',
                icon: <Activity size={14} />,
              },
              {
                title: 'Prescription Issued',
                description: 'Metoprolol 25 mg refill — 30 days',
                timestamp: '8 May 2026',
                color: 'violet',
                icon: <Pill size={14} />,
              },
              {
                title: 'Follow-up Scheduled',
                description: 'Echo stress test — 28 May 2026',
                timestamp: '8 May 2026',
                color: 'warning',
                icon: <Clock size={14} />,
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page Layout ──────────────────────────────────────────────────────────────
function PatientDetailLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: T.font }}>
      {/* Top Bar */}
      <div
        style={{
          height: 64,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Breadcrumbs>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbItem>All Patients</BreadcrumbItem>
          <BreadcrumbItem active>Rohan Sharma — MRN-0042</BreadcrumbItem>
        </Breadcrumbs>
        <div style={{ display: 'flex', gap: 10 }}>
          <TPButton variant="outline" size="sm">Edit Patient</TPButton>
          <TPButton variant="solid" size="sm">Book Appointment</TPButton>
        </div>
      </div>

      {/* Hero Section */}
      <div
        style={{
          padding: 24,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 20,
          background: '#fff',
        }}
      >
        <Avatar name="Rohan Sharma" pixels={64} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: T.heading }}>Rohan Sharma</span>
            <TPChip label="Active" color="success" />
          </div>
          <div style={{ fontSize: 13, color: T.secondary, marginBottom: 4 }}>
            Age 38 · Male · Blood group: B+ · MRN-0042
          </div>
          <div style={{ fontSize: 13, color: T.secondary, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Stethoscope size={13} />
            Dr. Ananya Mehta, Cardiologist
          </div>
          <div style={{ fontSize: 13, color: T.secondary, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={13} />
            Last visit: 12 May 2026
          </div>
        </div>

        {/* Vitals Strip */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <VitalCard label="Blood Pressure" value="128/84" unit="mmHg" />
          <VitalCard label="Heart Rate" value="76" unit="bpm" />
          <VitalCard label="SpO₂" value="98" unit="%" />
          <VitalCard label="Temperature" value="98.6" unit="°F" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 28px 32px' }}>
        <Tabs defaultValue="overview">
          <TabsList style={{ marginTop: 0, borderBottom: `1px solid ${T.border}`, borderRadius: 0 }}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="lab">Lab Results</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" style={{ paddingTop: 20 }}>
            <OverviewTab />
          </TabsContent>

          {/* Prescriptions */}
          <TabsContent value="prescriptions" style={{ paddingTop: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680 }}>
              <PrescriptionCard drug="Metoprolol Succinate" dose="25 mg" frequency="Twice daily" duration="30 days" />
              <PrescriptionCard drug="Aspirin" dose="75 mg" frequency="Once daily" duration="Ongoing" />
              <PrescriptionCard drug="Atorvastatin" dose="10 mg" frequency="Once at night" duration="60 days" />
            </div>
          </TabsContent>

          {/* Lab Results */}
          <TabsContent value="lab" style={{ paddingTop: 20 }}>
            <LabTable />
          </TabsContent>

          {/* Appointments */}
          <TabsContent value="appointments" style={{ paddingTop: 20 }}>
            <div style={{ maxWidth: 720 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: T.secondary, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Upcoming
              </h4>
              <AppointmentRow day="28" month="May" doctor="Dr. Ananya Mehta" specialty="Cardiology" status="Confirmed" statusColor="success" />
              <AppointmentRow day="4" month="Jun" doctor="Dr. Ravi Iyer" specialty="Echo Stress Test" status="Scheduled" statusColor="primary" />
              <h4 style={{ fontSize: 13, fontWeight: 600, color: T.secondary, margin: '20px 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Past
              </h4>
              <AppointmentRow day="12" month="May" doctor="Dr. Ananya Mehta" specialty="Cardiology" status="Completed" statusColor="default" past />
              <AppointmentRow day="3" month="Apr" doctor="Dr. Priya Nair" specialty="General Medicine" status="Completed" statusColor="default" past />
            </div>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" style={{ paddingTop: 20 }}>
            <div style={{ maxWidth: 680 }}>
              <DocumentRow name="Discharge Summary — Apr 2026.pdf" date="Uploaded 4 Apr 2026" />
              <DocumentRow name="ECG Report — Mar 2026.pdf" date="Uploaded 15 Mar 2026" />
              <DocumentRow name="Lab Panel — Feb 2026.pdf" date="Uploaded 2 Feb 2026" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Edit Patient Form (Drawer body) ─────────────────────────────────────────
function EditPatientForm({ onClose }) {
  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    fontSize: 14,
    color: T.heading,
    fontFamily: T.font,
    outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: T.secondary,
    marginBottom: 6,
    fontFamily: T.font,
  };
  const fieldStyle = { marginBottom: 16 };

  return (
    <form style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>First Name</label>
            <input style={inputStyle} defaultValue="Rohan" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Last Name</label>
            <input style={inputStyle} defaultValue="Sharma" />
          </div>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Mobile</label>
          <input style={inputStyle} defaultValue="+91 98765 43210" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" defaultValue="rohan.sharma@email.com" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Blood Group</label>
          <select style={inputStyle} defaultValue="B+">
            {['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Chief Complaint</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
            defaultValue="Chest tightness on exertion, mild breathlessness."
          />
        </div>
      </div>
    </form>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Story 1: Default
// ══════════════════════════════════════════════════════════════════════════════
export const Default = {
  name: 'Default',
  render: () => <PatientDetailLayout />,
};

// ══════════════════════════════════════════════════════════════════════════════
// Story 2: WithDrawerOpen
// ══════════════════════════════════════════════════════════════════════════════
function WithDrawerOpenComponent() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <PatientDetailLayout />
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side="right" size="xl">
          <DrawerHeader>
            <DrawerTitle>Edit Patient — Rohan Sharma</DrawerTitle>
            <DrawerDescription>
              Update patient demographics and clinical details.
            </DrawerDescription>
          </DrawerHeader>
          <EditPatientForm onClose={() => setOpen(false)} />
          <DrawerFooter>
            <TPButton variant="ghost" onClick={() => setOpen(false)}>Cancel</TPButton>
            <TPButton variant="solid">Save Changes</TPButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export const WithDrawerOpen = {
  name: 'WithDrawerOpen',
  render: () => <WithDrawerOpenComponent />,
};

// ══════════════════════════════════════════════════════════════════════════════
// Story 3: LoadingState — Skeleton Shimmer
// ══════════════════════════════════════════════════════════════════════════════
const Skel = ({ w = '100%', h = 16, br = 6 }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: br,
      background: '#E2E2EA',
      animation: 'shimmer 1.2s ease-in-out infinite alternate',
    }}
  />
);

function LoadingStateComponent() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          from { opacity: 0.5; }
          to   { opacity: 1; }
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#fff', fontFamily: T.font }}>
        {/* Top Bar Skeleton */}
        <div
          style={{
            height: 64,
            borderBottom: `1px solid ${T.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Skel w={80} h={14} />
            <Skel w={10} h={10} br={3} />
            <Skel w={100} h={14} />
            <Skel w={10} h={10} br={3} />
            <Skel w={200} h={14} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Skel w={110} h={34} br={8} />
            <Skel w={140} h={34} br={8} />
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <div
          style={{
            padding: 24,
            borderBottom: `1px solid ${T.border}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 20,
          }}
        >
          <Skel w={64} h={64} br={9999} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Skel w={180} h={22} />
              <Skel w={60} h={22} br={9999} />
            </div>
            <Skel w={320} h={14} />
            <Skel w={240} h={14} />
            <Skel w={200} h={14} />
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            {[1, 2, 3, 4].map((i) => (
              <Skel key={i} w={110} h={72} br={10} />
            ))}
          </div>
        </div>

        {/* Tab Bar Skeleton */}
        <div style={{ padding: '0 28px' }}>
          <div
            style={{
              display: 'flex',
              gap: 24,
              borderBottom: `1px solid ${T.border}`,
              paddingTop: 16,
              paddingBottom: 0,
            }}
          >
            {[120, 100, 100, 110, 90].map((w, i) => (
              <div key={i} style={{ paddingBottom: 12 }}>
                <Skel w={w} h={14} />
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Skel w="100%" h={64} br={10} />
            <Skel w="100%" h={64} br={10} />
            <Skel w="100%" h={64} br={10} />
            <Skel w="60%" h={64} br={10} />
          </div>
        </div>
      </div>
    </>
  );
}

export const LoadingState = {
  name: 'LoadingState',
  render: () => <LoadingStateComponent />,
};
