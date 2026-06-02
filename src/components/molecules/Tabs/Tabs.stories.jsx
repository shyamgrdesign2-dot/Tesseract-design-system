import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Scalable tabs with optional left/right TP icons, a right-side tag (count/status), a rounded active indicator, hover states, and three sizes.' } },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], description: 'Trigger density' },
    defaultValue: { control: 'text', description: 'Initially selected tab (uncontrolled)' },
    value: { control: false },
    onValueChange: { control: false },
  },
};

export default meta;

const Panel = ({ children }) => (
  <div style={{ paddingTop: 12, color: 'var(--tp-slate-700, #3f3f46)', fontSize: 14 }}>{children}</div>
);

// ── Playground — every knob lives in the Controls panel ───────────────────────
export const Playground = {
  args: {
    size: 'md',
    withLeftIcon: true,
    withRightIcon: false,
    withTag: true,
    tagTone: 'neutral',
    tab1Icon: 'profile',
    tab2Icon: 'activity',
    tab3Icon: 'clipboard',
  },
  argTypes: {
    size:          { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    withLeftIcon:  { control: 'boolean', name: 'left icon' },
    withRightIcon: { control: 'boolean', name: 'right icon' },
    withTag:       { control: 'boolean', name: 'right tag' },
    tagTone:       { control: 'inline-radio', options: ['neutral', 'primary', 'success', 'warning', 'error'], name: 'tag tone' },
    tab1Icon:      { control: 'text', tpIcon: true, name: 'tab 1 · icon', description: 'Pick from the TP Icons panel (or type a name)' },
    tab2Icon:      { control: 'text', tpIcon: true, name: 'tab 2 · icon', description: 'Pick from the TP Icons panel (or type a name)' },
    tab3Icon:      { control: 'text', tpIcon: true, name: 'tab 3 · icon', description: 'Pick from the TP Icons panel (or type a name)' },
  },
  render: ({ size, withLeftIcon, withRightIcon, withTag, tagTone, tab1Icon, tab2Icon, tab3Icon }) => {
    const tabsMeta = [
      { value: 'overview', label: 'Overview', tag: '5', icon: tab1Icon },
      { value: 'vitals', label: 'Vitals', tag: '3', icon: tab2Icon },
      { value: 'labs', label: 'Lab Results', tag: '2', icon: tab3Icon },
    ];
    return (
      <div style={{ maxWidth: 620, fontFamily: 'Inter, sans-serif' }}>
        <Tabs size={size} defaultValue="overview">
          <TabsList>
            {tabsMeta.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                leftIcon={withLeftIcon ? <TPLibraryIcon name={t.icon} /> : undefined}
                rightIcon={withRightIcon ? <TPLibraryIcon name="more" /> : undefined}
                tag={withTag ? t.tag : undefined}
                tagTone={tagTone}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabsMeta.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              <Panel>{t.label} panel.</Panel>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  },
};

// ── Custom tabs — add / edit / remove any number via the object control ───────
export const CustomTabs = {
  name: 'Custom Tabs (add your own)',
  parameters: {
    docs: { description: { story: 'Edit the `tabs` array in Controls to add, remove, or reorder tabs. Every tab uses the same trigger UI — set `label`, `icon` (any TP library name), `tag`, and `tone`. With many tabs the row scrolls horizontally.' } },
  },
  args: {
    size: 'md',
    withTag: true,
    tabs: [
      { label: 'Overview', icon: 'profile', tag: '5', tone: 'neutral' },
      { label: 'Vitals', icon: 'activity', tag: '3', tone: 'neutral' },
      { label: 'Prescriptions', icon: 'note', tag: '', tone: 'neutral' },
      { label: 'Lab Results', icon: 'clipboard', tag: '2', tone: 'warning' },
    ],
  },
  argTypes: {
    size:    { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    withTag: { control: 'boolean', name: 'show tags' },
    tabs:    { control: 'object', description: 'Each: { label, icon, tag, tone }. Add a row to add a tab.' },
  },
  render: ({ size, withTag, tabs }) => {
    const items = (tabs || []).map((t, i) => ({ ...t, value: t.value || `tab-${i}` }));
    const [value, setValue] = React.useState(items[0]?.value);
    const current = items.some((t) => t.value === value) ? value : items[0]?.value;
    return (
      <div style={{ maxWidth: 640, fontFamily: 'Inter, sans-serif' }}>
        <Tabs size={size} value={current} onValueChange={setValue}>
          <TabsList>
            {items.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                leftIcon={t.icon ? <TPLibraryIcon name={t.icon} /> : undefined}
                tag={withTag && t.tag ? t.tag : undefined}
                tagTone={t.tone || 'neutral'}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {items.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              <Panel>{t.label} panel.</Panel>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  },
};

// ── Horizontal scroll — many tabs in a narrow frame ───────────────────────────
export const HorizontalScroll = {
  name: 'Horizontal Scroll (small screens)',
  parameters: {
    docs: { description: { story: 'When tabs exceed the available width the row scrolls horizontally — triggers keep their natural width and never wrap or squish. Resize the frame to see it.' } },
  },
  render: () => {
    const labels = ['Overview', 'Vitals', 'Prescriptions', 'Lab Results', 'Documents', 'Billing', 'Insurance', 'History', 'Allergies', 'Immunizations'];
    return (
      <div style={{ width: 360, border: '1px dashed var(--tp-slate-200, #e2e2ea)', borderRadius: 10, padding: 8, fontFamily: 'Inter, sans-serif' }}>
        <Tabs defaultValue="overview">
          <TabsList>
            {labels.map((l, i) => (
              <TabsTrigger key={l} value={i === 0 ? 'overview' : l.toLowerCase()} leftIcon={<TPLibraryIcon name="folder" />}>
                {l}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="overview"><Panel>Scroll the tab row →</Panel></TabsContent>
          {labels.slice(1).map((l) => (
            <TabsContent key={l} value={l.toLowerCase()}><Panel>{l} panel.</Panel></TabsContent>
          ))}
        </Tabs>
      </div>
    );
  },
};

// ── Sizes ────────────────────────────────────────────────────────────────────
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 520 }}>
      {['sm', 'md', 'lg'].map((size) => (
        <Tabs key={size} size={size} defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview" leftIcon={<TPIcon name="profile" size={16} />}>Overview</TabsTrigger>
            <TabsTrigger value="vitals" leftIcon={<TPIcon name="heart" size={16} />}>Vitals</TabsTrigger>
            <TabsTrigger value="history" leftIcon={<TPIcon name="document" size={16} />}>History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><Panel>Size: {size}</Panel></TabsContent>
          <TabsContent value="vitals"><Panel>Vitals</Panel></TabsContent>
          <TabsContent value="history"><Panel>History</Panel></TabsContent>
        </Tabs>
      ))}
    </div>
  ),
};

// ── Left icons (TP Icons) ─────────────────────────────────────────────────────
export const WithLeftIcons = {
  name: 'Icons · Left',
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes" leftIcon={<TPIcon name="document" size={16} />}>Notes</TabsTrigger>
          <TabsTrigger value="rx" leftIcon={<TPIcon name="health" size={16} />}>Prescription</TabsTrigger>
          <TabsTrigger value="labs" leftIcon={<TPIcon name="clipboard" size={16} />}>Labs</TabsTrigger>
        </TabsList>
        <TabsContent value="notes"><Panel>Visit notes.</Panel></TabsContent>
        <TabsContent value="rx"><Panel>Prescription.</Panel></TabsContent>
        <TabsContent value="labs"><Panel>Lab results.</Panel></TabsContent>
      </Tabs>
    </div>
  ),
};

// ── Left + right icons ────────────────────────────────────────────────────────
export const WithLeftAndRightIcons = {
  name: 'Icons · Left + Right',
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Tabs defaultValue="patient">
        <TabsList>
          <TabsTrigger
            value="patient"
            leftIcon={<TPIcon name="profile" size={16} />}
            rightIcon={<TPIcon name="chevron-down" size={16} />}
          >
            Patient
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            leftIcon={<TPIcon name="calendar" size={16} />}
            rightIcon={<TPIcon name="more-horizontal" size={16} />}
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            leftIcon={<TPIcon name="message" size={16} />}
            rightIcon={<TPIcon name="more-horizontal" size={16} />}
          >
            Messages
          </TabsTrigger>
        </TabsList>
        <TabsContent value="patient"><Panel>Patient details.</Panel></TabsContent>
        <TabsContent value="schedule"><Panel>Schedule.</Panel></TabsContent>
        <TabsContent value="messages"><Panel>Messages.</Panel></TabsContent>
      </Tabs>
    </div>
  ),
};

// ── Right-side tags (count + status tones) ────────────────────────────────────
export const WithTags = {
  name: 'Tags · Right',
  render: () => {
    const tabs = [
      { value: 'appointments', label: 'Appointments', icon: 'calendar', tag: '12', tone: 'primary' },
      { value: 'messages', label: 'Messages', icon: 'message', tag: '3', tone: 'error' },
      { value: 'tasks', label: 'Tasks', icon: 'clipboard', tag: '0', tone: 'neutral' },
      { value: 'alerts', label: 'Alerts', icon: 'notification', tag: '2', tone: 'warning' },
    ];
    return (
      <div style={{ maxWidth: 640 }}>
        <Tabs defaultValue="appointments">
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} leftIcon={<TPIcon name={t.icon} size={16} />} tag={t.tag} tagTone={t.tone}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              <Panel>{t.tag !== '0' ? `${t.tag} ${t.label.toLowerCase()} need attention.` : `No ${t.label.toLowerCase()}.`}</Panel>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  },
};

// ── Disabled trigger ──────────────────────────────────────────────────────────
export const WithDisabledTab = {
  args: { defaultValue: 'overview' },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <Tabs {...args}>
        <TabsList>
          <TabsTrigger value="overview" leftIcon={<TPIcon name="profile" size={16} />}>Overview</TabsTrigger>
          <TabsTrigger value="billing" leftIcon={<TPIcon name="document" size={16} />} disabled>Billing</TabsTrigger>
          <TabsTrigger value="history" leftIcon={<TPIcon name="clipboard" size={16} />}>History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><Panel>Overview panel.</Panel></TabsContent>
        <TabsContent value="billing"><Panel>Billing panel (disabled trigger).</Panel></TabsContent>
        <TabsContent value="history"><Panel>History panel.</Panel></TabsContent>
      </Tabs>
    </div>
  ),
};

// ── Controlled ────────────────────────────────────────────────────────────────
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
          <TabsContent value="overview"><Panel>Overview panel.</Panel></TabsContent>
          <TabsContent value="vitals"><Panel>Vitals panel.</Panel></TabsContent>
          <TabsContent value="history"><Panel>History panel.</Panel></TabsContent>
        </Tabs>
        <p style={{ fontSize: 12, color: 'var(--tp-slate-500, #54545C)' }}>Active tab: {value}</p>
      </div>
    );
  },
};

// ── Full-width ────────────────────────────────────────────────────────────────
export const FullWidthTabs = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Tabs defaultValue="today">
        <TabsList style={{ width: '100%' }}>
          {['today', 'week', 'month'].map((v) => (
            <TabsTrigger key={v} value={v} style={{ flex: 1, justifyContent: 'center' }}>
              {v === 'today' ? 'Today' : v === 'week' ? 'This Week' : 'This Month'}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="today"><Panel>18 appointments scheduled · 3 pending confirmation.</Panel></TabsContent>
        <TabsContent value="week"><Panel>94 appointments this week · 7 cancellations.</Panel></TabsContent>
        <TabsContent value="month"><Panel>412 appointments this month · Revenue ₹3,24,800.</Panel></TabsContent>
      </Tabs>
    </div>
  ),
};

// ── Realistic: patient profile with icons + a labs tag ────────────────────────
export const PatientProfile = {
  render: () => (
    <div style={{ maxWidth: 620, fontFamily: 'Inter, sans-serif' }}>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" leftIcon={<TPIcon name="profile" size={16} />}>Overview</TabsTrigger>
          <TabsTrigger value="vitals" leftIcon={<TPIcon name="heart" size={16} />}>Vitals</TabsTrigger>
          <TabsTrigger value="prescriptions" leftIcon={<TPIcon name="health" size={16} />}>Prescriptions</TabsTrigger>
          <TabsTrigger value="labs" leftIcon={<TPIcon name="clipboard" size={16} />} tag="2" tagTone="warning">Lab Results</TabsTrigger>
          <TabsTrigger value="documents" leftIcon={<TPIcon name="document" size={16} />}>Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Panel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: 14 }}>
              {[
                ['Name', 'Rohan Sharma'], ['Age', '38 years'], ['Blood Group', 'B+'],
                ['Gender', 'Male'], ['Phone', '+91 98765 43210'], ['Allergies', 'Penicillin, Sulfa drugs'],
              ].map(([label, value]) => (
                <React.Fragment key={label}>
                  <span style={{ color: 'var(--tp-slate-400, #A1A1AA)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--tp-slate-800, #27272A)' }}>{value}</span>
                </React.Fragment>
              ))}
            </div>
          </Panel>
        </TabsContent>
        <TabsContent value="vitals"><Panel>BP 128/84 · HR 76 · SpO₂ 98%.</Panel></TabsContent>
        <TabsContent value="prescriptions"><Panel>Amlodipine 5mg OD · Atorvastatin 10mg HS.</Panel></TabsContent>
        <TabsContent value="labs"><Panel>2 results flagged: LDL 142 mg/dL (High), HbA1c 6.2% (Borderline).</Panel></TabsContent>
        <TabsContent value="documents"><Panel>Discharge summary · ECG report.</Panel></TabsContent>
      </Tabs>
    </div>
  ),
};
