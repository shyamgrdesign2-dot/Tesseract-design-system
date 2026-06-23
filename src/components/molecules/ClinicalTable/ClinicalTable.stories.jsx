import React from 'react';
import { ClinicalTable } from './ClinicalTable';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/ClinicalTable',
  component: ClinicalTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Editable RxPad table — every cell is its own input box, composed from the design-system atoms.\n\n**Cell types:** `text` (free-text), `number` (digits), `date` (native picker), `select` (fixed dropdown), `search` (editable combobox + "Add custom"), `multiselect` (multi-pick with chips), `combo` (editable dropdown — type to filter + allow custom values, with chevron).\n\nFixed skeleton: drag-reorder · **Name** (primary search) · …configurable `columns`… · **Notes** (free text) · **Action** (⋯ menu + delete). The Playground story below lets you configure the number of columns, each column\'s name, type, and options — all from Storybook controls.' } },
  },
  argTypes: {
    reorderable: { control: 'boolean', table: { category: 'Actions' } },
    deletable: { control: 'boolean', description: 'Delete button in the action column', table: { category: 'Actions' } },
    showRowMenu: { control: 'boolean', name: 'row ⋯ menu', description: 'Show the three-dots row-actions menu', table: { category: 'Actions' } },
    autoRow: { control: 'boolean', name: 'auto empty row' },
    flagCustom: { control: 'boolean', name: 'flag custom names', description: 'Ring the Name cell when the entry is not in the frequently-used list' },
    dragIcon:      { control: 'text', tpIcon: true, name: 'Drag handle icon', table: { category: 'Icons' } },
    moreIcon:      { control: 'text', tpIcon: true, name: 'Kebab/More icon', table: { category: 'Icons' } },
    deleteIcon:    { control: 'text', tpIcon: true, name: 'Delete icon', table: { category: 'Icons' } },
    duplicateIcon: { control: 'text', tpIcon: true, name: 'Duplicate icon', table: { category: 'Icons' } },
  },
  args: { reorderable: true, deletable: true, showRowMenu: true, autoRow: true, flagCustom: false, dragIcon: '', moreIcon: '3-dots-more', deleteIcon: 'trash', duplicateIcon: 'copy' },
};

export default meta;

// ── Shared sample data ──
const FREQUENT_SYMPTOMS = ['Fever', 'Cough', 'Chest pain', 'Shortness of breath', 'Headache', 'Fatigue', 'Nausea', 'Abdominal pain', 'Dizziness', 'Joint pain'];
const SINCE = ['1 day', '2 days', '3 days', '1 week', '2 weeks', '1 month'];
const STATUS = ['Mild', 'Moderate', 'Severe', 'Improving', 'Worsening'];
const SYMPTOM_NAME = { header: 'Symptoms Name', options: FREQUENT_SYMPTOMS, frequentlyUsedLabel: 'Frequently used' };
const MIDDLE_COLUMNS = [
  { id: 'since', header: 'Since', type: 'select', placeholder: 'Select', options: SINCE, minWidth: 120, maxWidth: 140 },
  { id: 'status', header: 'Status', type: 'select', placeholder: 'Select', options: STATUS, minWidth: 135, maxWidth: 170 },
];
const SEED = [
  { id: 's1', name: 'Chest pain', since: '2 days', status: 'Moderate', notes: 'On exertion' },
  { id: 's2', name: 'Shortness of breath', since: '1 week', status: 'Mild', notes: '' },
  { id: 's3', name: 'Dizziness', since: '3 days', status: 'Severe', notes: 'Morning' },
];

// ── Playground — the simple default story with basic controls ──
export const Playground = {
  args: { showRowMenu: true, moreIcon: '3-dots-more' },
  render: ({ flagCustom, dragIcon, moreIcon, deleteIcon, duplicateIcon, ...args }) => {
    const [rows, setRows] = React.useState(SEED);
    const nameCol = { ...SYMPTOM_NAME, flagCustom: flagCustom ? 'warning' : undefined };
    return (
      <div style={{ maxWidth: 820 }}>
        <ClinicalTable {...args} name={nameCol} columns={MIDDLE_COLUMNS} rows={rows} onChange={setRows}
          dragIcon={dragIcon} moreIcon={moreIcon} deleteIcon={deleteIcon} duplicateIcon={duplicateIcon} />
        <pre style={{ marginTop: 16, fontSize: 12, color: 'var(--tesseract-slate-500, #717179)' }}>{JSON.stringify(rows, null, 2)}</pre>
      </div>
    );
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// Column Configurator — Storybook Controls per column
// ═══════════════════════════════════════════════════════════════════════════════

const ctColArgTypes = (n) => {
  const cat = `Column ${n}`;
  return {
    // ── Primary: which component ──
    [`col${n}Component`]:     { control: 'inline-radio', options: ['InputBox', 'Dropdown'], name: 'component', table: { category: cat } },
    [`col${n}Name`]:          { control: 'text', name: 'name', table: { category: cat } },
    [`col${n}Placeholder`]:   { control: 'text', name: 'placeholder', table: { category: cat } },

    // ── InputBox-specific ──
    [`col${n}InputType`]:     { control: 'select', options: ['text', 'number', 'date'], name: '↳ input type', table: { category: cat, subcategory: 'InputBox' }, if: { arg: `col${n}Component`, eq: 'InputBox' } },
    [`col${n}Allow`]:         { control: 'select', options: ['any', 'numeric', 'alpha', 'alphanumeric'], name: '↳ character filter', table: { category: cat, subcategory: 'InputBox' }, if: { arg: `col${n}Component`, eq: 'InputBox' } },
    [`col${n}Counter`]:       { control: 'boolean', name: '↳ counter (+/−)', table: { category: cat, subcategory: 'InputBox' }, if: { arg: `col${n}Component`, eq: 'InputBox' } },
    [`col${n}Clearable`]:     { control: 'boolean', name: '↳ clearable (×)', table: { category: cat, subcategory: 'InputBox' }, if: { arg: `col${n}Component`, eq: 'InputBox' } },

    // ── Dropdown-specific ──
    [`col${n}DropdownMode`]:  { control: 'select', options: ['select', 'search', 'multiselect', 'combo'], name: '↳ dropdown mode', table: { category: cat, subcategory: 'Dropdown' }, if: { arg: `col${n}Component`, eq: 'Dropdown' } },
    [`col${n}Options`]:       { control: 'text', name: '↳ options (comma-sep)', table: { category: cat, subcategory: 'Dropdown' }, if: { arg: `col${n}Component`, eq: 'Dropdown' } },
    [`col${n}Searchable`]:    { control: 'boolean', name: '↳ searchable', table: { category: cat, subcategory: 'Dropdown' }, if: { arg: `col${n}Component`, eq: 'Dropdown' } },
    [`col${n}AllowCustom`]:   { control: 'boolean', name: '↳ allow custom values', table: { category: cat, subcategory: 'Dropdown' }, if: { arg: `col${n}Component`, eq: 'Dropdown' } },
    [`col${n}Chevron`]:       { control: 'boolean', name: '↳ show chevron', table: { category: cat, subcategory: 'Dropdown' }, if: { arg: `col${n}Component`, eq: 'Dropdown' } },
    [`col${n}Chips`]:         { control: 'boolean', name: '↳ show chips', table: { category: cat, subcategory: 'Dropdown' }, if: { arg: `col${n}Component`, eq: 'Dropdown' } },
    [`col${n}OptionControl`]: { control: 'select', options: ['none', 'checkbox', 'radio'], name: '↳ option indicator', table: { category: cat, subcategory: 'Dropdown' }, if: { arg: `col${n}Component`, eq: 'Dropdown' } },
    [`col${n}FooterHint`]:    { control: 'boolean', name: '↳ keyboard hints', table: { category: cat, subcategory: 'Dropdown' }, if: { arg: `col${n}Component`, eq: 'Dropdown' } },
    [`col${n}GroupLabel`]:     { control: 'text', name: '↳ group label', table: { category: cat, subcategory: 'Dropdown' }, if: { arg: `col${n}Component`, eq: 'Dropdown' } },

    // ── Layout (common) ──
    [`col${n}Sticky`]:        { control: 'boolean', name: 'sticky (rightmost)', table: { category: cat, subcategory: 'Layout' } },
    [`col${n}MinWidth`]:      { control: { type: 'range', min: 60, max: 400, step: 10 }, name: 'min width (px)', table: { category: cat, subcategory: 'Layout' } },
    [`col${n}MaxWidth`]:      { control: { type: 'range', min: 80, max: 600, step: 10 }, name: 'max width (px)', table: { category: cat, subcategory: 'Layout' } },
    [`col${n}Expand`]:        { control: 'boolean', name: 'expand (fill remaining)', table: { category: cat, subcategory: 'Layout' } },
    [`col${n}Align`]:         { control: 'select', options: ['left', 'right', 'center'], name: 'align', table: { category: cat, subcategory: 'Layout' } },
  };
};

const ctColArgs = (n, o) => ({
  [`col${n}Component`]: o.component || 'InputBox',
  [`col${n}Name`]: o.name,
  [`col${n}Placeholder`]: o.placeholder || '',
  // InputBox
  [`col${n}InputType`]: o.inputType || 'text',
  [`col${n}Allow`]: o.allow || 'any',
  [`col${n}Counter`]: o.counter || false,
  [`col${n}Clearable`]: o.clearable || false,
  // Dropdown
  [`col${n}DropdownMode`]: o.dropdownMode || 'select',
  [`col${n}Options`]: o.options || '',
  [`col${n}Searchable`]: o.searchable || false,
  [`col${n}AllowCustom`]: o.allowCustom ?? false,
  [`col${n}Chevron`]: o.chevron ?? true,
  [`col${n}Chips`]: o.chips ?? true,
  [`col${n}OptionControl`]: o.optionControl || 'none',
  [`col${n}FooterHint`]: o.footerHint || false,
  [`col${n}GroupLabel`]: o.groupLabel || '',
  // Layout
  [`col${n}Sticky`]: o.sticky || false,
  [`col${n}MinWidth`]: o.minWidth || 0,
  [`col${n}MaxWidth`]: o.maxWidth || 0,
  [`col${n}Expand`]: o.expand || false,
  [`col${n}Align`]: o.align || 'left',
});

function buildCTColumns(count, args) {
  const cols = [];
  for (let n = 1; n <= count; n++) {
    const component = args[`col${n}Component`] || 'InputBox';
    const col = { id: `col_${n}`, header: args[`col${n}Name`] || `Column ${n}`, placeholder: args[`col${n}Placeholder`] || '' };

    if (component === 'InputBox') {
      const inputType = args[`col${n}InputType`] || 'text';
      col.type = inputType;
      const allow = args[`col${n}Allow`];
      if (allow && allow !== 'any') col.allow = allow;
      if (args[`col${n}Counter`]) col.counter = true;
      if (args[`col${n}Clearable`]) col.clearable = true;
    } else {
      const mode = args[`col${n}DropdownMode`] || 'select';
      col.type = mode;
      const opts = (args[`col${n}Options`] || '').split(',').map((s) => s.trim()).filter(Boolean);
      if (opts.length) col.options = opts;
      if (args[`col${n}Searchable`]) col.searchable = true;
      if (mode === 'search' || mode === 'combo') col.allowCustom = args[`col${n}AllowCustom`] !== false;
      if (args[`col${n}Chevron`] === false) col.chevron = false;
      if (args[`col${n}Chips`] === false) col.chips = false;
      const oc = args[`col${n}OptionControl`];
      if (oc && oc !== 'none') col.optionControl = oc;
      if (args[`col${n}FooterHint`]) col.footerHint = true;
      const gl = args[`col${n}GroupLabel`];
      if (gl) col.frequentlyUsedLabel = gl;
      if (mode === 'search' && !gl) col.frequentlyUsedLabel = 'Frequently used';
    }

    const align = args[`col${n}Align`] || (col.type === 'number' ? 'right' : undefined);
    if (align && align !== 'left') col.align = align;
    const minW = args[`col${n}MinWidth`];
    const maxW = args[`col${n}MaxWidth`];
    if (minW > 0) col.minWidth = minW;
    if (maxW > 0) col.maxWidth = maxW;
    if (args[`col${n}Expand`]) col.expand = true;
    col._sticky = args[`col${n}Sticky`] || false;
    cols.push(col);
  }
  return cols;
}

export const ColumnConfigurator = {
  name: 'Column Configurator',
  parameters: { docs: { description: { story: 'Set the **number of columns** in the Controls panel, then configure each column\'s name, input type (text, number, date, select, search, multiselect, combo), options, searchable, and custom-value settings. The table updates live.\n\nEach cell uses the real **InputBox** or **Dropdown** atom — all functionality (seamless, status ring, key hints, chips) carries through.' } } },
  args: {
    columnCount: 3,
    ...ctColArgs(1,  { component: 'Dropdown', name: 'Since',     dropdownMode: 'combo', placeholder: 'Type or select', options: '1 day, 2 days, 3 days, 1 week, 2 weeks, 1 month', searchable: true, allowCustom: true, minWidth: 140, maxWidth: 220 }),
    ...ctColArgs(2,  { component: 'Dropdown', name: 'Status',    dropdownMode: 'select', placeholder: 'Select', options: 'Mild, Moderate, Severe, Improving, Worsening', minWidth: 120, maxWidth: 170 }),
    ...ctColArgs(3,  { component: 'Dropdown', name: 'Body Part', dropdownMode: 'multiselect', placeholder: 'Select areas', options: 'Head, Chest, Abdomen, Back, Limbs, Joints', searchable: true, minWidth: 160, maxWidth: 260 }),
    ...ctColArgs(4,  { component: 'InputBox', name: 'Dose',      inputType: 'number', placeholder: '0', align: 'right', minWidth: 84, maxWidth: 120 }),
    ...ctColArgs(5,  { component: 'Dropdown', name: 'Route',     dropdownMode: 'select', placeholder: 'Select', options: 'Oral, IV, IM, Topical, Inhaled', minWidth: 120, maxWidth: 180 }),
    ...ctColArgs(6,  { component: 'InputBox', name: 'Start',     inputType: 'date', minWidth: 140, maxWidth: 180 }),
    ...ctColArgs(7,  { component: 'Dropdown', name: 'Frequency', dropdownMode: 'select', placeholder: 'e.g. 1-0-1', options: '1-0-0, 0-0-1, 1-0-1, 1-1-1, SOS, Stat', searchable: true, minWidth: 120 }),
    ...ctColArgs(8,  { component: 'InputBox', name: 'Column 8' }),
    ...ctColArgs(9,  { component: 'InputBox', name: 'Column 9' }),
    ...ctColArgs(10, { component: 'InputBox', name: 'Column 10' }),
  },
  argTypes: {
    columnCount: { control: { type: 'range', min: 1, max: 10, step: 1 }, name: 'number of columns', table: { category: 'Table' } },
    ...ctColArgTypes(1), ...ctColArgTypes(2), ...ctColArgTypes(3), ...ctColArgTypes(4), ...ctColArgTypes(5),
    ...ctColArgTypes(6), ...ctColArgTypes(7), ...ctColArgTypes(8), ...ctColArgTypes(9), ...ctColArgTypes(10),
  },
  render: ({ columnCount, flagCustom, dragIcon, moreIcon, deleteIcon, duplicateIcon, ...args }) => {
    const [rows, setRows] = React.useState([
      { id: 'cr1', name: 'Chest pain', col_1: '2 days', col_2: 'Moderate', col_3: ['Chest'], notes: 'On exertion' },
      { id: 'cr2', name: 'Dizziness', col_1: '1 week', col_2: 'Mild', col_3: ['Head'], notes: '' },
    ]);
    const nameCol = { ...SYMPTOM_NAME, flagCustom: flagCustom ? 'warning' : undefined };
    const built = buildCTColumns(columnCount, args);
    let stickyIdx = -1;
    for (let i = built.length - 1; i >= 0; i--) {
      if (built[i]._sticky) { stickyIdx = i; break; }
    }
    const columns = built.map((c, i) => {
      const { _sticky, ...col } = c;
      if (i === stickyIdx) col.sticky = 'right';
      return col;
    });
    return (
      <div style={{ maxWidth: 1200 }}>
        <ClinicalTable
          name={nameCol}
          columns={columns}
          rows={rows}
          onChange={setRows}
          dragIcon={dragIcon}
          moreIcon={moreIcon}
          deleteIcon={deleteIcon}
          duplicateIcon={duplicateIcon}
        />
      </div>
    );
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
// All Cell Types — showcases every column type side by side
// ═══════════════════════════════════════════════════════════════════════════════
export const AllCellTypes = {
  name: 'All Cell Types',
  parameters: { docs: { description: { story: 'Every supported cell type in one table: text, number, date, select, searchable select, search (combobox), multiselect (chips), and combo (editable + chevron + custom).' } } },
  render: () => {
    const [rows, setRows] = React.useState([
      { id: 'a1', name: 'Amoxicillin', dose: '500', route: 'Oral', start: '2026-06-09', duration: '5 days', timing: ['Morning', 'Evening'], freq: '1-0-1', notes: 'After food' },
    ]);
    const columns = [
      { id: 'dose', header: 'Dose (mg)', type: 'number', placeholder: '0', align: 'right' },
      { id: 'route', header: 'Route', type: 'select', placeholder: 'Select', options: ['Oral', 'IV', 'IM', 'Topical', 'Inhaled', 'Sublingual'] },
      { id: 'start', header: 'Start', type: 'date' },
      { id: 'duration', header: 'Duration', type: 'combo', placeholder: 'e.g. 5 days', allowCustom: true, searchable: true,
        options: ['1 day', '2 days', '3 days', '5 days', '7 days', '10 days', '2 weeks', '1 month'] },
      { id: 'timing', header: 'Timing', type: 'multiselect', placeholder: 'When?', searchable: true,
        options: ['Morning', 'Afternoon', 'Evening', 'Night', 'Before food', 'After food', 'Empty stomach'] },
      { id: 'freq', header: 'Frequency', type: 'select', searchable: true, placeholder: 'e.g. 1-0-1',
        options: ['1-0-0', '0-0-1', '1-0-1', '1-1-1', '0-1-0', 'SOS', 'Stat'] },
    ];
    const nameCol = { header: 'Medicine', options: ['Amoxicillin', 'Paracetamol', 'Azithromycin', 'Ibuprofen', 'Metformin', 'Atorvastatin'], frequentlyUsedLabel: 'Frequently used' };
    return (
      <div style={{ maxWidth: 1200 }}>
        <ClinicalTable name={nameCol} columns={columns} rows={rows} onChange={setRows} />
      </div>
    );
  },
};


// ═══════════════════════════════════════════════════════════════════════════════
// Remaining stories (preserved from earlier)
// ═══════════════════════════════════════════════════════════════════════════════

export const StickyActions = {
  render: () => {
    const [rows, setRows] = React.useState(SEED);
    return (
      <div style={{ maxWidth: 460, border: '1px dashed var(--tesseract-slate-200,#e2e2ea)', padding: 8, borderRadius: 12 }}>
        <ClinicalTable name={SYMPTOM_NAME} columns={MIDDLE_COLUMNS} rows={rows} onChange={setRows} rowMenu={[{ label: 'Duplicate', icon: <TPLibraryIcon name="copy" size={15} /> }, { label: 'Clear row', icon: <TPLibraryIcon name="eraser" size={15} />, danger: true, onClick: () => {} }]} />
        <p style={{ fontSize: 12, color: 'var(--tesseract-slate-500,#717179)', marginTop: 8 }}>Scroll the table sideways — the actions column stays pinned and the left fade appears only while content sits behind it.</p>
      </div>
    );
  },
};

export const Empty = {
  render: () => {
    const [rows, setRows] = React.useState([]);
    return <div style={{ maxWidth: 820 }}><ClinicalTable name={SYMPTOM_NAME} columns={MIDDLE_COLUMNS} rows={rows} onChange={setRows} /></div>;
  },
};

export const FlaggedCustomEntry = {
  name: 'Flag custom (off-database) names',
  render: () => {
    const [rows, setRows] = React.useState([
      { id: 'f1', name: 'Chest pain', since: '2 days', status: 'Moderate', notes: '' },
      { id: 'f2', name: 'Random ache xyz', since: '1 day', status: 'Mild', notes: 'Not in list' },
    ]);
    const nameCol = { ...SYMPTOM_NAME, flagCustom: 'warning' };
    return <div style={{ maxWidth: 820 }}><ClinicalTable name={nameCol} columns={MIDDLE_COLUMNS} rows={rows} onChange={setRows} /></div>;
  },
};

const COLUMN_TYPES = [
  ['text', 'Free-text input (InputBox).'],
  ['number', 'Numeric input (digits only).'],
  ['date', 'Native date picker (type="date").'],
  ['select', 'Pick-from-list dropdown (chevron). Add `searchable` to filter.'],
  ['search', 'Editable combobox: type to filter, "Frequently used" header, "Add ‹custom›", key hints.'],
  ['multiselect', 'Multi-pick dropdown with removable chips. Add `searchable` to filter.'],
  ['combo', 'Editable dropdown with chevron: type to filter OR pick. Supports `allowCustom` for free values.'],
];
const EXAMPLE_COLUMNS = [
  { id: 'dose', header: 'Dose (mg)', type: 'number', placeholder: '0', align: 'right' },
  { id: 'route', header: 'Route', type: 'select', placeholder: 'Select', options: ['Oral', 'IV', 'Topical', 'Inhaled'] },
  { id: 'start', header: 'Start date', type: 'date' },
  { id: 'timing', header: 'Timing', type: 'multiselect', placeholder: 'When?', options: ['Morning', 'Evening', 'Night'] },
  { id: 'duration', header: 'Duration', type: 'combo', placeholder: 'e.g. 5 days', allowCustom: true, options: ['1 day', '3 days', '5 days', '1 week'] },
];
export const ConfiguringColumns = {
  name: 'Configuring columns (how-to)',
  render: () => {
    const [rows, setRows] = React.useState([{ id: 'c1', name: 'Amoxicillin', dose: '500', route: 'Oral', start: '2026-06-09', timing: ['Morning', 'Evening'], duration: '5 days', notes: '' }]);
    const code = `<ClinicalTable\n  name={{ header: 'Medicine', options: [...], frequentlyUsedLabel: 'Frequently used' }}\n  columns={${JSON.stringify(EXAMPLE_COLUMNS, null, 2)}}\n  rows={rows} onChange={setRows}\n/>`;
    const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 };
    return (
      <div style={{ maxWidth: 1000, display: 'grid', gap: 16 }}>
        <ClinicalTable name={{ header: 'Medicine', options: ['Amoxicillin', 'Paracetamol', 'Azithromycin', 'Ibuprofen'], frequentlyUsedLabel: 'Frequently used' }} columns={EXAMPLE_COLUMNS} rows={rows} onChange={setRows} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--tesseract-slate-500,#717179)', marginBottom: 6 }}>Available column types</div>
          <ul style={{ ...mono, margin: 0, paddingLeft: 18, color: 'var(--tesseract-slate-700,#454551)', lineHeight: 1.7 }}>
            {COLUMN_TYPES.map(([t, desc]) => (<li key={t}><strong>{t}</strong> — {desc}</li>))}
          </ul>
        </div>
        <pre style={{ ...mono, margin: 0, padding: 14, borderRadius: 10, background: 'var(--tesseract-slate-50,#f8fafc)', border: '1px solid var(--tesseract-slate-100,#f1f1f5)', color: 'var(--tesseract-slate-800,#27272a)', overflowX: 'auto' }}>{code}</pre>
      </div>
    );
  },
};
