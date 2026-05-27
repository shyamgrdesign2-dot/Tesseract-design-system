/**
 * FlashSnackbar — URL-flag-based success toasts.
 *
 * In production, a page navigates to `?flash=rx-saved` and this
 * component auto-shows the matching brand Snackbar, then clears the
 * flag from the URL. In Storybook, we drive it directly with the
 * underlying Snackbar since the next/navigation stub returns empty
 * search params.
 *
 * Stories here demonstrate:
 *   • Every flash key (rx-saved, rx-ended, visit-ended, saved-draft)
 *   • Auto-hide behaviour
 *   • Position variants
 *   • The "URL entry point" pattern explained in code
 */

import React from 'react';
import { Snackbar } from '@/src/components/molecules/Snackbar';
import { Button } from '@/src/components/atoms';

export default {
  title: 'Molecules/FlashSnackbar',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

// ── Flash message registry (mirrors FlashSnackbar.jsx) ─────────────────────

const FLASH_MESSAGES = {
  'rx-saved':     'Your Rx has been saved',
  'rx-ended':     'Your Rx has been successfully ended',
  'visit-ended':  'Visit ended successfully',
  'saved-draft':  'Appointment saved as draft',
};

// ── Helpers ────────────────────────────────────────────────────────────────

const Label = ({ children }) => (
  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#54545C', display: 'block', marginBottom: 6 }}>
    {children}
  </span>
);

// ── 1. Playground — trigger any flash key ──────────────────────────────────

export const Playground = {
  name: '🎛 Playground — All flash keys',
  render: () => {
    const [activeKey, setActiveKey] = React.useState(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Label>Click a button to simulate a page navigation with ?flash=key</Label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.keys(FLASH_MESSAGES).map((key) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => { setActiveKey(null); setTimeout(() => setActiveKey(key), 50); }}
            >
              ?flash={key}
            </Button>
          ))}
        </div>
        <Snackbar
          open={activeKey !== null}
          severity="success"
          message={activeKey ? FLASH_MESSAGES[activeKey] : ''}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={null}
          onClose={() => setActiveKey(null)}
        />
      </div>
    );
  },
};

// ── 2. Each flash key individually ────────────────────────────────────────

export const RxSaved = {
  name: '💊 rx-saved',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Label>Triggered when doctor saves a prescription</Label>
        <Button onClick={() => setOpen(true)}>Save Rx</Button>
        <Snackbar
          open={open}
          severity="success"
          message={FLASH_MESSAGES['rx-saved']}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={2400}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const RxEnded = {
  name: '✅ rx-ended',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Label>Triggered when an Rx session is ended</Label>
        <Button onClick={() => setOpen(true)}>End Rx</Button>
        <Snackbar
          open={open}
          severity="success"
          message={FLASH_MESSAGES['rx-ended']}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={2400}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const VisitEnded = {
  name: '🏥 visit-ended',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Label>Triggered when a patient visit is ended</Label>
        <Button onClick={() => setOpen(true)}>End Visit</Button>
        <Snackbar
          open={open}
          severity="success"
          message={FLASH_MESSAGES['visit-ended']}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={2400}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const SavedDraft = {
  name: '📋 saved-draft',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Label>Triggered when appointment is saved as draft</Label>
        <Button variant="outline" onClick={() => setOpen(true)}>Save as Draft</Button>
        <Snackbar
          open={open}
          severity="success"
          message={FLASH_MESSAGES['saved-draft']}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={2400}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── 3. Auto-hide (matches production 2400ms) ───────────────────────────────

export const AutoHide = {
  name: '⏱ Auto-hide (2.4s)',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Label>Dismisses after 2400ms — matches production behaviour</Label>
        <Button onClick={() => setOpen(true)}>Trigger (auto-hides in 2.4s)</Button>
        <Snackbar
          open={open}
          severity="success"
          message="Your Rx has been saved"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={2400}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── 4. Rapid re-trigger (like navigating twice) ────────────────────────────

export const RapidRetrigger = {
  name: '🔁 Rapid re-trigger',
  render: () => {
    const [key, setKey] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const trigger = () => {
      setOpen(false);
      setKey((k) => k + 1);
      setTimeout(() => setOpen(true), 60);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Label>Click multiple times — each click resets and re-shows the snackbar</Label>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={trigger}>Save Rx (re-trigger)</Button>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Dismiss</Button>
        </div>
        <Snackbar
          key={key}
          open={open}
          severity="success"
          message="Your Rx has been saved"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={null}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── 5. URL pattern documentation ──────────────────────────────────────────

export const URLPattern = {
  name: '📖 URL entry point pattern',
  render: () => (
    <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: 560, padding: 24, background: '#FAFAFB', borderRadius: 12, border: '1px solid #E2E2EA' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#171725' }}>
        How FlashSnackbar works
      </h3>
      <p style={{ margin: '0 0 12px', fontSize: 14, color: '#54545C', lineHeight: 1.6 }}>
        Any page can trigger a flash toast by navigating with a <code style={{ background: '#F1F1F5', borderRadius: 4, padding: '1px 5px', fontSize: 13 }}>?flash=key</code> query param.
        FlashSnackbar reads the key, maps it to a message, shows the Snackbar, then strips the param from the URL.
      </p>
      <div style={{ background: '#F7F7FB', borderRadius: 8, padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, color: '#454551', lineHeight: 1.7 }}>
        {Object.entries(FLASH_MESSAGES).map(([key, msg]) => (
          <div key={key}>
            <span style={{ color: '#4B4AD5', fontWeight: 600 }}>?flash={key}</span>
            <span style={{ color: '#54545C' }}> → </span>
            <span style={{ color: '#10B981' }}>"{msg}"</span>
          </div>
        ))}
      </div>
      <p style={{ margin: '12px 0 0', fontSize: 13, color: '#54545C', lineHeight: 1.5 }}>
        Example: <code style={{ background: '#F1F1F5', borderRadius: 4, padding: '1px 5px' }}>router.push('/appointments?flash=rx-saved')</code>
      </p>
    </div>
  ),
};
