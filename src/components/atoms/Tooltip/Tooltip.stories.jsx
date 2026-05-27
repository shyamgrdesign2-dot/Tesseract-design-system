import React from 'react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    content: { control: 'text' },
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    sideOffset: { control: 'number' },
    delayDuration: { control: 'number' },
    defaultOpen: { control: 'boolean' },
  },
  args: {
    content: 'Save changes',
    side: 'top',
    align: 'center',
    sideOffset: 6,
    delayDuration: 200,
    defaultOpen: false,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Playground = {
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Open = {
  args: { defaultOpen: true, content: 'I am open by default' },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Trigger</Button>
    </Tooltip>
  ),
};

export const Sides = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 40, padding: 60, flexWrap: 'wrap' }}>
      {['top', 'right', 'bottom', 'left'].map((side) => (
        <Tooltip key={side} {...args} side={side} content={`Side: ${side}`}>
          <Button variant="outline">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const RichContent = {
  args: {
    content: 'This tooltip wraps a longer descriptive message for the trigger element.',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="ghost">Details</Button>
    </Tooltip>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Icon buttons in clinical UIs benefit from tooltips for accessibility. */
export const IconButtonTooltips = {
  name: '🩺 Icon Button Tooltips',
  parameters: { layout: 'centered' },
  render: () => {
    const iconBtn = (label) => ({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 32, borderRadius: 6,
      border: '1px solid #E2E2EA', background: '#fff',
      cursor: 'pointer', color: '#54545C',
    });
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip content="Edit patient record" side="top">
          <button style={iconBtn('Edit')} aria-label="Edit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </Tooltip>
        <Tooltip content="View lab results" side="top">
          <button style={iconBtn('View')} aria-label="View">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </Tooltip>
        <Tooltip content="Download document" side="top">
          <button style={iconBtn('Download')} aria-label="Download">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        </Tooltip>
        <Tooltip content="Archive patient" side="top">
          <button style={iconBtn('Archive')} aria-label="Archive">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
          </button>
        </Tooltip>
        <Tooltip content="Delete record — cannot be undone" side="top">
          <button style={{ ...iconBtn('Delete'), color: '#E11D48', borderColor: '#FCA5A5' }} aria-label="Delete">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </Tooltip>
      </div>
    );
  },
};

/** Tooltip on a status chip — provides full label when text is abbreviated. */
export const StatusChipTooltip = {
  name: '🏷️ Status Chip Tooltip',
  parameters: { layout: 'centered' },
  render: () => {
    const chip = (label, color, bg, tooltip) => (
      <Tooltip content={tooltip} side="top" key={label}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
          background: bg, color, cursor: 'default', fontFamily: 'Inter, sans-serif',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
          {label}
        </span>
      </Tooltip>
    );
    return (
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {chip('Active', '#16A34A', '#DCFCE7', 'Patient is currently active and receiving care')}
        {chip('Follow-up', '#92400E', '#FEF3C7', 'Pending follow-up appointment required')}
        {chip('Critical', '#E11D48', '#FFE4E6', 'Critical lab value — immediate review required')}
        {chip('Discharged', '#64748B', '#F1F5F9', 'Patient has been discharged from this visit')}
      </div>
    );
  },
};

/** Informational tooltip alongside a form field label — common pattern in intake forms. */
export const FormFieldTooltip = {
  name: '📋 Form Field Tooltip',
  parameters: { layout: 'centered' },
  render: () => {
    const LabelWithTip = ({ label, tip }) => (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Inter, sans-serif' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#454551' }}>{label}</span>
        <Tooltip content={tip} side="right" sideOffset={4}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 16, height: 16, borderRadius: '50%', background: '#E2E2EA',
            fontSize: 10, fontWeight: 700, color: '#54545C', cursor: 'help',
          }}>?</span>
        </Tooltip>
      </div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
        <div>
          <LabelWithTip label="MRN" tip="Medical Record Number — unique identifier assigned by your clinic." />
          <input aria-label="MRN" readOnly value="MRN-20240812-001" style={{ marginTop: 6, width: '100%', padding: '8px 10px', border: '1px solid #E2E2EA', borderRadius: 6, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#54545C', background: '#FAFAFA', boxSizing: 'border-box' }} />
        </div>
        <div>
          <LabelWithTip label="eGFR" tip="Estimated Glomerular Filtration Rate — measures kidney function. Normal range: 90–120 mL/min." />
          <input aria-label="eGFR" readOnly value="72 mL/min/1.73m²" style={{ marginTop: 6, width: '100%', padding: '8px 10px', border: '1px solid #E2E2EA', borderRadius: 6, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#171725', boxSizing: 'border-box' }} />
        </div>
        <div>
          <LabelWithTip label="ABHA ID" tip="Ayushman Bharat Health Account — national digital health identity (14-digit number)." />
          <input aria-label="ABHA ID" readOnly value="91-1234-5678-9012" style={{ marginTop: 6, width: '100%', padding: '8px 10px', border: '1px solid #E2E2EA', borderRadius: 6, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#171725', boxSizing: 'border-box' }} />
        </div>
      </div>
    );
  },
};
