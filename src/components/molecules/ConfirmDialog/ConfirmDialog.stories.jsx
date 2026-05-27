import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    warning: { control: 'text' },
    primaryLabel: { control: 'text' },
    secondaryLabel: { control: 'text' },
    primaryTone: { control: 'select', options: ['primary', 'neutral', 'error'] },
    secondaryTone: { control: 'inline-radio', options: ['default', 'destructive'] },
  },
  args: {
    title: 'Discard changes?',
    description: 'Your unsaved edits will be lost. This cannot be undone.',
    primaryLabel: 'Discard',
    secondaryLabel: 'Keep editing',
    primaryTone: 'error',
  },
};

export default meta;

/** Triggered: closed until the button is clicked. */
export const Playground = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open confirm dialog</Button>
        <ConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          onPrimary={() => setOpen(false)}
          onSecondary={() => setOpen(false)}
        />
      </>
    );
  },
};

/** Open by default to showcase the alertdialog surface. */
export const Open = {
  render: (args) => {
    const [open, setOpen] = React.useState(true);
    return (
      <ConfirmDialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        onPrimary={() => setOpen(false)}
        onSecondary={() => setOpen(false)}
      />
    );
  },
};

/** With a warning callout above the body. */
export const WithWarning = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete patient record?"
        warning="This action permanently removes all associated clinical data."
        description="Type the patient name to confirm in the next step."
        primaryLabel="Delete"
        primaryTone="error"
        secondaryLabel="Cancel"
        onPrimary={() => setOpen(false)}
        onSecondary={() => setOpen(false)}
      />
    );
  },
};

/** Destructive secondary option (safe action is primary). */
export const DestructiveSecondary = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Unsaved draft"
        description="You can keep working or discard the draft entirely."
        primaryLabel="Keep working"
        primaryTone="primary"
        secondaryLabel="Discard draft"
        secondaryTone="destructive"
        onPrimary={() => setOpen(false)}
        onSecondary={() => setOpen(false)}
      />
    );
  },
};

/** Primary action disabled. */
export const PrimaryDisabled = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Confirm submission"
        description="Complete all required fields before submitting."
        primaryLabel="Submit"
        primaryDisabled
        secondaryLabel="Cancel"
        onSecondary={() => setOpen(false)}
      />
    );
  },
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Archive a patient — reversible, neutral tone. */
export const ArchivePatient = {
  name: '🗂️ Archive Patient',
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Archive patient record?"
        description="Rohan Sharma's record will be moved to the archive. You can restore it at any time from the Archived patients list."
        primaryLabel="Archive"
        primaryTone="neutral"
        secondaryLabel="Cancel"
        onPrimary={() => setOpen(false)}
        onSecondary={() => setOpen(false)}
      />
    );
  },
};

/** End a teleconsult session — destructive, warns of data loss. */
export const EndConsultSession = {
  name: '📞 End Consult',
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="End consultation?"
        description="The video session will be terminated and the patient disconnected."
        warning="Unsaved clinical notes will be lost. Save them before ending."
        primaryLabel="End session"
        primaryTone="error"
        secondaryLabel="Keep going"
        onPrimary={() => setOpen(false)}
        onSecondary={() => setOpen(false)}
      />
    );
  },
};

/** Send prescription without review — confirm flow. */
export const SendPrescription = {
  name: '💊 Send Prescription',
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [sent, setSent] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)} disabled={sent}>
          {sent ? 'Prescription sent ✓' : 'Send to pharmacy'}
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Send prescription?"
          description="Amlodipine 5mg × 30 days will be sent to Apollo Pharmacy, Banjara Hills. This cannot be recalled once dispatched."
          primaryLabel="Send now"
          primaryTone="primary"
          secondaryLabel="Review again"
          onPrimary={() => { setOpen(false); setSent(true); }}
          onSecondary={() => setOpen(false)}
        />
      </div>
    );
  },
};
