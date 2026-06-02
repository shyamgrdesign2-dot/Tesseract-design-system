import { TPIcon, TP_ICON_NAMES, TP_ICON_VARIANTS } from './TPIcon';

const meta = {
  title: 'Atoms/TPIcon',
  component: TPIcon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'select', options: TP_ICON_NAMES },
    variant: { control: 'inline-radio', options: TP_ICON_VARIANTS },
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
    color: { control: 'color' },
  },
  args: { name: 'search', variant: 'linear', size: 24 },
};

export default meta;

export const Playground = {};

/** Every vendored icon × the 6 styles. */
export const Gallery = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(6, 1fr)', gap: 8, alignItems: 'center', position: 'sticky', top: 0, background: '#fff', paddingBottom: 6, borderBottom: '1px solid #E2E2EA' }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#54545C' }}>Name</span>
        {TP_ICON_VARIANTS.map((v) => (
          <span key={v} style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#54545C', textAlign: 'center' }}>{v}</span>
        ))}
      </div>
      {TP_ICON_NAMES.map((name) => (
        <div key={name} style={{ display: 'grid', gridTemplateColumns: '140px repeat(6, 1fr)', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F1F5' }}>
          <span style={{ fontSize: 13, color: '#171725' }}>{name}</span>
          {TP_ICON_VARIANTS.map((v) => (
            <span key={v} style={{ display: 'inline-flex', justifyContent: 'center', color: '#171725' }}>
              <TPIcon name={name} variant={v} size={24} />
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** The same icon in all six styles, large. */
export const SixStyles = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center', color: 'var(--tp-blue-600, #3c3bb5)' }}>
      {TP_ICON_VARIANTS.map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <TPIcon name={args.name} variant={v} size={40} />
          <span style={{ fontSize: 11, color: '#54545C' }}>{v}</span>
        </div>
      ))}
    </div>
  ),
  args: { name: 'health' },
};
