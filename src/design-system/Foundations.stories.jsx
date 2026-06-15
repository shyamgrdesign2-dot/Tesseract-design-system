import React from 'react';

/**
 * Design System → Foundations. Every swatch reads a real token (CSS variable)
 * from tp-tokens.css / tp-typography.css, so this page IS the source of truth as
 * rendered. Colours, type scale, radius, shadow, spacing and gradients.
 */
const meta = {
  title: 'Design System/Foundations',
  parameters: { layout: 'fullscreen', options: { showPanel: false } },
};
export default meta;

const wrap = { fontFamily: 'Inter, sans-serif', color: '#171725', padding: 24 };
const H = ({ children }) => <h2 style={{ font: '700 20px/28px Mulish, sans-serif', margin: '28px 0 12px' }}>{children}</h2>;
const Sub = ({ children }) => <p style={{ font: '400 13px/18px Inter, sans-serif', color: '#717179', margin: '0 0 16px' }}>{children}</p>;

// ── Colours ──
const RAMPS = {
  'Primary (blue)': 'blue',
  'Secondary (violet)': 'violet',
  'Tertiary (amber)': 'amber',
  Slate: 'slate',
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
};
const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const SLATE_STEPS = ['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

function Ramp({ name, prefix }) {
  const steps = prefix === 'slate' ? SLATE_STEPS : STEPS;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ font: '600 12px/16px Inter', color: '#545460', marginBottom: 6 }}>{name}</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {steps.map((s) => {
          const v = `--tp-${prefix}-${s}`;
          return (
            <div key={s} style={{ width: 88 }}>
              <div style={{ height: 44, borderRadius: 8, background: `var(${v})`, border: '1px solid rgba(0,0,0,0.06)' }} />
              <div style={{ font: '500 11px/14px Inter', marginTop: 4 }}>{prefix}-{s}</div>
              <div style={{ font: '400 10px/12px ui-monospace, monospace', color: '#717179', textTransform: 'uppercase' }}>
                <Hex varName={v} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function Hex({ varName }) {
  const ref = React.useRef(null);
  const [hex, setHex] = React.useState('');
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    setHex(getComputedStyle(el).backgroundColor);
  }, []);
  return <><span ref={ref} style={{ background: `var(${varName})`, display: 'none' }} />{hex}</>;
}

export const Colors = {
  render: () => (
    <div style={wrap}>
      <H>Colour</H>
      <Sub>10-step ramps. Use via <code>var(--tp-&lt;ramp&gt;-&lt;step&gt;)</code> — e.g. <code>var(--tp-blue-500)</code>.</Sub>
      {Object.entries(RAMPS).map(([name, prefix]) => <Ramp key={prefix} name={name} prefix={prefix} />)}
    </div>
  ),
};

// ── Typography ──
const TYPE = [
  'display-xl', 'display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'body-xl', 'body-lg', 'body-base', 'body-sm', 'body-xs',
  'label-lg', 'label-md', 'label-sm', 'caption-lg', 'caption', 'caption-sm', 'micro',
  'overline', 'overline-lg', 'link', 'link-sm', 'code',
];
export const Typography = {
  render: () => (
    <div style={wrap}>
      <H>Typography</H>
      <Sub>Headings use Mulish; body / UI use Inter. Apply as a class — e.g. <code>&lt;p class="tp-body-base"&gt;</code>.</Sub>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TYPE.map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid #f1f1f5', paddingBottom: 12 }}>
            <code style={{ font: '500 12px/16px ui-monospace, monospace', color: '#717179', width: 110, flexShrink: 0 }}>.tp-{t}</code>
            <span className={`tp-${t}`}>The five boxing wizards jump</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ── Radius ──
const RADII = ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '42', '84', 'full'];
export const Radius = {
  render: () => (
    <div style={wrap}>
      <H>Corner radius</H>
      <Sub>Use via <code>var(--tp-radius-&lt;n&gt;)</code>. CTAs = 10, cards = 12, pills = full.</Sub>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {RADII.map((r) => (
          <div key={r} style={{ textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: 'var(--tp-blue-100)', border: '1.5px solid var(--tp-blue-500)', borderRadius: `var(--tp-radius-${r})` }} />
            <div style={{ font: '500 11px/14px Inter', marginTop: 6 }}>radius-{r}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ── Shadow ──
const SHADOWS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
export const Shadows = {
  render: () => (
    <div style={{ ...wrap, background: '#f8fafc' }}>
      <H>Elevation</H>
      <Sub>Use via <code>var(--tp-shadow-&lt;size&gt;)</code>. Plus focus rings: primary / error / neutral.</Sub>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        {SHADOWS.map((s) => (
          <div key={s} style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 80, background: '#fff', borderRadius: 12, boxShadow: `var(--tp-shadow-${s})` }} />
            <div style={{ font: '500 11px/14px Inter', marginTop: 10 }}>shadow-{s}</div>
          </div>
        ))}
        {['primary', 'error', 'neutral'].map((f) => (
          <div key={f} style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 80, background: '#fff', borderRadius: 12, boxShadow: `var(--tp-focus-${f})` }} />
            <div style={{ font: '500 11px/14px Inter', marginTop: 10 }}>focus-{f}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ── Spacing ──
const SPACE = ['1', '1-5', '2', '2-5', '3', '3-5', '4', '5', '6', '7', '8', '9', '10', '12', '16'];
export const Spacing = {
  render: () => (
    <div style={wrap}>
      <H>Spacing</H>
      <Sub>4pt base. Use via <code>var(--tp-space-&lt;n&gt;)</code>.</Sub>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SPACE.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <code style={{ font: '500 11px/14px ui-monospace, monospace', color: '#717179', width: 88 }}>space-{s}</code>
            <div style={{ height: 16, width: `var(--tp-space-${s})`, background: 'var(--tp-blue-500)', borderRadius: 3 }} />
          </div>
        ))}
      </div>
    </div>
  ),
};

// ── Gradients ──
const GRADS = ['primary-hero', 'primary-card', 'primary-subtle', 'secondary-hero', 'secondary-card', 'ai-hero', 'ai-card'];
export const Gradients = {
  render: () => (
    <div style={wrap}>
      <H>Gradients</H>
      <Sub>Brand depth + AI surface. Use via <code>var(--tp-gradient-&lt;name&gt;)</code>.</Sub>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {GRADS.map((g) => (
          <div key={g} style={{ textAlign: 'center' }}>
            <div style={{ width: 160, height: 90, borderRadius: 12, background: `var(--tp-gradient-${g})` }} />
            <div style={{ font: '500 11px/14px Inter', marginTop: 8 }}>{g}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};
