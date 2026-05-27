import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { FileText, FlaskConical, Pill } from '@/src/components/atoms/icons/lucide';

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs', 'ai-generated'],
};

export default meta;

const Panel = ({ children }) => (
  <div style={{ paddingTop: 12, color: 'var(--tp-slate-700, #3f3f46)' }}>
    {children}
  </div>
);

export const Playground = {
  args: { defaultValue: 'overview' },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <Tabs {...args}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Panel>Patient overview and summary.</Panel>
        </TabsContent>
        <TabsContent value="vitals">
          <Panel>Recorded vitals across visits.</Panel>
        </TabsContent>
        <TabsContent value="history">
          <Panel>Full medical history log.</Panel>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const WithDisabledTab = {
  args: { defaultValue: 'overview' },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <Tabs {...args}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Panel>Overview panel.</Panel>
        </TabsContent>
        <TabsContent value="billing">
          <Panel>Billing panel (disabled trigger).</Panel>
        </TabsContent>
        <TabsContent value="history">
          <Panel>History panel.</Panel>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const Controlled = {
  render: () => {
    const [value, setValue] = React.useState('vitals');
    return (
      <div style={{ maxWidth: 520 }}>
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel>Overview panel.</Panel>
          </TabsContent>
          <TabsContent value="vitals">
            <Panel>Vitals panel.</Panel>
          </TabsContent>
          <TabsContent value="history">
            <Panel>History panel.</Panel>
          </TabsContent>
        </Tabs>
        <p style={{ fontSize: 12, color: 'var(--tp-slate-500, #54545C)' }}>
          Active tab: {value}
        </p>
      </div>
    );
  },
};

/** Full patient profile with 5 realistic healthcare panels. */
export const PatientProfile = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <Panel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: 14 }}>
              {[
                ['Name', 'Rohan Sharma'],
                ['Age', '38 years'],
                ['Blood Group', 'B+'],
                ['Gender', 'Male'],
                ['Phone', '+91 98765 43210'],
                ['Allergies', 'Penicillin, Sulfa drugs'],
              ].map(([label, value]) => (
                <React.Fragment key={label}>
                  <span style={{ color: 'var(--tp-slate-400, #A1A1AA)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--tp-slate-800, #27272A)' }}>{value}</span>
                </React.Fragment>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* Vitals */}
        <TabsContent value="vitals">
          <Panel>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Date', 'BP (mmHg)', 'HR (bpm)', 'SpO2 (%)'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
                        fontWeight: 700,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--tp-slate-500, #54545C)',
                        background: 'var(--tp-slate-50, #F8FAFC)',
                        borderBottom: '1px solid var(--tp-slate-200, #E4E4E7)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['12 May 2026', '128/84', '76', '98'],
                  ['05 May 2026', '132/88', '80', '97'],
                  ['28 Apr 2026', '126/82', '74', '99'],
                ].map(([date, bp, hr, spo2]) => (
                  <tr key={date} style={{ borderBottom: '1px solid var(--tp-slate-100, #F4F4F5)' }}>
                    <td style={{ padding: '8px 10px', color: 'var(--tp-slate-600, #52525B)' }}>{date}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600 }}>{bp}</td>
                    <td style={{ padding: '8px 10px' }}>{hr}</td>
                    <td style={{ padding: '8px 10px', color: '#15803D', fontWeight: 600 }}>{spo2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </TabsContent>

        {/* Prescriptions */}
        <TabsContent value="prescriptions">
          <Panel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { drug: 'Amlodipine 5mg', dose: '1 tablet', freq: 'Once daily (morning)', duration: '30 days' },
                { drug: 'Atorvastatin 10mg', dose: '1 tablet', freq: 'Once daily (night)', duration: '90 days' },
              ].map((rx) => (
                <div
                  key={rx.drug}
                  style={{
                    border: '1px solid var(--tp-slate-200, #E4E4E7)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    background: '#fff',
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{rx.drug}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--tp-slate-500, #54545C)' }}>
                    {rx.dose} · {rx.freq} · {rx.duration}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* Lab Results */}
        <TabsContent value="labs">
          <Panel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { test: 'HbA1c', value: '6.2%', range: '< 5.7%', flag: true },
                { test: 'LDL Cholesterol', value: '142 mg/dL', range: '< 100 mg/dL', flag: true },
                { test: 'Serum Creatinine', value: '0.9 mg/dL', range: '0.7–1.2 mg/dL', flag: false },
              ].map((lab) => (
                <div
                  key={lab.test}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: lab.flag ? '#FFF7ED' : '#F8FAFC',
                    border: `1px solid ${lab.flag ? '#FED7AA' : 'var(--tp-slate-200, #E4E4E7)'}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{lab.test}</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: lab.flag ? '#B45309' : '#15803D',
                    }}
                  >
                    {lab.value}
                  </span>
                  <span style={{ color: 'var(--tp-slate-400, #A1A1AA)', fontSize: 11 }}>
                    Normal: {lab.range}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <Panel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Discharge Summary — Apr 2026', type: 'PDF', date: '28 Apr 2026' },
                { name: 'ECG Report — May 2026', type: 'PDF', date: '12 May 2026' },
              ].map((doc) => (
                <div
                  key={doc.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--tp-slate-200, #E4E4E7)',
                    background: '#fff',
                  }}
                >
                  {/* File icon */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      background: '#FEE2E2',
                      color: '#B91C1C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    PDF
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{doc.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--tp-slate-400, #A1A1AA)' }}>
                      {doc.date}
                    </p>
                  </div>
                  <button
                    style={{
                      background: 'none',
                      border: '1px solid var(--tp-slate-300, #D4D4D8)',
                      borderRadius: 4,
                      padding: '4px 10px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--tp-slate-600, #52525B)',
                    }}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

/** Tabs with inline SVG icons before each label. */
export const WithIconLabels = {
  render: () => (
    <div style={{ maxWidth: 500 }}>
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14} />
              Notes
            </span>
          </TabsTrigger>
          <TabsTrigger value="rx">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Pill size={14} />
              Rx
            </span>
          </TabsTrigger>
          <TabsTrigger value="labs">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <FlaskConical size={14} />
              Labs
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <Panel>
            <p style={{ margin: 0, fontSize: 14 }}>
              Patient reports mild chest discomfort on exertion. No radiation, no diaphoresis.
              Recommend stress test follow-up.
            </p>
          </Panel>
        </TabsContent>
        <TabsContent value="rx">
          <Panel>
            <p style={{ margin: 0, fontSize: 14 }}>
              Amlodipine 5mg OD · Atorvastatin 10mg HS
            </p>
          </Panel>
        </TabsContent>
        <TabsContent value="labs">
          <Panel>
            <p style={{ margin: 0, fontSize: 14 }}>
              LDL: 142 mg/dL (High) · HbA1c: 6.2% (Borderline)
            </p>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

/** Tabs with count badges indicating pending items. */
export const WithCountBadges = {
  render: () => {
    const Badge = ({ count }) => {
      if (count === 0) {
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 6,
              minWidth: 18,
              height: 18,
              borderRadius: 99,
              background: 'var(--tp-slate-200, #E4E4E7)',
              color: 'var(--tp-slate-500, #54545C)',
              fontSize: 10,
              fontWeight: 700,
              padding: '0 5px',
            }}
          >
            {count}
          </span>
        );
      }
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 6,
            minWidth: 18,
            height: 18,
            borderRadius: 99,
            background: '#FEE2E2',
            color: '#B91C1C',
            fontSize: 10,
            fontWeight: 700,
            padding: '0 5px',
          }}
        >
          {count}
        </span>
      );
    };

    const tabs = [
      { value: 'appointments', label: 'Appointments', count: 12 },
      { value: 'messages',     label: 'Messages',     count: 3  },
      { value: 'tasks',        label: 'Tasks',        count: 0  },
      { value: 'alerts',       label: 'Alerts',       count: 2  },
    ];

    return (
      <div style={{ maxWidth: 560 }}>
        <Tabs defaultValue="appointments">
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {t.label}
                  <Badge count={t.count} />
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              <Panel>
                {t.count > 0
                  ? `You have ${t.count} ${t.label.toLowerCase()} requiring attention.`
                  : `No ${t.label.toLowerCase()} at this time.`}
              </Panel>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  },
};

/** Full-width TabsList with evenly spaced triggers for time-range selection. */
export const FullWidthTabs = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Tabs defaultValue="today">
        <TabsList style={{ width: '100%', display: 'flex' }}>
          {['today', 'week', 'month'].map((v) => (
            <TabsTrigger
              key={v}
              value={v}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {v === 'today' ? 'Today' : v === 'week' ? 'This Week' : 'This Month'}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="today">
          <Panel>
            <p style={{ margin: 0, fontSize: 14 }}>18 appointments scheduled · 3 pending confirmation.</p>
          </Panel>
        </TabsContent>
        <TabsContent value="week">
          <Panel>
            <p style={{ margin: 0, fontSize: 14 }}>94 appointments this week · 7 cancellations.</p>
          </Panel>
        </TabsContent>
        <TabsContent value="month">
          <Panel>
            <p style={{ margin: 0, fontSize: 14 }}>412 appointments this month · Revenue ₹3,24,800.</p>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  ),
};
