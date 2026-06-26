import React from 'react';
import { RxPadSection } from './RxPadSection';
import { Badge } from '@/src/components/atoms/Badge/Badge';

const SYMPTOM_COLUMNS = [
  { id: 'since', header: 'Since', type: 'text', placeholder: 'e.g. 2 days', minWidth: 120, maxWidth: 160 },
  { id: 'status', header: 'Status', type: 'select', options: ['Mild', 'Moderate', 'Severe'], placeholder: 'e.g. Moderate', minWidth: 130, maxWidth: 170 },
];
const FREQUENT = ['Chest Pain', 'Fever', 'Headache', 'Vomiting', 'Diarrhea', 'Shortness of Breath', 'Abdominal Pain', 'Joint Pain'];

const meta = {
  title: 'Molecules/RxPadSection',
  component: RxPadSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: [
      'One section of an RxPad prescription form — a header (icon + title + action quartet) over a swappable body, with search and "frequently used" ghost buttons.',
      '',
      '**When to use** — building a prescription / clinical-note section (Symptoms, Diagnosis, Advice, Follow-up); stack several to compose a full pad.',
      '**When not** — a generic editable grid with no RxPad chrome — use `ClinicalTable`/`DataTable` directly.',
      '',
      '**Key props** — `bodyType` (`table` → `ClinicalTable` · `text` → free-text · `fields` → labelled inputs); `mode` (`table-first` vs `search-first` layout); `columns`/`fields`/`defaultRows` + `frequentlyUsed` (the body config + quick-add chips); `showRepeat`/`showTemplate`/`showSave`/`showClear` (toggle the default header actions) or `headerActions` to replace them; `loading`, `collapsible`/`defaultCollapsed`, `headerMeta`.',
      '',
      '**Good to know** — every glyph (header, repeat, save, clear, search, drag, more, delete, duplicate) is an individually configurable `tpIcon` slot. `collapsible` hides the body while the header stays.',
    ].join('\n') } },
  },
  argTypes: {
    title:        { control: 'text', description: 'Section title in the header.' },
    subtitle:     { control: 'text', name: 'Subtitle', description: 'Secondary line under the title (blank = none).', table: { category: 'Header' } },
    icon:         { control: 'text', tpIcon: true, name: 'Header icon' },
    iconColor:    { control: 'color', name: 'Header icon colour', description: 'Colour of the header icon chip.', table: { category: 'Header' } },
    repeatIcon:   { control: 'text', tpIcon: true, name: 'Repeat icon' },
    templateIcon: { control: 'text', tpIcon: true, name: 'Template icon' },
    saveIcon:     { control: 'text', tpIcon: true, name: 'Save icon' },
    clearIcon:    { control: 'text', tpIcon: true, name: 'Clear/Erase icon' },
    searchIcon:   { control: 'text', tpIcon: true, name: 'Search icon' },
    dragIcon:     { control: 'text', tpIcon: true, name: 'Drag handle icon' },
    moreIcon:     { control: 'text', tpIcon: true, name: 'Kebab/More icon' },
    deleteIcon:   { control: 'text', tpIcon: true, name: 'Delete icon' },
    duplicateIcon:{ control: 'text', tpIcon: true, name: 'Duplicate icon' },
    mode:         { control: 'inline-radio', options: ['table-first', 'search-first'], description: 'Layout: body above the search, or search above the body' },
    bodyType:     { control: 'inline-radio', options: ['table', 'text', 'fields'], description: 'Body renderer: ClinicalTable · free-text · labelled fields' },
    search:       { control: 'boolean', name: 'Show search box', description: 'Show the search-&-add input (table body, search-first mode only).', table: { category: 'Body' } },
    searchPlaceholder: { control: 'text', name: 'Search/body placeholder', description: 'Placeholder for the search box / free-text body.', table: { category: 'Body' } },
    showRepeat:   { control: 'boolean', description: 'Show the default Repeat header action' },
    showTemplate: { control: 'boolean', description: 'Show the default Template header action' }, showSave:   { control: 'boolean', description: 'Show the default Save header action' }, showClear: { control: 'boolean', description: 'Show the default Clear/Erase header action' },
    loading:      { control: 'boolean', name: 'Loading', description: 'Show skeleton rows instead of the body.', table: { category: 'State' } },
    collapsible:  { control: 'boolean', name: 'Collapsible', description: 'Add a chevron that hides the body (header stays).', table: { category: 'State' } },
    defaultCollapsed: { control: 'boolean', name: 'Start collapsed', if: { arg: 'collapsible' }, table: { category: 'State' } },
  },
  args: {
    title: 'Symptoms', subtitle: '', icon: 'virus', iconColor: 'var(--tesseract-violet-500)',
    mode: 'table-first', bodyType: 'table', search: true, searchPlaceholder: '',
    showRepeat: true, showTemplate: true, showSave: true, showClear: true,
    loading: false, collapsible: false, defaultCollapsed: false,
    repeatIcon: 'refresh-arrow', templateIcon: 'grid-5',
    saveIcon: 'ram', clearIcon: 'eraser', searchIcon: 'search-normal',
    dragIcon: 'menu', moreIcon: '3-dots-more', deleteIcon: 'trash', duplicateIcon: 'copy',
  },
};
export default meta;

const Render = (args) => (
  <div style={{ maxWidth: 920 }}>
    <RxPadSection
      {...args}
      columns={SYMPTOM_COLUMNS}
      frequentlyUsed={FREQUENT}
      defaultRows={[{ id: 'r1', name: 'Diarrhea', since: '2 days', status: 'Moderate' }]}
    />
  </div>
);

// Build an accurate, copy-paste snippet from the controls (what "Show code" shows).
// Only non-default props are emitted, so the snippet stays minimal.
const DEFAULTS = {
  title: 'Symptoms', icon: 'virus', mode: 'table-first', bodyType: 'table',
  showRepeat: true, showTemplate: true, showSave: true, showClear: true,
  loading: false, collapsible: false, defaultCollapsed: false,
};
const rxCode = (args) => {
  const lines = [];
  const add = (k, v) => lines.push(typeof v === 'boolean' ? (v ? `  ${k}` : `  ${k}={false}`) : `  ${k}="${v}"`);
  if (args.title !== DEFAULTS.title) add('title', args.title);
  if (args.subtitle) add('subtitle', args.subtitle);
  if (args.icon !== DEFAULTS.icon) add('icon', args.icon);
  if (args.mode !== DEFAULTS.mode) add('mode', args.mode);
  if (args.bodyType !== DEFAULTS.bodyType) add('bodyType', args.bodyType);
  ['showRepeat', 'showTemplate', 'showSave', 'showClear'].forEach((k) => { if (args[k] !== DEFAULTS[k]) add(k, args[k]); });
  if (args.loading) add('loading', true);
  if (args.collapsible) add('collapsible', true);
  if (args.collapsible && args.defaultCollapsed) add('defaultCollapsed', true);
  lines.push('  columns={SYMPTOM_COLUMNS}', '  frequentlyUsed={FREQUENT}');
  return `<RxPadSection\n${lines.join('\n')}\n/>`;
};

export const Playground = {
  render: Render,
  parameters: { docs: { source: { transform: (_code, ctx) => rxCode(ctx.args) } } },
};

export const EmptyState = {
  render: (args) => (
    <div style={{ maxWidth: 920 }}>
      <RxPadSection {...args} columns={SYMPTOM_COLUMNS} frequentlyUsed={FREQUENT} />
    </div>
  ),
};

export const SearchFirst = {
  args: { mode: 'search-first', title: 'Diagnosis', icon: 'diagnosis' },
  render: (args) => (
    <div style={{ maxWidth: 920 }}>
      <RxPadSection {...args} columns={[{ id: 'type', header: 'Type', type: 'select', options: ['Acute', 'Chronic'], minWidth: 130 }]} frequentlyUsed={['Viral Fever', 'Conjunctivitis', 'Hypertension']} />
    </div>
  ),
};

export const FreeText = {
  args: { title: 'Advice', icon: 'health-care', bodyType: 'text' },
  render: (args) => <div style={{ maxWidth: 920 }}><RxPadSection {...args} searchPlaceholder="Type advice for the patient…" /></div>,
};

export const CustomFields = {
  args: { title: 'Follow-up', icon: 'calendar', bodyType: 'fields' },
  render: (args) => (
    <div style={{ maxWidth: 920 }}>
      <RxPadSection {...args} fields={[
        { id: 'after', label: 'Follow-up after', placeholder: 'e.g. 2 weeks' },
        { id: 'date', label: 'On date', type: 'date' },
      ]} />
    </div>
  ),
};

/**
 * `subtitle`, a right-aligned `headerMeta` badge, and a custom `headerActions`
 * toolbar (an array of `{ icon, tip, variant, onClick }`) replacing the default
 * Repeat/Template/Save/Clear quartet.
 */
export const CustomHeaderActions = {
  args: { title: 'Medications', subtitle: '3 active prescriptions', icon: 'health' },
  render: (args) => (
    <div style={{ maxWidth: 920 }}>
      <RxPadSection
        {...args}
        columns={[{ id: 'dose', header: 'Dose', type: 'text', placeholder: 'e.g. 500mg', minWidth: 120 }]}
        frequentlyUsed={['Paracetamol', 'Amoxicillin', 'Ibuprofen']}
        headerMeta={<Badge variant="soft" color="success" size="sm">Synced</Badge>}
        headerActions={[
          { icon: 'add', tip: 'Add from formulary', variant: 'filled', onClick: () => {} },
          { icon: 'printer', tip: 'Print', onClick: () => {} },
          { icon: 'share', tip: 'Share', onClick: () => {} },
        ]}
      />
    </div>
  ),
};

/** Real `loading` (skeleton rows) and `emptyState` rendering. */
export const LoadingAndEmpty = {
  render: (args) => (
    <div style={{ maxWidth: 920, display: 'grid', gap: 24 }}>
      <RxPadSection
        {...args}
        title="Loading lab results"
        icon="activity"
        loading
        columns={SYMPTOM_COLUMNS}
      />
      <RxPadSection
        {...args}
        title="Allergies"
        icon="shield-tick"
        mode="search-first"
        columns={SYMPTOM_COLUMNS}
        emptyState={(
          <>
            <strong>No allergies recorded</strong>
            <span>Search above to add a known allergy.</span>
          </>
        )}
      />
    </div>
  ),
};

/** Whole section collapses — header stays, body hides. */
export const Collapsible = {
  args: { title: 'Past History', icon: 'document-text', collapsible: true, defaultCollapsed: true, subtitle: 'Click the chevron to expand' },
  render: Render,
};
