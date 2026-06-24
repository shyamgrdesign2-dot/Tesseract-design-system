import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Scalable tabs with optional left/right Tesseract icons, a right-side tag (count/status), a rounded active indicator, hover states, and three sizes.' } },
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
  <div style={{ paddingTop: 12, color: 'var(--tesseract-slate-700, #3f3f46)', fontSize: 14 }}>{children}</div>
);

// Build an accurate "Show code" snippet from the Playground controls.
const tabsCode = ({ size, variant, accent, activationMode, orientation, fullWidth, withLeftIcon, withTag, tagTone, tab1Icon }) => {
  const rootProps = [`defaultValue="overview"`];
  if (size && size !== 'md') rootProps.push(`size="${size}"`);
  if (variant && variant !== 'line') rootProps.push(`variant="${variant}"`);
  if (accent) rootProps.push(`accent="${accent}"`);
  if (activationMode && activationMode !== 'automatic') rootProps.push(`activationMode="${activationMode}"`);
  if (orientation && orientation !== 'horizontal') rootProps.push(`orientation="${orientation}"`);
  const listProps = fullWidth ? ' fullWidth' : '';
  const left = withLeftIcon ? ` leftIcon={<TPLibraryIcon name="${tab1Icon || 'profile'}" />}` : '';
  const tag = withTag ? ` tag="5"${tagTone && tagTone !== 'neutral' ? ` tagTone="${tagTone}"` : ''}` : '';
  return [
    `<Tabs ${rootProps.join(' ')}>`,
    `  <TabsList${listProps}>`,
    `    <TabsTrigger value="overview"${left}${tag}>Overview</TabsTrigger>`,
    `    {/* …more triggers */}`,
    `  </TabsList>`,
    `  <TabsContent value="overview">…</TabsContent>`,
    `</Tabs>`,
  ].join('\n');
};

// ── Playground — every knob lives in the Controls panel ───────────────────────
export const Playground = {
  args: {
    size: 'md',
    variant: 'line',
    accent: '',
    activationMode: 'automatic',
    orientation: 'horizontal',
    fullWidth: false,
    withLeftIcon: true,
    withRightIcon: false,
    withTag: true,
    tagTone: 'neutral',
    tab1Icon: 'profile',
    tab2Icon: 'activity',
    tab3Icon: 'clipboard',
  },
  argTypes: {
    size:           { control: 'inline-radio', options: ['sm', 'md', 'lg'], table: { category: 'Layout' } },
    variant:        { control: 'inline-radio', options: ['line', 'pill', 'segment'], description: 'line = underline (default) · pill = rounded highlight · segment = segmented-control track', table: { category: 'Layout' } },
    accent:         { control: 'text', name: 'accent (token)', description: "Token name for active text + indicator, e.g. tesseract-violet-600. Blank = default blue.", table: { category: 'Layout' } },
    activationMode: { control: 'inline-radio', options: ['automatic', 'manual'], description: 'automatic = select on focus · manual = arrows move focus, Enter/Space/click selects', table: { category: 'Behavior' } },
    orientation:    { control: 'inline-radio', options: ['horizontal', 'vertical'], table: { category: 'Layout' } },
    fullWidth:      { control: 'boolean', name: 'full width', description: 'Triggers grow to fill the row equally', table: { category: 'Layout' } },
    withLeftIcon:  { control: 'boolean', name: 'left icon', table: { category: 'Content' } },
    withRightIcon: { control: 'boolean', name: 'right icon', table: { category: 'Content' } },
    withTag:       { control: 'boolean', name: 'right tag', table: { category: 'Content' } },
    tagTone:       { control: 'inline-radio', options: ['neutral', 'primary', 'success', 'warning', 'error'], name: 'tag tone', table: { category: 'Content' } },
    tab1Icon:      { control: 'text', tpIcon: true, name: 'tab 1 · icon', description: 'Pick from the Tesseract Icons panel (or type a name)', table: { category: 'Content' } },
    tab2Icon:      { control: 'text', tpIcon: true, name: 'tab 2 · icon', description: 'Pick from the Tesseract Icons panel (or type a name)', table: { category: 'Content' } },
    tab3Icon:      { control: 'text', tpIcon: true, name: 'tab 3 · icon', description: 'Pick from the Tesseract Icons panel (or type a name)', table: { category: 'Content' } },
  },
  parameters: { docs: { source: { transform: (_code, ctx) => tabsCode(ctx.args) } } },
  render: ({ size, variant, accent, activationMode, orientation, fullWidth, withLeftIcon, withRightIcon, withTag, tagTone, tab1Icon, tab2Icon, tab3Icon }) => {
    const tabsMeta = [
      { value: 'overview', label: 'Overview', tag: '5', icon: tab1Icon },
      { value: 'vitals', label: 'Vitals', tag: '3', icon: tab2Icon },
      { value: 'labs', label: 'Lab Results', tag: '2', icon: tab3Icon },
    ];
    const isVertical = orientation === 'vertical';
    return (
      <div style={{ maxWidth: 620, fontFamily: 'Inter, sans-serif', display: isVertical ? 'flex' : 'block', gap: 16 }}>
        <Tabs
          size={size}
          variant={variant}
          accent={accent || undefined}
          activationMode={activationMode}
          orientation={orientation}
          defaultValue="overview"
          style={isVertical ? { display: 'flex', gap: 16 } : undefined}
        >
          <TabsList fullWidth={fullWidth} style={isVertical ? { minWidth: 180 } : undefined}>
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
          <div style={isVertical ? { flex: 1 } : undefined}>
            {tabsMeta.map((t) => (
              <TabsContent key={t.value} value={t.value}>
                <Panel>{t.label} panel.</Panel>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    );
  },
};

// ── Custom tabs — add / edit / remove any number via the object control ───────
export const CustomTabs = {
  name: 'Custom Tabs (add your own)',
  parameters: {
    docs: { description: { story: 'Edit the `tabs` array in Controls to add, remove, or reorder tabs. Every tab uses the same trigger UI — set `label`, `icon` (any Tesseract library name), `tag`, and `tone`. With many tabs the row scrolls horizontally.' } },
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
      <div style={{ width: 360, border: '1px dashed var(--tesseract-slate-200, #e2e2ea)', borderRadius: 10, padding: 8, fontFamily: 'Inter, sans-serif' }}>
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

// ── Left icons (Tesseract Icons) ─────────────────────────────────────────────────────
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
        <p style={{ fontSize: 12, color: 'var(--tesseract-slate-500, #54545C)' }}>Active tab: {value}</p>
      </div>
    );
  },
};

// ── Full-width ────────────────────────────────────────────────────────────────
export const FullWidthTabs = {
  parameters: {
    docs: { description: { story: 'Set `fullWidth` on `TabsList` so triggers grow to fill the row equally — no per-trigger `flex: 1` needed.' } },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Tabs defaultValue="today">
        <TabsList fullWidth>
          {['today', 'week', 'month'].map((v) => (
            <TabsTrigger key={v} value={v}>
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

// ── Variants — line · pill · segment ──────────────────────────────────────────
export const Variants = {
  parameters: {
    docs: { description: { story: '`variant` reshapes the active indicator: **line** keeps the rounded underline bar (default), **pill** floats a soft accent-tinted highlight behind the active trigger, **segment** is a segmented-control track with a raised active surface.' } },
  },
  render: () => {
    const items = [
      { value: 'overview', label: 'Overview', icon: 'profile' },
      { value: 'vitals', label: 'Vitals', icon: 'activity' },
      { value: 'labs', label: 'Labs', icon: 'clipboard' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 520, fontFamily: 'Inter, sans-serif' }}>
        {['line', 'pill', 'segment'].map((variant) => (
          <div key={variant}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#54545C', marginBottom: 10 }}>{variant}</div>
            <Tabs variant={variant} defaultValue="overview">
              <TabsList>
                {items.map((t) => (
                  <TabsTrigger key={t.value} value={t.value} leftIcon={<TPLibraryIcon name={t.icon} />}>{t.label}</TabsTrigger>
                ))}
              </TabsList>
              {items.map((t) => (
                <TabsContent key={t.value} value={t.value}><Panel>{t.label} panel.</Panel></TabsContent>
              ))}
            </Tabs>
          </div>
        ))}
      </div>
    );
  },
};

// ── Pill variant + custom accent ──────────────────────────────────────────────
export const PillWithAccent = {
  name: 'Variant · Pill (accent)',
  parameters: {
    docs: { description: { story: 'The **pill** variant with a custom `accent` token (`tesseract-violet-600`) driving the active text + highlight.' } },
  },
  render: () => (
    <div style={{ maxWidth: 520, fontFamily: 'Inter, sans-serif' }}>
      <Tabs variant="pill" accent="tesseract-violet-600" defaultValue="day">
        <TabsList>
          <TabsTrigger value="day" leftIcon={<TPLibraryIcon name="calendar" />}>Day</TabsTrigger>
          <TabsTrigger value="week" leftIcon={<TPLibraryIcon name="calendar" />}>Week</TabsTrigger>
          <TabsTrigger value="month" leftIcon={<TPLibraryIcon name="calendar" />}>Month</TabsTrigger>
        </TabsList>
        <TabsContent value="day"><Panel>Day view.</Panel></TabsContent>
        <TabsContent value="week"><Panel>Week view.</Panel></TabsContent>
        <TabsContent value="month"><Panel>Month view.</Panel></TabsContent>
      </Tabs>
    </div>
  ),
};

// ── Vertical orientation ──────────────────────────────────────────────────────
export const Vertical = {
  name: 'Orientation · Vertical',
  parameters: {
    docs: { description: { story: 'Set `orientation="vertical"` for a column list with a side indicator. Up/Down arrow keys move between triggers; `aria-orientation` is set for assistive tech.' } },
  },
  render: () => {
    const items = [
      { value: 'overview', label: 'Overview', icon: 'profile' },
      { value: 'vitals', label: 'Vitals', icon: 'heart', tag: '3', tone: 'primary' },
      { value: 'prescriptions', label: 'Prescriptions', icon: 'health' },
      { value: 'labs', label: 'Lab Results', icon: 'clipboard', tag: '2', tone: 'warning' },
    ];
    return (
      <div style={{ maxWidth: 620, fontFamily: 'Inter, sans-serif' }}>
        <Tabs orientation="vertical" defaultValue="overview" style={{ display: 'flex', gap: 20 }}>
          <TabsList style={{ minWidth: 200 }}>
            {items.map((t) => (
              <TabsTrigger key={t.value} value={t.value} leftIcon={<TPLibraryIcon name={t.icon} />} tag={t.tag} tagTone={t.tone || 'neutral'}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div style={{ flex: 1 }}>
            {items.map((t) => (
              <TabsContent key={t.value} value={t.value}><Panel>{t.label} panel.</Panel></TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    );
  },
};

// ── Manual activation ─────────────────────────────────────────────────────────
export const ManualActivation = {
  name: 'Behavior · Manual Activation',
  parameters: {
    docs: { description: { story: 'With `activationMode="manual"`, arrow keys move focus across triggers without switching panels; press Enter/Space (or click) to commit. Good for tabs whose panels are expensive to mount.' } },
  },
  render: () => (
    <div style={{ maxWidth: 520, fontFamily: 'Inter, sans-serif' }}>
      <Tabs activationMode="manual" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" leftIcon={<TPLibraryIcon name="profile" />}>Overview</TabsTrigger>
          <TabsTrigger value="reports" leftIcon={<TPLibraryIcon name="clipboard" />}>Reports</TabsTrigger>
          <TabsTrigger value="billing" leftIcon={<TPLibraryIcon name="document" />}>Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><Panel>Focus a tab with arrow keys, then Enter/Space to load this panel.</Panel></TabsContent>
        <TabsContent value="reports"><Panel>Reports (loaded on demand).</Panel></TabsContent>
        <TabsContent value="billing"><Panel>Billing (loaded on demand).</Panel></TabsContent>
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
                  <span style={{ color: 'var(--tesseract-slate-400, #A1A1AA)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--tesseract-slate-800, #27272A)' }}>{value}</span>
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
