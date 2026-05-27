import React from 'react';
import { SidebarHeader } from './SidebarHeader';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/SidebarHeader',
  component: SidebarHeader,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    title: { control: 'text' },
    closeAriaLabel: { control: 'text' },
  },
  args: {
    title: 'Rx Preview',
  },
};

export default meta;

const CloseIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const Frame = ({ children }) => (
  <div style={{ width: 640, border: '1px solid var(--tp-slate-200, #e2e2ea)', borderRadius: 12, overflow: 'hidden' }}>
    {children}
  </div>
);

/** Title + close button only. */
export const Playground = {
  render: (args) => (
    <Frame>
      <SidebarHeader {...args} closeIcon={CloseIcon} onClose={() => {}} />
    </Frame>
  ),
};

/** With trailing CTA actions. */
export const WithActions = {
  render: () => (
    <Frame>
      <SidebarHeader
        title="Templates"
        closeIcon={CloseIcon}
        onClose={() => {}}
        actions={
          <>
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm">Save</Button>
          </>
        }
      />
    </Frame>
  ),
};

/** With a branded title-prefix tile and a tutorial control. */
export const WithPrefixAndTutorial = {
  render: () => (
    <Frame>
      <SidebarHeader
        title="Customise Rx"
        closeIcon={CloseIcon}
        onClose={() => {}}
        titlePrefix={
          <span
            aria-hidden
            style={{
              alignSelf: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'var(--tp-blue-500, #4b4ad5)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Rx
          </span>
        }
        tutorial={
          <Button variant="ghost" size="sm">
            Tutorial
          </Button>
        }
        actionsDivider={
          <span aria-hidden style={{ width: 1, height: 24, background: 'var(--tp-slate-200, #e2e2ea)' }} />
        }
        actions={<Button size="sm">Done</Button>}
      />
    </Frame>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Edit patient sidebar header with Save / Discard actions. */
export const EditPatientHeader = {
  name: '✏️ Edit Patient',
  render: () => (
    <Frame>
      <SidebarHeader
        title="Edit Patient — Rohan Sharma"
        closeIcon={CloseIcon}
        onClose={() => {}}
        actions={
          <>
            <Button variant="ghost" size="sm">Discard</Button>
            <Button size="sm">Save changes</Button>
          </>
        }
      />
    </Frame>
  ),
};

/** Prescription writer header with Rx prefix badge. */
export const RxWriterHeader = {
  name: '💊 Rx Writer',
  render: () => (
    <Frame>
      <SidebarHeader
        title="New Prescription"
        closeIcon={CloseIcon}
        onClose={() => {}}
        titlePrefix={
          <span aria-hidden style={{ alignSelf: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, background: '#4B4AD5', color: '#fff', fontWeight: 700, fontSize: 12 }}>Rx</span>
        }
        tutorial={<Button variant="ghost" size="sm">How it works</Button>}
        actionsDivider={<span aria-hidden style={{ width: 1, height: 24, background: '#E2E2EA' }} />}
        actions={
          <>
            <Button variant="outline" size="sm">Save draft</Button>
            <Button size="sm">Send to pharmacy</Button>
          </>
        }
      />
    </Frame>
  ),
};

/** Lab results detail header — read-only, single close action. */
export const LabResultsHeader = {
  name: '🧪 Lab Results',
  render: () => (
    <Frame>
      <SidebarHeader
        title="Lab Results — 15 May 2026"
        closeIcon={CloseIcon}
        onClose={() => {}}
        actions={<Button variant="outline" size="sm">Download PDF</Button>}
      />
    </Frame>
  ),
};
