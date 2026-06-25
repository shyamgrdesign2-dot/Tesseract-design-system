import React from 'react';
import { Alert } from './Alert';
import { Button } from '@/src/components/atoms/Button';

const meta = {
  title: 'Molecules/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'An inline status banner — persistent, in-flow messaging (allergy/drug-interaction warnings, page notices).',
          '',
          '**When to use** — important context that should stay visible on the page. For transient feedback use **Toast**; for a blocking decision use **ConfirmDialog**; for field-level errors use **Field** / InputBox `status`.',
          '',
          '**Key props** — `status` (info · success · warning · error), `title`, children (body), `icon` (override/`false` to hide), `action` (compose Button), `onDismiss` (shows ×), `variant` (soft · outline).',
          '',
          '**Good to know** — `role="alert"` for warning/error (assertive), `role="status"` otherwise; auto status glyph; token-only, composes the Button/TPLibraryIcon atoms.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'], table: { category: 'Appearance' } },
    variant: { control: 'inline-radio', options: ['soft', 'outline'], table: { category: 'Appearance' } },
    title: { control: 'text', table: { category: 'Content' } },
  },
  args: { status: 'warning', variant: 'soft', title: 'Allergy on file' },
};
export default meta;

export const Playground = {
  render: (a) => (
    <Alert {...a} style={{ maxWidth: 520 }}>Patient is allergic to penicillin. Review before prescribing.</Alert>
  ),
};

/** All four statuses. */
export const Statuses = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 520 }}>
      <Alert status="info" title="Heads up">A new lab result is available for review.</Alert>
      <Alert status="success" title="Saved">The prescription was signed and sent.</Alert>
      <Alert status="warning" title="Allergy on file">Patient is allergic to penicillin.</Alert>
      <Alert status="error" title="Drug interaction">Warfarin + ibuprofen — bleeding risk.</Alert>
    </div>
  ),
};

/** With an action and a dismiss button. */
export const WithActionAndDismiss = {
  render: () => {
    const [show, setShow] = React.useState(true);
    if (!show) return <Button variant="outline" theme="neutral" onClick={() => setShow(true)}>Show alert</Button>;
    return (
      <Alert
        status="error"
        title="Drug interaction detected"
        onDismiss={() => setShow(false)}
        action={<Button size="sm" variant="solid" theme="error">Review</Button>}
        style={{ maxWidth: 560 }}
      >
        Warfarin and ibuprofen together raise bleeding risk.
      </Alert>
    );
  },
};

/** Outline variant. */
export const Outline = {
  render: () => <Alert status="info" variant="outline" title="Note" style={{ maxWidth: 520 }}>Outlined surface for lower-emphasis notices.</Alert>,
};
