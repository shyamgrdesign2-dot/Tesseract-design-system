import React from 'react';
import { Button } from '@/src/components/atoms';
import { MedicalIcon } from '@/src/components/atoms/MedicalIcon/MedicalIcon';
import { Spinner } from '@/src/components/atoms/Spinner/Spinner';
import { Badge } from '@/src/components/atoms/Badge/Badge';
import { Avatar } from '@/src/components/atoms/Avatar/Avatar';
import { Skeleton } from '@/src/components/atoms/Skeleton/Skeleton';

export default {
  title: 'Molecules/DashboardPage',
  tags: ['autodocs', 'ai-generated'],
  parameters: { layout: 'fullscreen' },
};

// ── Design tokens (inline) ────────────────────────────────────────────────────
const C = {
  bg:        '#F7F7FB',
  white:     '#FFFFFF',
  border:    '#E2E2EA',
  text:      '#171725',
  secondary: '#54545C',
  muted:     '#8F8FA0',
  primary:   '#4B4AD5',
  primaryBg: '#EEF0FF',
  green:     '#15803D',
  greenBg:   '#DCFCE7',
  amber:     '#92400E',
  amberBg:   '#FEF3C7',
  red:       '#9F1239',
  redBg:     '#FFE4E6',
};

const font = { fontFamily: 'Inter, sans-serif' };

// ── Shared sub-components ─────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, delta, deltaDir = 'up', color = C.primary, bg = C.primaryBg }) => (
  <div style={{ ...font, background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MedicalIcon name={icon} size={22} color={color} variant="bulk" />
      </div>
      {delta && (
        <span style={{ fontSize: 11, fontWeight: 600, color: deltaDir === 'up' ? C.green : C.red, background: deltaDir === 'up' ? C.greenBg : C.redBg, padding: '3px 8px', borderRadius: 99 }}>
          {deltaDir === 'up' ? '↑' : '↓'} {delta}
        </span>
      )}
    </div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 13, color: C.secondary, marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

const AppointmentRow = ({ name, initials, time, type, status, bgColor = '#EEF0FF', textColor = C.primary }) => {
  const statusColors = {
    Confirmed: { color: C.green, bg: C.greenBg },
    Pending:   { color: C.amber, bg: C.amberBg },
    Arrived:   { color: C.primary, bg: C.primaryBg },
    Cancelled: { color: C.red, bg: C.redBg },
  };
  const sc = statusColors[status] || statusColors.Pending;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: bgColor, color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...font, fontSize: 14, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        <div style={{ ...font, fontSize: 12, color: C.secondary }}>{type}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ ...font, fontSize: 12, fontWeight: 600, color: C.text }}>{time}</div>
        <span style={{ ...font, fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg, padding: '2px 8px', borderRadius: 99, display: 'inline-block', marginTop: 2 }}>{status}</span>
      </div>
    </div>
  );
};

const SectionCard = ({ title, action, children, style = {} }) => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', ...style }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ ...font, fontWeight: 700, fontSize: 15, color: C.text }}>{title}</span>
      {action}
    </div>
    <div style={{ padding: '4px 20px 16px' }}>
      {children}
    </div>
  </div>
);

const PatientQueueItem = ({ token, name, age, wait, urgent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
    <div style={{ ...font, width: 32, height: 32, borderRadius: 8, background: urgent ? C.redBg : C.primaryBg, color: urgent ? C.red : C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
      {token}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ ...font, fontSize: 13, fontWeight: 600, color: C.text }}>{name}</div>
      <div style={{ ...font, fontSize: 11, color: C.secondary }}>{age} yrs · Wait: {wait}</div>
    </div>
    {urgent && <span style={{ ...font, fontSize: 10, fontWeight: 700, color: C.red, background: C.redBg, padding: '2px 6px', borderRadius: 4 }}>URGENT</span>}
  </div>
);

const QuickActionBtn = ({ icon, label, color, bg, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ ...font, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 10px', border: `1px solid ${C.border}`, borderRadius: 12, background: C.white, cursor: 'pointer', transition: 'background 120ms', flex: '1 1 0' }}
    onMouseEnter={e => e.currentTarget.style.background = '#F7F7FB'}
    onMouseLeave={e => e.currentTarget.style.background = C.white}
  >
    <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <MedicalIcon name={icon} size={22} color={color} variant="bulk" />
    </div>
    <span style={{ fontSize: 12, fontWeight: 600, color: C.secondary, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
  </button>
);

const VitalItem = ({ label, value, unit, status }) => {
  const statusColor = status === 'high' ? C.amber : status === 'critical' ? C.red : C.green;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 14px', background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
      <div style={{ ...font, fontSize: 11, color: C.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ ...font, fontSize: 20, fontWeight: 700, color: statusColor, lineHeight: 1.2 }}>{value}<span style={{ fontSize: 11, fontWeight: 500, color: C.secondary, marginLeft: 3 }}>{unit}</span></div>
    </div>
  );
};

// ── Sidebar nav ───────────────────────────────────────────────────────────────
const Sidebar = ({ active = 'dashboard' }) => {
  const items = [
    { id: 'dashboard', icon: 'grid', label: 'Dashboard' },
    { id: 'appointments', icon: 'calendar-check', label: 'Appointments' },
    { id: 'patients', icon: 'user-medical', label: 'Patients' },
    { id: 'rx', icon: 'pill', label: 'Rx Pad' },
    { id: 'labs', icon: 'test-tube', label: 'Lab Results' },
    { id: 'analytics', icon: 'chart-bar', label: 'Analytics' },
  ];
  return (
    <aside style={{ width: 220, background: C.white, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: 4, flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ ...font, padding: '8px 12px 20px', fontWeight: 800, fontSize: 18, color: C.primary, letterSpacing: '-0.02em' }}>
        tatva<span style={{ color: C.text }}>practice</span>
      </div>
      {items.map(item => (
        <button
          key={item.id}
          type="button"
          style={{
            ...font,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 10, border: 'none',
            background: active === item.id ? C.primaryBg : 'transparent',
            color: active === item.id ? C.primary : C.secondary,
            fontWeight: active === item.id ? 700 : 500,
            fontSize: 14,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <MedicalIcon name={item.icon} size={18} color={active === item.id ? C.primary : C.muted} variant={active === item.id ? 'bulk' : 'line'} />
          {item.label}
        </button>
      ))}
      {/* Bottom user */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.primaryBg, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>AM</div>
        <div>
          <div style={{ ...font, fontSize: 13, fontWeight: 600, color: C.text }}>Dr. Ananya</div>
          <div style={{ ...font, fontSize: 11, color: C.muted }}>Cardiologist</div>
        </div>
      </div>
    </aside>
  );
};

// ── TopBar ────────────────────────────────────────────────────────────────────
const TopBar = ({ title = 'Dashboard', subtitle }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', background: C.white, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
    <div>
      <div style={{ ...font, fontSize: 18, fontWeight: 700, color: C.text }}>{title}</div>
      {subtitle && <div style={{ ...font, fontSize: 13, color: C.secondary }}>{subtitle}</div>}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button type="button" aria-label="Notifications" style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <MedicalIcon name="bell" size={18} color={C.secondary} variant="line" />
        <span aria-hidden="true" style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: '50%', background: '#E11D48', border: '2px solid #fff' }} />
      </button>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.primaryBg, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>AM</div>
    </div>
  </div>
);

// ── Stories ───────────────────────────────────────────────────────────────────

/** Full clinic dashboard: stats, today's appointments, patient queue, and quick actions. */
export const Default = {
  name: '🏥 Clinic Dashboard',
  render: () => {
    const [queueOpen, setQueueOpen] = React.useState(false);
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg }}>
        <Sidebar active="dashboard" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopBar title="Good morning, Dr. Ananya" subtitle="Wednesday, 27 May 2026 · Apollo Clinic" />

          {/* Main scrollable area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
              <StatCard icon="calendar-check" label="Today's Appointments" value="18" delta="12%" deltaDir="up" color={C.primary} bg={C.primaryBg} />
              <StatCard icon="user-medical" label="Patients Seen" value="11" delta="3" deltaDir="up" color="#15803D" bg={C.greenBg} />
              <StatCard icon="hourglass" label="Avg Wait Time" value="14m" delta="2m" deltaDir="down" color={C.amber} bg={C.amberBg} />
              <StatCard icon="stethoscope" label="Pending Reports" value="5" color="#9F1239" bg={C.redBg} />
            </div>

            {/* Quick actions */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...font, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Quick Actions</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <QuickActionBtn icon="calendar-plus" label="New Appointment" color={C.primary} bg={C.primaryBg} />
                <QuickActionBtn icon="user-plus" label="Register Patient" color="#15803D" bg={C.greenBg} />
                <QuickActionBtn icon="pill" label="Write Prescription" color="#7C3AED" bg="#EDE9FE" />
                <QuickActionBtn icon="test-tube" label="Order Lab Test" color={C.amber} bg={C.amberBg} />
                <QuickActionBtn icon="file-medical" label="Upload Document" color="#0369A1" bg="#E0F2FE" />
                <QuickActionBtn icon="ambulance" label="Emergency Queue" color={C.red} bg={C.redBg} />
              </div>
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>

              {/* Today's appointments */}
              <SectionCard
                title="Today's Appointments"
                action={<Button size="sm" variant="ghost">View all →</Button>}
              >
                <AppointmentRow name="Rohan Sharma" initials="RS" time="10:00 AM" type="General Consultation" status="Arrived" bgColor="#EDE9FE" textColor="#7C3AED" />
                <AppointmentRow name="Priya Nair" initials="PN" time="10:30 AM" type="Follow-up · Hypertension" status="Confirmed" bgColor={C.primaryBg} textColor={C.primary} />
                <AppointmentRow name="Suresh Kumar" initials="SK" time="11:00 AM" type="Cardiology Review" status="Pending" bgColor="#FEF9C3" textColor={C.amber} />
                <AppointmentRow name="Asha Mehta" initials="AM" time="11:30 AM" type="ECG + Consultation" status="Confirmed" bgColor={C.greenBg} textColor={C.green} />
                <AppointmentRow name="Vikram Patel" initials="VP" time="12:00 PM" type="Blood Pressure Check" status="Confirmed" bgColor="#FCE7F3" textColor="#BE185D" />
                <AppointmentRow name="Deepa Iyer" initials="DI" time="12:30 PM" type="Diabetic Review" status="Cancelled" bgColor="#F1F5F9" textColor="#64748B" />
                <div style={{ paddingTop: 8, textAlign: 'center' }}>
                  <span style={{ ...font, fontSize: 12, color: C.muted }}>+ 12 more appointments today</span>
                </div>
              </SectionCard>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Patient queue */}
                <SectionCard title="Current Queue" action={<span style={{ ...font, fontSize: 12, fontWeight: 700, color: C.primary, background: C.primaryBg, padding: '3px 8px', borderRadius: 99 }}>6 waiting</span>}>
                  <PatientQueueItem token="T01" name="Rohan Sharma" age={38} wait="5m" />
                  <PatientQueueItem token="T02" name="Kavita Reddy" age={52} wait="18m" urgent />
                  <PatientQueueItem token="T03" name="Arun Joshi" age={44} wait="22m" />
                  <PatientQueueItem token="T04" name="Meena Das" age={61} wait="35m" />
                </SectionCard>

                {/* Recent vitals for active patient */}
                <SectionCard title="Active Patient — Rohan Sharma">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                    <VitalItem label="BP" value="128/84" unit="mmHg" status="high" />
                    <VitalItem label="Heart Rate" value="76" unit="bpm" status="normal" />
                    <VitalItem label="SpO₂" value="98" unit="%" status="normal" />
                    <VitalItem label="Temp" value="37.2" unit="°C" status="normal" />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <Button size="sm" style={{ flex: 1 }}>Start Consultation</Button>
                    <Button size="sm" variant="ghost">View Profile</Button>
                  </div>
                </SectionCard>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/** Appointments view — today's full schedule with filter controls. */
export const AppointmentsView = {
  name: '📅 Appointments View',
  render: () => {
    const [filter, setFilter] = React.useState('all');
    const appointments = [
      { id: 1, name: 'Rohan Sharma',   time: '10:00', type: 'Consultation',  status: 'Arrived',   initials: 'RS', bg: '#EDE9FE', fg: '#7C3AED', dept: 'Cardiology' },
      { id: 2, name: 'Priya Nair',    time: '10:30', type: 'Follow-up',     status: 'Confirmed',  initials: 'PN', bg: C.primaryBg, fg: C.primary, dept: 'General' },
      { id: 3, name: 'Suresh Kumar',  time: '11:00', type: 'Review',        status: 'Pending',    initials: 'SK', bg: '#FEF9C3', fg: C.amber, dept: 'Cardiology' },
      { id: 4, name: 'Asha Mehta',    time: '11:30', type: 'ECG',           status: 'Confirmed',  initials: 'AM', bg: C.greenBg, fg: C.green, dept: 'Cardiology' },
      { id: 5, name: 'Vikram Patel',  time: '12:00', type: 'BP Check',      status: 'Confirmed',  initials: 'VP', bg: '#FCE7F3', fg: '#BE185D', dept: 'General' },
      { id: 6, name: 'Deepa Iyer',    time: '12:30', type: 'Diabetic Rev',  status: 'Cancelled',  initials: 'DI', bg: '#F1F5F9', fg: '#64748B', dept: 'Endocrinology' },
      { id: 7, name: 'Rajesh Nair',   time: '14:00', type: 'Post-op',       status: 'Confirmed',  initials: 'RN', bg: C.primaryBg, fg: C.primary, dept: 'Surgery' },
      { id: 8, name: 'Kavya Singh',   time: '14:30', type: 'New Patient',   status: 'Pending',    initials: 'KS', bg: '#FEF9C3', fg: C.amber, dept: 'Neurology' },
    ];
    const statuses = ['all', 'Confirmed', 'Pending', 'Arrived', 'Cancelled'];
    const visible = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
    const statusColors = { Confirmed: { c: C.green, bg: C.greenBg }, Pending: { c: C.amber, bg: C.amberBg }, Arrived: { c: C.primary, bg: C.primaryBg }, Cancelled: { c: '#64748B', bg: '#F1F5F9' } };
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg }}>
        <Sidebar active="appointments" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopBar title="Appointments" subtitle="Wednesday, 27 May 2026" />
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {statuses.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilter(s)}
                  style={{ ...font, padding: '6px 16px', borderRadius: 99, border: '1px solid', borderColor: filter === s ? C.primary : C.border, background: filter === s ? C.primaryBg : C.white, color: filter === s ? C.primary : C.secondary, fontWeight: filter === s ? 700 : 500, fontSize: 13, cursor: 'pointer' }}
                >
                  {s === 'all' ? 'All' : s}
                  {s !== 'all' && <span style={{ marginLeft: 6, fontSize: 11, color: statusColors[s].c }}>{appointments.filter(a => a.status === s).length}</span>}
                </button>
              ))}
              <div style={{ marginLeft: 'auto' }}>
                <Button size="sm">+ New Appointment</Button>
              </div>
            </div>

            {/* Appointment cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visible.map(appt => {
                const sc = statusColors[appt.status];
                return (
                  <div key={appt.id} style={{ ...font, background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Time column */}
                    <div style={{ width: 56, textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{appt.time}</div>
                      <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>AM</div>
                    </div>
                    <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />
                    {/* Avatar */}
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: appt.bg, color: appt.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{appt.initials}</div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{appt.name}</div>
                      <div style={{ fontSize: 12, color: C.secondary }}>{appt.type} · {appt.dept}</div>
                    </div>
                    {/* Status */}
                    <span style={{ fontSize: 12, fontWeight: 600, color: sc.c, background: sc.bg, padding: '4px 12px', borderRadius: 99 }}>{appt.status}</span>
                    {/* Actions */}
                    <button type="button" aria-label={`Actions for ${appt.name}`} style={{ padding: '6px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', color: C.secondary, display: 'flex', alignItems: 'center' }}>
                      <MedicalIcon name="ellipsis" size={16} color={C.muted} variant="line" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/** Analytics dashboard with revenue, appointment trends, and department breakdown. */
export const AnalyticsView = {
  name: '📊 Analytics View',
  render: () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenue = [2.1, 2.8, 3.2, 2.9, 3.8, 4.2];
    const maxRev = Math.max(...revenue);
    const deptData = [
      { dept: 'Cardiology', patients: 142, pct: 38, color: C.primary, bg: C.primaryBg },
      { dept: 'General OPD', patients: 98, pct: 26, color: C.green, bg: C.greenBg },
      { dept: 'Neurology', patients: 64, pct: 17, color: '#7C3AED', bg: '#EDE9FE' },
      { dept: 'Orthopedics', patients: 44, pct: 12, color: C.amber, bg: C.amberBg },
      { dept: 'Other', patients: 26, pct: 7, color: '#64748B', bg: '#F1F5F9' },
    ];
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg }}>
        <Sidebar active="analytics" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopBar title="Analytics" subtitle="Jan 2026 – Jun 2026 · Apollo Clinic" />
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
              <StatCard icon="currency" label="Total Revenue" value="₹18.9L" delta="22%" deltaDir="up" color={C.primary} bg={C.primaryBg} />
              <StatCard icon="user-medical" label="Total Patients" value="374" delta="15%" deltaDir="up" color={C.green} bg={C.greenBg} />
              <StatCard icon="calendar-check" label="Appointments" value="1,241" delta="18%" deltaDir="up" color="#7C3AED" bg="#EDE9FE" />
              <StatCard icon="star" label="Avg Rating" value="4.8" delta="0.2" deltaDir="up" color={C.amber} bg={C.amberBg} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>

              {/* Revenue bar chart */}
              <SectionCard title="Monthly Revenue (₹ Lakhs)">
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 160, padding: '16px 0 0' }}>
                  {months.map((month, i) => (
                    <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ ...font, fontSize: 11, fontWeight: 600, color: C.secondary }}>{revenue[i].toFixed(1)}</div>
                      <div
                        style={{
                          width: '100%',
                          height: `${(revenue[i] / maxRev) * 110}px`,
                          background: i === months.length - 1 ? C.primary : C.primaryBg,
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 300ms',
                        }}
                      />
                      <div style={{ ...font, fontSize: 12, color: C.secondary }}>{month}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Department breakdown */}
              <SectionCard title="By Department">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                  {deptData.map(d => (
                    <div key={d.dept}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ ...font, fontSize: 13, color: C.text, fontWeight: 500 }}>{d.dept}</span>
                        <span style={{ ...font, fontSize: 13, color: C.secondary }}>{d.patients}</span>
                      </div>
                      <div style={{ height: 6, background: '#F0F0F8', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 99, transition: 'width 400ms' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

          </div>
        </div>
      </div>
    );
  },
};

/** Loading state — skeleton placeholders while dashboard data fetches. */
export const LoadingState = {
  name: '⏳ Loading State',
  render: () => (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg }}>
      <Sidebar active="dashboard" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Dashboard" />
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {/* Stat skeletons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Skeleton variant="rounded" width={44} height={44} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Skeleton variant="text" width="60%" height={28} />
                  <Skeleton variant="text" width="80%" height={16} />
                </div>
              </div>
            ))}
          </div>
          {/* Content skeletons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Skeleton variant="text" width="40%" height={20} />
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Skeleton variant="circular" width={38} height={38} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Skeleton variant="text" width="55%" height={14} />
                    <Skeleton variant="text" width="35%" height={12} />
                  </div>
                  <Skeleton variant="rounded" width={70} height={22} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Skeleton variant="text" width="50%" height={20} />
                {[0,1,2].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Skeleton variant="rounded" width={32} height={32} />
                    <div style={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={13} />
                      <Skeleton variant="text" width="40%" height={11} style={{ marginTop: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
