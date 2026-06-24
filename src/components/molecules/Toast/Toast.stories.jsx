import React from 'react';
import { Toast } from './Toast';
import { Button } from '@/src/components/atoms';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];

// Resolve the override-icon node, sized to the toast (42 two-line / 24 one-line).
const glyphFor = (name, size, variant = 'linear', family) =>
  name ? <TPIcon name={name} variant={variant} family={family || undefined} size={size} /> : undefined;

const meta = {
  title: 'Molecules/Toast',
  component: Toast,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    status:      { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'], table: { category: 'Content' } },
    surface:     { control: 'inline-radio', options: ['dark', 'light'], description: 'Surface variant — dark (default) or a light bg + dark text', table: { category: 'Content' } },
    title:       { control: 'text', table: { category: 'Content' } },
    withSubtext: { control: 'boolean', name: 'with subtext', table: { category: 'Content' } },
    subtext:     { control: 'text', table: { category: 'Content' } },
    showIcon:    { control: 'boolean', name: 'with icon', table: { category: 'Parts' } },
    dismissible: { control: 'boolean', name: 'with dismiss (×)', table: { category: 'Parts' } },
    closeIcon:   { control: 'text', tpIcon: true, name: 'close icon', description: 'Library icon name to override the dismiss glyph (blank = close-square)', if: { arg: 'dismissible' }, table: { category: 'Parts' } },
    progress:    { control: 'boolean', name: 'with progress bar', description: 'Depleting bar over `duration` (needs duration > 0)', table: { category: 'Parts' } },
    duration:    { control: { type: 'number', min: 0, step: 500 }, name: 'duration (ms)', description: '0 = persist; > 0 auto-dismisses', table: { category: 'Parts' } },
    iconName:    { control: 'text', tpIcon: true, name: 'icon', description: 'CDN icon name to override the status icon (blank = none)', table: { category: 'Icons' } },
    iconVariant: { control: 'select', options: ICON_VARIANTS, name: 'icon style', description: 'Icon style for the override icon', table: { category: 'Icons' } },
    iconFamily:  { control: 'text', name: 'icon family', description: 'Override the auto-resolved CDN family (blank = auto)', table: { category: 'Icons' } },
    // Nested CTA — toggle it on/off, then choose its Button variant + label.
    withCTA:     { control: 'boolean', name: 'with CTA', table: { category: 'Action' } },
    action:      { control: 'select', options: ['solid', 'outline', 'ghost', 'tonal', 'link'], name: 'CTA variant', table: { category: 'Action' } },
    actionLabel: { control: 'text', name: 'CTA label', table: { category: 'Action' } },
    // real `children` is driven by `subtext` in the render
    children:    { table: { disable: true } },
  },
  args: {
    status: 'warning',
    surface: 'dark',
    title: 'License expiring soon',
    withSubtext: true,
    subtext: 'Your TatvaPractice Enterprise license expires on 15 June 2026.',
    showIcon: true,
    dismissible: true,
    closeIcon: '',
    progress: false,
    duration: 0,
    iconName: '',
    iconVariant: 'linear',
    iconFamily: '',
    withCTA: true,
    action: 'solid',
    actionLabel: 'Renew',
  },
};

export default meta;

const Stack = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, width: '100%' }}>
    {children}
  </div>
);

// Build the nested CTA from the synthetic controls. The Button surface follows
// the toast surface so the CTA reads correctly on a light or dark toast.
const renderAction = (on, variant, label, surface = 'dark') =>
  on ? <Button surface={surface} variant={variant} size="sm">{label || 'Action'}</Button> : undefined;

// Build an accurate, copy-paste code snippet from the controls (what "Show code" shows).
const iconJsx = (name, variant, family, size) =>
  `<TPIcon name="${name}"${variant && variant !== 'linear' ? ` variant="${variant}"` : ''}${family ? ` family="${family}"` : ''} size={${size}} />`;

const toastCode = ({ status = 'info', surface = 'dark', title = '', withSubtext, subtext = '', showIcon, iconName, iconVariant, iconFamily, dismissible, closeIcon, progress, duration, withCTA, action, actionLabel }) => {
  const btnSurface = surface === 'light' ? 'light' : 'dark';
  const lines = [`  status="${status}"`];
  if (surface !== 'dark') lines.push(`  surface="${surface}"`);
  lines.push(`  title="${title}"`);
  if (!showIcon) lines.push('  showIcon={false}');
  if (iconName) lines.push(`  icon={${iconJsx(iconName, iconVariant, iconFamily, withSubtext ? 42 : 24)}}`);
  if (dismissible) lines.push('  dismissible');
  if (dismissible && closeIcon) lines.push(`  closeIcon="${closeIcon}"`);
  if (duration > 0) lines.push(`  duration={${duration}}`);
  if (progress && duration > 0) lines.push('  progress');
  if (withCTA) lines.push(`  action={<Button surface="${btnSurface}" variant="${action}" size="sm">${actionLabel || 'Action'}</Button>}`);
  if (withSubtext && subtext) return `<Toast\n${lines.join('\n')}\n>\n  ${subtext}\n</Toast>`;
  return `<Toast\n${lines.join('\n')}\n/>`;
};

export const Playground = {
  render: ({ status, surface, title, withSubtext, subtext, showIcon, iconName, iconVariant, iconFamily, dismissible, closeIcon, progress, duration, withCTA, action, actionLabel }) => (
    <div style={{ width: '100%' }}>
      <Toast
        status={status}
        surface={surface}
        title={title}
        showIcon={showIcon}
        icon={glyphFor(iconName, withSubtext ? 42 : 24, iconVariant, iconFamily)}
        dismissible={dismissible}
        closeIcon={closeIcon || undefined}
        progress={progress}
        duration={duration}
        action={renderAction(withCTA, action, actionLabel, surface === 'light' ? 'light' : 'dark')}
      >
        {withSubtext ? (subtext || undefined) : undefined}
      </Toast>
    </div>
  ),
  parameters: { docs: { source: { transform: (_code, ctx) => toastCode(ctx.args) } } },
};

/** Width grows to content, caps at 60%. Long text follows the line rules:
 *  title-only → up to 2 lines; title + subtext → each a single truncated line. */
export const SizingAndTruncation = {
  name: 'Sizing & Truncation',
  render: () => (
    <Stack>
      <Toast status="info" title="Short toast" dismissible />
      <Toast status="warning" dismissible
        title="Title only — this is a deliberately very long heading that exceeds the sixty percent maximum width of the toast, so it first wraps onto a second line and then, if it is still too long to fit within those two lines, it truncates with a trailing ellipsis instead of growing further">
      </Toast>
      <Toast status="error" dismissible
        title="Title and subtext together — this heading is intentionally far too long to fit on one line, so it stays on a single line and truncates with an ellipsis"
        action={<Button surface="dark" variant="solid" size="sm">Retry</Button>}>
        And this supporting subtext is also intentionally very long so it stays on one single line and truncates with an ellipsis rather than wrapping onto multiple lines, which keeps every toast a tidy, predictable height.
      </Toast>
    </Stack>
  ),
};

/** All four statuses — only the icon is colored. */
export const Statuses = {
  render: () => (
    <Stack>
      <Toast status="info" title="Information" dismissible>Routine sync completed at 09:42.</Toast>
      <Toast status="success" title="Saved" dismissible>Prescription saved to the patient record.</Toast>
      <Toast status="warning" title="Action needed" dismissible>3 clinical notes are still incomplete.</Toast>
      <Toast status="error" title="Sync failed" dismissible>EHR sync failed — retrying in 5 minutes.</Toast>
    </Stack>
  ),
};

/** Light surface — token-driven light bg + dark text. Same status colours,
 *  shifted to the deeper ramp for legibility. CTAs use a light-surface Button. */
export const LightSurface = {
  name: 'Light surface',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, width: '100%', padding: 16, background: 'var(--tesseract-slate-100, #F1F1F5)', borderRadius: 12 }}>
      <Toast surface="light" status="info" title="New ABDM guidelines" dismissible>
        Effective 1 June 2026 — review the updated consent flow.
      </Toast>
      <Toast surface="light" status="success" title="Prescription saved" dismissible>
        Saved to the patient record.
      </Toast>
      <Toast surface="light" status="warning" title="License expiring soon" dismissible
        action={<Button surface="light" variant="solid" size="sm">Renew</Button>}>
        Your TatvaPractice Enterprise license expires on 15 June 2026.
      </Toast>
      <Toast surface="light" status="error" title="Sync failed" dismissible>
        EHR sync failed — retrying in 5 minutes.
      </Toast>
    </div>
  ),
};

/** Progress bar — a thin, status-coloured bar depletes over `duration`.
 *  Pass `progress` alongside `duration` (ms). Click to fire one. */
export const WithProgress = {
  name: 'With progress bar',
  render: () => {
    const [seq, setSeq] = React.useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif' }}>
        <Button variant="solid" size="sm" onClick={() => setSeq((s) => s + 1)}>Show toast</Button>
        <div style={{ minHeight: 64 }}>
          {seq > 0 && (
            <Toast key={seq} status="info" title="Uploading records" dismissible progress duration={5000}>
              5 patient records are syncing — this bar shows the remaining time.
            </Toast>
          )}
        </div>
      </div>
    );
  },
};

/** Single line — primary text only (no subtext). Icon is the compact 24px. */
export const SingleLine = {
  render: () => (
    <Stack>
      <Toast status="success" title="Prescription saved" dismissible />
      <Toast status="info" title="Sync completed at 09:42" dismissible />
      <Toast
        status="warning"
        title="3 clinical notes incomplete"
        dismissible
        action={<Button surface="dark" variant="ghost" size="sm">Review</Button>}
      />
    </Stack>
  ),
};

/** Without action — just the dismiss (×), or nothing. */
export const WithoutAction = {
  render: () => (
    <Stack>
      <Toast status="success" title="Backup completed">Nightly backup finished at 02:00.</Toast>
      <Toast status="info" title="New ABDM guidelines" dismissible>
        Effective 1 June 2026 — review the updated consent flow.
      </Toast>
    </Stack>
  ),
};

/** With action — a dark-surface Button alongside the message. */
export const WithAction = {
  render: () => (
    <Stack>
      <Toast
        status="warning"
        title="License expiring soon"
        dismissible
        action={<Button surface="dark" variant="solid" size="sm">Renew</Button>}
      >
        Your TatvaPractice Enterprise license expires on 15 June 2026.
      </Toast>
      <Toast
        status="info"
        title="Software update available"
        action={<Button surface="dark" variant="outline" size="sm">Update</Button>}
      >
        Version 4.2 is ready to install.
      </Toast>
    </Stack>
  ),
};

/** System alerts — the real healthcare scenarios. */
export const SystemAlerts = {
  render: () => (
    <Stack>
      <Toast status="error" title="EHR sync failure">
        Patient records failed to sync. Contact IT if this persists.
      </Toast>
      <Toast status="warning" title="License expiring soon" dismissible
        action={<Button surface="dark" variant="solid" size="sm">Renew</Button>}>
        Your TatvaPractice Enterprise license expires on 15 June 2026.
      </Toast>
      <Toast status="info" title="New ABDM guidelines effective 1 June 2026" dismissible>
        Review the updated consent and data-sharing flow.
      </Toast>
      <Toast status="success" title="Bulk import ready" dismissible
        action={<Button surface="dark" variant="ghost" size="sm">View</Button>}>
        128 patient records imported successfully.
      </Toast>
    </Stack>
  ),
};

/** Auto-dismiss — pass `duration` (ms) to auto-hide. The timer pauses on hover.
 *  Click "Show toast" to fire one that disappears after 4 s. */
export const AutoDismiss = {
  name: 'Auto-dismiss (duration)',
  render: () => {
    const [seq, setSeq] = React.useState(0);
    const [count, setCount] = React.useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button variant="solid" size="sm" onClick={() => setSeq((s) => s + 1)}>Show toast</Button>
          <span style={{ fontSize: 13, color: '#54545C' }}>Dismissed: <strong style={{ color: '#171725' }}>{count}</strong></span>
        </div>
        <div style={{ minHeight: 64 }}>
          {seq > 0 && (
            <Toast key={seq} status="success" title="Saved" dismissible duration={4000} onDismiss={() => setCount((c) => c + 1)}>
              This toast auto-dismisses in 4 seconds (hover to pause).
            </Toast>
          )}
        </div>
      </div>
    );
  },
};
