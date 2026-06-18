import React from 'react';
import { RxPadSection } from './RxPadSection';

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
    docs: { description: { component: 'A configurable RxPad module: header (icon + title + CTAs) over a configurable body (ClinicalTable, free-text, or fields), with search and "frequently used" ghost buttons. Every icon in the component is individually configurable via the Tesseract Icons panel.' } },
  },
  argTypes: {
    title:        { control: 'text' },
    icon:         { control: 'text', tpIcon: true, name: 'Header icon' },
    repeatIcon:   { control: 'text', tpIcon: true, name: 'Repeat icon' },
    templateIcon: { control: 'text', tpIcon: true, name: 'Template icon' },
    saveIcon:     { control: 'text', tpIcon: true, name: 'Save icon' },
    clearIcon:    { control: 'text', tpIcon: true, name: 'Clear/Erase icon' },
    searchIcon:   { control: 'text', tpIcon: true, name: 'Search icon' },
    dragIcon:     { control: 'text', tpIcon: true, name: 'Drag handle icon' },
    moreIcon:     { control: 'text', tpIcon: true, name: 'Kebab/More icon' },
    deleteIcon:   { control: 'text', tpIcon: true, name: 'Delete icon' },
    duplicateIcon:{ control: 'text', tpIcon: true, name: 'Duplicate icon' },
    mode:         { control: 'inline-radio', options: ['table-first', 'search-first'] },
    bodyType:     { control: 'inline-radio', options: ['table', 'text', 'fields'] },
    showRepeat:   { control: 'boolean' },
    showTemplate: { control: 'boolean' }, showSave:   { control: 'boolean' }, showClear: { control: 'boolean' },
  },
  args: {
    title: 'Symptoms', icon: 'virus', mode: 'table-first', bodyType: 'table',
    showRepeat: true, showTemplate: true, showSave: true, showClear: true,
    repeatIcon: 'refresh-arrow', templateIcon: 'grid-5',
    saveIcon: 'ram', clearIcon: 'eraser', searchIcon: 'search-normal-1',
    dragIcon: '', moreIcon: '3-dots-more', deleteIcon: 'trash', duplicateIcon: 'copy',
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

export const Playground = { render: Render };

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
