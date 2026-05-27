import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Button } from '../Button';

const meta = {
  title: 'Atoms/Popover',
  component: Popover,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    defaultOpen: { control: 'boolean' },
    open: { control: false },
    onOpenChange: { control: false },
  },
  args: {
    defaultOpen: false,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

const Panel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200, padding: 4 }}>
    <strong style={{ fontSize: 13, color: 'var(--tp-slate-900)' }}>Settings</strong>
    <p style={{ fontSize: 13, color: 'var(--tp-slate-500)', margin: 0 }}>
      Configure your preferences here.
    </p>
    <Button size="sm">Save</Button>
  </div>
);

export const Playground = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button>Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Panel />
      </PopoverContent>
    </Popover>
  ),
};

export const Open = {
  args: { defaultOpen: true },
  render: (args) => (
    <div style={{ padding: 80 }}>
      <Popover {...args}>
        <PopoverTrigger asChild>
          <Button>Trigger (open)</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Panel />
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const Sides = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 60, flexWrap: 'wrap' }}>
      {['top', 'right', 'bottom', 'left'].map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline">{side}</Button>
          </PopoverTrigger>
          <PopoverContent side={side}>
            <div style={{ padding: 4, fontSize: 13 }}>Side: {side}</div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Lab value detail popover — hover a result to see reference ranges. */
export const LabValueDetail = {
  name: '🧪 Lab Value Detail',
  parameters: { layout: 'centered' },
  render: () => {
    const results = [
      { name: 'Serum K+', value: '6.8', unit: 'mEq/L', status: 'critical', ref: '3.5–5.0' },
      { name: 'HbA1c', value: '7.2', unit: '%', status: 'high', ref: '< 5.7' },
      { name: 'Creatinine', value: '0.9', unit: 'mg/dL', status: 'normal', ref: '0.7–1.3' },
    ];
    const statusStyle = { critical: { color: '#9F1239', bg: '#FFE4E6' }, high: { color: '#92400E', bg: '#FEF3C7' }, normal: { color: '#15803D', bg: '#DCFCE7' } };
    return (
      <div style={{ display: 'flex', gap: 12, fontFamily: 'Inter, sans-serif' }}>
        {results.map((r) => (
          <Popover key={r.name}>
            <PopoverTrigger asChild>
              <button style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${statusStyle[r.status].color}20`, background: statusStyle[r.status].bg, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                <span style={{ fontSize: 11, color: '#54545C' }}>{r.name}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: statusStyle[r.status].color }}>{r.value}</span>
                <span style={{ fontSize: 10, color: '#54545C' }}>{r.unit}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" sideOffset={8}>
              <div style={{ padding: 4, display: 'grid', gap: 6, minWidth: 180, fontFamily: 'Inter, sans-serif' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#171725' }}>{r.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#54545C' }}>Result</span>
                  <span style={{ fontWeight: 600, color: statusStyle[r.status].color }}>{r.value} {r.unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#54545C' }}>Reference</span>
                  <span style={{ color: '#454551' }}>{r.ref} {r.unit}</span>
                </div>
                <div style={{ padding: '4px 8px', borderRadius: 4, background: statusStyle[r.status].bg, fontSize: 11, fontWeight: 600, color: statusStyle[r.status].color, textAlign: 'center', textTransform: 'capitalize' }}>
                  {r.status === 'critical' ? '⚠ Critical' : r.status === 'high' ? '↑ High' : '✓ Normal'}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    );
  },
};

/** Patient quick-view popover on a name chip in a table row. */
export const PatientQuickView = {
  name: '👤 Patient Quick View',
  parameters: { layout: 'centered' },
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ padding: 60, fontFamily: 'Inter, sans-serif' }}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              <span style={{ fontSize: 14, color: '#4B4AD5', fontWeight: 500, textDecoration: 'underline dotted' }}>Rohan Sharma</span>
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" sideOffset={12}>
            <div style={{ padding: 4, display: 'grid', gap: 10, minWidth: 220, fontFamily: 'Inter, sans-serif' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#4B4AD5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>RS</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#171725' }}>Rohan Sharma</div>
                  <div style={{ fontSize: 12, color: '#54545C' }}>MRN-20240812-001</div>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 5, fontSize: 12 }}>
                {[['Age', '38 years'], ['Blood group', 'B+'], ['Last visit', '15 May 2026'], ['Doctor', 'Dr. Ananya Mehta']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#54545C' }}>{k}</span>
                    <span style={{ color: '#454551', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Button size="sm" variant="solid">View record</Button>
                <Button size="sm" variant="ghost">Book appt</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
};
