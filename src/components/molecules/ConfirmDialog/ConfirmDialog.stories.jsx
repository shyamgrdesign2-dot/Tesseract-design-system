import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from '@/src/components/atoms/Button';
import { TPLibraryIcon } from '@/src/components/atoms/icons/tp/TPLibraryIcon';

const VARIANTS = ['solid', 'outline', 'ghost', 'tonal', 'link'];
const THEMES = ['primary', 'neutral', 'warning', 'error', 'success'];

const meta = {
  title: 'Molecules/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Header · Body · Footer confirmation modal. Convention (developer decides): the **primary** CTA is the safe/non-destructive action; the **destructive** action goes on the **secondary** CTA. CTA colors come from the Button `theme` (TP blue + warning/error/success/neutral).' } },
  },
};

export default meta;

// ── Open-state wrapper used by every story ────────────────────────────────────
function Demo({ trigger = 'Open dialog', ...props }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="solid" onClick={() => setOpen(true)}>{trigger}</Button>
      <ConfirmDialog open={open} onOpenChange={setOpen} {...props} />
    </>
  );
}

// ── Playground — every section + CTA in Controls ──────────────────────────────
export const Playground = {
  args: {
    title: 'Discard changes?',
    // Body
    withDescription: true,
    description: 'Your unsaved edits to this prescription will be lost.',
    withCallout: true,
    callout: 'This action cannot be undone.',
    calloutTone: 'warning',
    calloutIcon: true,
    calloutIconName: '',
    calloutPlacement: 'above',
    withCheckbox: false,
    checkboxLabel: "Don't show this again",
    // CTAs
    primaryLabel: 'Keep editing',
    primaryVariant: 'solid',
    primaryTheme: 'primary',
    secondaryLabel: 'Discard',
    secondaryVariant: 'outline',
    secondaryTheme: 'error',
    tertiaryLabel: '',
    tertiaryVariant: 'link',
    tertiaryTheme: 'neutral',
    // Footer layout
    actionsAlign: 'right',
    actionsFullWidth: false,
  },
  argTypes: {
    title:            { control: 'text', table: { category: 'Header' } },
    withDescription:  { control: 'boolean', name: 'with description', table: { category: 'Body' } },
    description:      { control: 'text', table: { category: 'Body' } },
    withCallout:      { control: 'boolean', name: 'with callout box', table: { category: 'Body' } },
    callout:          { control: 'text', name: 'callout text', table: { category: 'Body' } },
    calloutTone:      { control: 'inline-radio', options: ['neutral', 'warning', 'error'], name: 'callout tone', table: { category: 'Body' } },
    calloutIcon:      { control: 'boolean', name: 'callout icon', table: { category: 'Body' } },
    calloutIconName:  { control: 'text', tpIcon: true, name: 'callout icon (override)', description: 'Pick a TP icon to override the callout icon', table: { category: 'Body' } },
    calloutPlacement: { control: 'inline-radio', options: ['above', 'below'], name: 'callout vs text', table: { category: 'Body' } },
    withCheckbox:     { control: 'boolean', name: 'with checkbox', table: { category: 'Body' } },
    checkboxLabel:    { control: 'text', name: 'checkbox label', table: { category: 'Body' } },

    primaryLabel:     { control: 'text', name: 'primary · label', table: { category: 'Primary CTA' } },
    primaryVariant:   { control: 'select', options: VARIANTS, name: 'primary · variant', table: { category: 'Primary CTA' } },
    primaryTheme:     { control: 'select', options: THEMES, name: 'primary · color', table: { category: 'Primary CTA' } },

    secondaryLabel:   { control: 'text', name: 'secondary · label', table: { category: 'Secondary CTA' } },
    secondaryVariant: { control: 'select', options: VARIANTS, name: 'secondary · variant', table: { category: 'Secondary CTA' } },
    secondaryTheme:   { control: 'select', options: THEMES, name: 'secondary · color', table: { category: 'Secondary CTA' } },

    tertiaryLabel:    { control: 'text', name: 'tertiary · label', table: { category: 'Tertiary CTA' } },
    tertiaryVariant:  { control: 'select', options: VARIANTS, name: 'tertiary · variant', table: { category: 'Tertiary CTA' } },
    tertiaryTheme:    { control: 'select', options: THEMES, name: 'tertiary · color', table: { category: 'Tertiary CTA' } },

    actionsAlign:     { control: 'inline-radio', options: ['left', 'right'], name: 'align', table: { category: 'Footer layout' } },
    actionsFullWidth: { control: 'boolean', name: 'full width (equal)', table: { category: 'Footer layout' } },
  },
  render: (a) => (
    <Demo
      title={a.title}
      description={a.withDescription ? a.description : undefined}
      callout={a.withCallout ? a.callout : undefined}
      calloutTone={a.calloutTone}
      calloutIcon={a.calloutIcon}
      calloutCustomIcon={a.calloutIconName ? <TPLibraryIcon name={a.calloutIconName} size={a.withCallout ? 24 : 20} /> : undefined}
      calloutPlacement={a.calloutPlacement}
      checkboxLabel={a.withCheckbox ? a.checkboxLabel : undefined}
      primaryLabel={a.primaryLabel}
      primaryVariant={a.primaryVariant}
      primaryTheme={a.primaryTheme}
      secondaryLabel={a.secondaryLabel}
      secondaryVariant={a.secondaryVariant}
      secondaryTheme={a.secondaryTheme}
      tertiaryLabel={a.tertiaryLabel || undefined}
      tertiaryVariant={a.tertiaryVariant}
      tertiaryTheme={a.tertiaryTheme}
      actionsAlign={a.actionsAlign}
      actionsFullWidth={a.actionsFullWidth}
    />
  ),
};

// ── Destructive flow — safe action is primary, destructive is secondary ───────
export const DestructiveFlow = {
  render: () => (
    <Demo
      trigger="Delete patient"
      title="Delete patient record?"
      description="Aarav Sharma’s record and all linked visits will be permanently removed."
      callout="This action cannot be undone."
      calloutTone="error"
      primaryLabel="Keep record"
      secondaryLabel="Delete"
      secondaryVariant="solid"
      secondaryTheme="error"
    />
  ),
};

// ── Callout tones — neutral (info) · warning · error ──────────────────────────
export const CalloutTones = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Demo trigger="Neutral" title="Heads up" callout="Changes apply to the next visit only." calloutTone="neutral" primaryLabel="Got it" secondaryLabel="Cancel" />
      <Demo trigger="Warning" title="Unsynced data" callout="3 notes haven’t synced to the EHR yet." calloutTone="warning" primaryLabel="Sync now" secondaryLabel="Later" secondaryTheme="warning" secondaryVariant="outline" />
      <Demo trigger="Error" title="Sync failed" callout="The last sync failed and data may be stale." calloutTone="error" primaryLabel="Retry" secondaryLabel="Dismiss" />
    </div>
  ),
};

// ── Three CTAs — tertiary (left) + secondary + primary ────────────────────────
export const ThreeCtas = {
  name: 'Three CTAs',
  render: () => (
    <Demo
      trigger="End consultation"
      title="End this consultation?"
      description="You can save a draft and resume later, or end and generate the summary now."
      callout="Unsaved vitals will be included in the summary."
      calloutTone="neutral"
      tertiaryLabel="Save draft"
      tertiaryVariant="ghost"
      secondaryLabel="Cancel"
      secondaryVariant="outline"
      primaryLabel="End & summarize"
      primaryTheme="primary"
    />
  ),
};

// ── Callout icon scales with line count (1–2 → 24px, 3 → 42px) ────────────────
export const CalloutLineScaling = {
  name: 'Callout · Icon Scales With Lines',
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Demo trigger="1 line" title="Heads up" callout="This cannot be undone." calloutTone="warning" primaryLabel="OK" secondaryLabel="Cancel" />
      <Demo trigger="2 lines" title="Heads up" callout="This action is permanent and will remove all linked visit records for this patient." calloutTone="warning" primaryLabel="OK" secondaryLabel="Cancel" />
      <Demo trigger="3 lines" title="Heads up" callout="This action is permanent. It removes the patient record, every linked visit, all prescriptions, and any uploaded reports — and it cannot be undone afterwards." calloutTone="error" primaryLabel="Keep" secondaryLabel="Delete" secondaryTheme="error" secondaryVariant="solid" />
    </div>
  ),
};

// ── Footer CTA layout — align + full-width ────────────────────────────────────
export const ActionLayout = {
  name: 'Footer · CTA Layout',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Demo trigger="Right (default)" title="Save changes?" description="Right-aligned CTAs are the default." primaryLabel="Save" secondaryLabel="Cancel" secondaryVariant="outline" actionsAlign="right" />
      <Demo trigger="Left aligned" title="Save changes?" description="Primary and secondary pinned to the left." primaryLabel="Save" secondaryLabel="Cancel" secondaryVariant="outline" actionsAlign="left" />
      <Demo trigger="Full width (equal)" title="Save changes?" description="Two CTAs share the dialog width equally." primaryLabel="Save" secondaryLabel="Cancel" secondaryVariant="outline" actionsFullWidth />
    </div>
  ),
};

// ── Text only / box only ──────────────────────────────────────────────────────
export const BodyVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Demo trigger="Text only" title="Log out?" description="You’ll need to sign in again to access patient records." primaryLabel="Stay" secondaryLabel="Log out" secondaryTheme="error" secondaryVariant="outline" />
      <Demo trigger="Box only" title="Archive patient?" callout="Archived patients move to the inactive list." calloutTone="warning" primaryLabel="Keep active" secondaryLabel="Archive" secondaryVariant="outline" secondaryTheme="warning" />
    </div>
  ),
};
