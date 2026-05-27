import React from 'react';
import { Snackbar } from './Snackbar';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/Snackbar',
  component: Snackbar,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    severity: {
      control: 'inline-radio',
      options: ['success', 'info', 'warning', 'error'],
    },
    anchorVertical: { control: 'inline-radio', options: ['top', 'bottom'] },
    anchorHorizontal: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
    message: { control: 'text' },
  },
  args: {
    severity: 'success',
    message: 'Changes saved successfully',
    anchorVertical: 'top',
    anchorHorizontal: 'center',
    autoHideDuration: null,
  },
};

export default meta;

export const Playground = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Show snackbar</Button>
        <Snackbar {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};

export const Severities = {
  render: () => {
    const [severity, setSeverity] = React.useState(null);
    return (
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {['success', 'info', 'warning', 'error'].map((s) => (
          <Button key={s} variant="outline" onClick={() => setSeverity(s)}>
            {s}
          </Button>
        ))}
        <Snackbar
          open={severity !== null}
          severity={severity || 'success'}
          message={severity ? `This is a ${severity} message` : ''}
          autoHideDuration={null}
          onClose={() => setSeverity(null)}
        />
      </div>
    );
  },
};

export const AutoHide = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>
          Show (auto-hides after 3s)
        </Button>
        <Snackbar
          open={open}
          severity="info"
          message="This will disappear automatically"
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const BottomLeft = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Show bottom-left</Button>
        <Snackbar
          open={open}
          severity="warning"
          message="Anchored to the bottom-left"
          anchorVertical="bottom"
          anchorHorizontal="left"
          autoHideDuration={null}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Clinically realistic snackbar messages — trigger each action type. */
export const HealthcareMessages = {
  name: '🏥 Healthcare Messages',
  render: () => {
    const [snack, setSnack] = React.useState(null);
    const messages = [
      { label: 'Rx saved', severity: 'success', message: 'Prescription saved — Amlodipine 5mg × 30 days' },
      { label: 'Appointment booked', severity: 'success', message: 'Appointment confirmed with Dr. Mehta on 2 Jun, 10:30 AM' },
      { label: 'Upload failed', severity: 'error', message: 'Upload failed — scan-029.dcm exceeds the 10 MB limit' },
      { label: 'Session expiring', severity: 'warning', message: 'Session expiring in 5 minutes. Save your work.' },
      { label: 'Pre-auth submitted', severity: 'info', message: 'Pre-authorisation submitted to Cigna Health' },
      { label: 'Record updated', severity: 'success', message: 'Patient record updated successfully' },
    ];
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 360 }}>
          {messages.map((m) => (
            <Button key={m.label} size="sm" variant="outline" onClick={() => setSnack(m)}>
              {m.label}
            </Button>
          ))}
        </div>
        <Snackbar
          open={snack !== null}
          severity={snack?.severity || 'success'}
          message={snack?.message || ''}
          autoHideDuration={3000}
          onClose={() => setSnack(null)}
          anchorVertical="top"
          anchorHorizontal="center"
        />
      </div>
    );
  },
};

/** Critical alert — error severity, no auto-hide, manual dismiss required. */
export const CriticalAlert = {
  name: '⚠️ Critical Lab Alert',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button variant="solid" onClick={() => setOpen(true)}>Trigger critical alert</Button>
        <Snackbar
          open={open}
          severity="error"
          message="Critical: Serum K+ 6.8 mEq/L — immediate review required"
          autoHideDuration={null}
          onClose={() => setOpen(false)}
          anchorVertical="top"
          anchorHorizontal="center"
        />
      </div>
    );
  },
};
