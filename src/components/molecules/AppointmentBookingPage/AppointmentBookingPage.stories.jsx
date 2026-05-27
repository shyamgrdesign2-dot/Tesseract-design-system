import React, { useState } from 'react';
import { Button } from '@/src/components/atoms/Button/Button';
import { Input } from '@/src/components/atoms/Input/Input';
import { Radio, RadioGroup } from '@/src/components/atoms/Radio/Radio';
import { Skeleton } from '@/src/components/atoms/Skeleton/Skeleton';
import { Breadcrumbs, BreadcrumbItem } from '@/src/components/molecules/Breadcrumbs/Breadcrumbs';

export default {
  title: 'Compositions/Appointment Booking',
  parameters: { layout: 'fullscreen' },
  tags: ['ai-generated'],
};

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const DOCTORS = [
  {
    id: 0,
    initials: 'AK',
    color: '#4B4AD5',
    bg: '#EEEEFF',
    name: 'Dr. Anil Kumar',
    specialty: 'Cardiologist',
    next: 'Today, 10:00 AM',
  },
  {
    id: 1,
    initials: 'PM',
    color: '#16A34A',
    bg: '#DCFCE7',
    name: 'Dr. Priya Mehta',
    specialty: 'General Physician',
    next: 'Today, 11:30 AM',
  },
  {
    id: 2,
    initials: 'RS',
    color: '#D97706',
    bg: '#FEF3C7',
    name: 'Dr. Rahul Sharma',
    specialty: 'Dermatologist',
    next: 'Tomorrow, 09:00 AM',
  },
];

const DAYS = [
  { short: 'Mon', num: 2, month: 'Jun' },
  { short: 'Tue', num: 3, month: 'Jun' },
  { short: 'Wed', num: 4, month: 'Jun' },
  { short: 'Thu', num: 5, month: 'Jun' },
  { short: 'Fri', num: 6, month: 'Jun' },
  { short: 'Sat', num: 7, month: 'Jun' },
  { short: 'Sun', num: 8, month: 'Jun' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
];
const BOOKED_SLOTS = ['09:30', '14:30'];

// ─────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    background: '#F7F7FB',
    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
  },
  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    height: 56,
    background: '#fff',
    borderBottom: '1px solid #E2E2EA',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  layout: {
    maxWidth: 1080,
    margin: '0 auto',
    padding: 24,
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: 24,
    alignItems: 'start',
  },
  card: {
    background: '#fff',
    border: '1px solid #E2E2EA',
    borderRadius: 12,
    padding: 24,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 600,
    color: '#18181B',
    marginBottom: 12,
    marginTop: 20,
  },
  sectionHeadingFirst: {
    fontSize: 15,
    fontWeight: 600,
    color: '#18181B',
    marginBottom: 12,
    marginTop: 0,
  },
  doctorCard: (selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 10,
    border: selected ? '2px solid #4B4AD5' : '1px solid #E2E2EA',
    background: selected ? '#EEEEFF' : '#fff',
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'border 0.15s, background 0.15s',
  }),
  avatar: (color, bg) => ({
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: bg,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  }),
  doctorInfo: {
    flex: 1,
    minWidth: 0,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#18181B',
    marginBottom: 2,
  },
  doctorSpec: {
    fontSize: 13,
    color: '#70707B',
    marginBottom: 4,
  },
  nextChip: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 500,
    color: '#16A34A',
    background: '#DCFCE7',
    borderRadius: 20,
    padding: '2px 8px',
  },
  dayRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayPill: (selected) => ({
    width: 52,
    height: 64,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    border: selected ? 'none' : '1px solid #E2E2EA',
    background: selected ? '#4B4AD5' : '#fff',
    color: selected ? '#fff' : '#18181B',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    gap: 2,
  }),
  dayLabel: { fontSize: 11, fontWeight: 500 },
  dayNum: { fontSize: 18, fontWeight: 700 },
  timeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
    marginBottom: 8,
  },
  timeBtn: (selected, disabled) => ({
    padding: '8px 4px',
    borderRadius: 8,
    border: selected ? 'none' : '1px solid #E2E2EA',
    background: selected ? '#4B4AD5' : disabled ? '#F4F4F6' : '#fff',
    color: selected ? '#fff' : disabled ? '#B0B0BA' : '#18181B',
    fontSize: 13,
    fontWeight: selected ? 600 : 400,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s',
    textAlign: 'center',
  }),
  summaryCard: {
    background: '#fff',
    border: '1px solid #E2E2EA',
    borderRadius: 12,
    padding: 20,
    position: 'sticky',
    top: 80,
  },
  summaryHeading: {
    fontSize: 16,
    fontWeight: 700,
    color: '#18181B',
    marginBottom: 16,
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#3F3F46',
  },
  summaryEmoji: { fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 },
  divider: { height: 1, background: '#E2E2EA', margin: '16px 0' },
  finePrint: {
    fontSize: 12,
    color: '#70707B',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 1.5,
  },
};

// ─────────────────────────────────────────────
// Story 1: Default
// ─────────────────────────────────────────────
function DefaultPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(0);
  const [selectedDay, setSelectedDay] = useState(2);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [visitType, setVisitType] = useState('in-person');
  const [complaint, setComplaint] = useState('');

  const doctor = DOCTORS[selectedDoctor];
  const day = DAYS[selectedDay];

  return (
    <div style={s.page}>
      {/* Top bar */}
      <div style={s.topBar}>
        <Breadcrumbs>
          <BreadcrumbItem><a href="#" style={{ color: '#4B4AD5', textDecoration: 'none', fontSize: 14 }}>Home</a></BreadcrumbItem>
          <BreadcrumbItem><a href="#" style={{ color: '#4B4AD5', textDecoration: 'none', fontSize: 14 }}>Appointments</a></BreadcrumbItem>
          <BreadcrumbItem active><span style={{ fontSize: 14 }}>Book Appointment</span></BreadcrumbItem>
        </Breadcrumbs>
        <Button variant="ghost" theme="primary" size="sm">Cancel</Button>
      </div>

      {/* Two-column layout */}
      <div style={s.layout}>
        {/* LEFT: form card */}
        <div style={s.card}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#18181B', marginBottom: 20 }}>
            Book an appointment
          </div>

          {/* Select a doctor */}
          <div style={s.sectionHeadingFirst}>Select a doctor</div>
          <Input
            type="search"
            fullWidth
            placeholder="Search by name or specialty…"
            style={{ marginBottom: 16 }}
          />
          <div>
            {DOCTORS.map((doc) => (
              <div
                key={doc.id}
                style={s.doctorCard(selectedDoctor === doc.id)}
                onClick={() => setSelectedDoctor(doc.id)}
              >
                <div style={s.avatar(doc.color, doc.bg)}>{doc.initials}</div>
                <div style={s.doctorInfo}>
                  <div style={s.doctorName}>{doc.name}</div>
                  <div style={s.doctorSpec}>{doc.specialty}</div>
                  <span style={s.nextChip}>Next: {doc.next}</span>
                </div>
                <Button
                  variant={selectedDoctor === doc.id ? 'solid' : 'outline'}
                  theme="primary"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doc.id); }}
                >
                  {selectedDoctor === doc.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            ))}
          </div>

          {/* Pick date & time */}
          <div style={s.sectionHeading}>Pick a date &amp; time</div>
          <div style={s.dayRow}>
            {DAYS.map((day, i) => (
              <div
                key={i}
                style={s.dayPill(selectedDay === i)}
                onClick={() => setSelectedDay(i)}
              >
                <span style={s.dayLabel}>{day.short}</span>
                <span style={s.dayNum}>{day.num}</span>
                <span style={{ fontSize: 10, opacity: 0.8 }}>{day.month}</span>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div style={s.timeGrid}>
            {TIME_SLOTS.map((t) => {
              const isBooked = BOOKED_SLOTS.includes(t);
              const isSelected = selectedTime === t;
              return (
                <button
                  key={t}
                  style={s.timeBtn(isSelected, isBooked)}
                  disabled={isBooked}
                  onClick={() => !isBooked && setSelectedTime(t)}
                >
                  {t}
                  {isBooked && (
                    <div style={{ fontSize: 10, marginTop: 2, color: '#B0B0BA' }}>Booked</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Visit details */}
          <div style={s.sectionHeading}>Visit details</div>
          <RadioGroup
            value={visitType}
            onChange={setVisitType}
            name="visit-type"
            style={{ flexDirection: 'row', gap: 24, marginBottom: 16 }}
          >
            <Radio value="in-person" label="In-person" />
            <Radio value="teleconsult" label="Teleconsult" />
          </RadioGroup>
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Chief complaint or reason for visit…"
            rows={3}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              fontSize: 14,
              color: '#18181B',
              border: '1px solid #E2E2EA',
              borderRadius: 8,
              background: '#fff',
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none',
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* RIGHT: summary card */}
        <div style={s.summaryCard}>
          <div style={s.summaryHeading}>Booking summary</div>

          {/* Doctor */}
          <div style={s.summaryRow}>
            <div style={s.avatar(doctor.color, doctor.bg)}>{doctor.initials}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{doctor.name}</div>
              <div style={{ fontSize: 12, color: '#70707B' }}>{doctor.specialty}</div>
            </div>
          </div>

          {/* Date */}
          <div style={s.summaryRow}>
            <span style={s.summaryEmoji}>📅</span>
            <span>{day.short}, {day.num} {day.month} 2025</span>
          </div>

          {/* Time */}
          <div style={s.summaryRow}>
            <span style={s.summaryEmoji}>🕐</span>
            <span>{selectedTime}</span>
          </div>

          {/* Visit type */}
          <div style={s.summaryRow}>
            <span style={s.summaryEmoji}>{visitType === 'teleconsult' ? '📹' : '🏥'}</span>
            <span style={{ textTransform: 'capitalize' }}>{visitType === 'teleconsult' ? 'Teleconsult' : 'In-person'}</span>
          </div>

          <div style={s.divider} />

          <Button variant="solid" theme="primary" size="lg" style={{ width: '100%', marginBottom: 10 }}>
            Confirm booking
          </Button>
          <Button variant="ghost" theme="primary" size="md" style={{ width: '100%' }}>
            Save as draft
          </Button>

          <div style={s.finePrint}>
            By confirming, you agree to the cancellation policy.
          </div>
        </div>
      </div>
    </div>
  );
}

export const Default = {
  name: 'Default',
  render: () => <DefaultPage />,
};

// ─────────────────────────────────────────────
// Story 2: BookingConfirmed
// ─────────────────────────────────────────────
function ConfirmedPage() {
  return (
    <div style={{ ...s.page, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #E2E2EA',
        borderRadius: 16,
        padding: 40,
        maxWidth: 520,
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Checkmark */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#DCFCE7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#18181B', margin: '0 0 8px' }}>
          Appointment confirmed!
        </h2>
        <p style={{ fontSize: 15, color: '#70707B', margin: '0 0 24px', lineHeight: 1.6 }}>
          Your appointment has been booked successfully.
        </p>

        {/* Summary box */}
        <div style={{
          background: '#F7F7FB',
          border: '1px solid #E2E2EA',
          borderRadius: 10,
          padding: 16,
          textAlign: 'left',
          marginBottom: 24,
        }}>
          {[
            { label: 'Doctor', value: 'Dr. Anil Kumar — Cardiologist' },
            { label: 'Date', value: 'Wednesday, 4 Jun 2025' },
            { label: 'Time', value: '10:00 AM' },
            { label: 'Location', value: 'TatvaCare Clinic, Mumbai' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #E2E2EA', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#70707B', flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#18181B', textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          <Button variant="solid" theme="primary" size="md">View appointment</Button>
          <Button variant="outline" theme="primary" size="md">Book another</Button>
        </div>

        <p style={{ fontSize: 12, color: '#70707B', margin: 0, lineHeight: 1.6 }}>
          A confirmation has been sent to{' '}
          <strong>+91 98765 43210</strong> and{' '}
          <strong>rohan@example.com</strong>
        </p>
      </div>
    </div>
  );
}

export const BookingConfirmed = {
  name: '✅ Booking Confirmed',
  render: () => <ConfirmedPage />,
};

// ─────────────────────────────────────────────
// Story 3: LoadingState
// ─────────────────────────────────────────────
function LoadingPage() {
  return (
    <div style={s.page}>
      <style>{`
        @keyframes shimmer {
          from { background-position: -400px 0; }
          to   { background-position:  400px 0; }
        }
      `}</style>

      {/* Top bar */}
      <div style={s.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Skeleton variant="text" width={80} height={16} />
          <Skeleton variant="text" width={8} height={16} />
          <Skeleton variant="text" width={140} height={16} />
        </div>
        <Skeleton variant="text" width={72} height={32} radius={8} />
      </div>

      {/* Two-column layout */}
      <div style={s.layout}>
        {/* LEFT */}
        <div style={s.card}>
          <Skeleton variant="text" width={220} height={24} style={{ marginBottom: 20 }} />

          {/* Doctor search */}
          <Skeleton variant="text" width={120} height={16} style={{ marginBottom: 10 }} />
          <Skeleton variant="rectangular" width="100%" height={40} radius={8} style={{ marginBottom: 16 }} />

          {/* Doctor cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Skeleton variant="circular" width={48} height={48} />
              <div style={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={14} style={{ marginBottom: 6 }} />
                <Skeleton variant="text" width="40%" height={12} style={{ marginBottom: 6 }} />
                <Skeleton variant="text" width="50%" height={12} />
              </div>
              <Skeleton variant="text" width={72} height={32} radius={8} />
            </div>
          ))}

          {/* Date pills */}
          <Skeleton variant="text" width={140} height={16} style={{ marginTop: 20, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} variant="rectangular" width={52} height={64} radius={10} />
            ))}
          </div>

          {/* Time slots */}
          <div style={s.timeGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height={38} radius={8} />
            ))}
          </div>

          {/* Visit details */}
          <Skeleton variant="text" width={100} height={16} style={{ marginTop: 20, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="text" width={100} height={20} />
          </div>
          <Skeleton variant="rectangular" width="100%" height={72} radius={8} />
        </div>

        {/* RIGHT */}
        <div style={s.summaryCard}>
          <Skeleton variant="text" width={140} height={20} style={{ marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
            <Skeleton variant="circular" width={48} height={48} />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={14} style={{ marginBottom: 6 }} />
              <Skeleton variant="text" width="50%" height={12} />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="60%" height={14} />
            </div>
          ))}
          <div style={s.divider} />
          <Skeleton variant="rectangular" width="100%" height={44} radius={8} style={{ marginBottom: 10 }} />
          <Skeleton variant="rectangular" width="100%" height={40} radius={8} />
          <Skeleton variant="text" width="80%" height={12} style={{ margin: '12px auto 0' }} />
        </div>
      </div>
    </div>
  );
}

export const LoadingState = {
  name: '⏳ Loading State',
  render: () => <LoadingPage />,
};
