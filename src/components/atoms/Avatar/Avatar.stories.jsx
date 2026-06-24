import { Avatar } from './Avatar';
import { TPIcon } from '@/src/components/atoms/icons/tp/TPIcon';

const ICON_VARIANTS = ['linear', 'bulk', 'bold', 'broken', 'twotone', 'outline'];
const SHAPES = ['circle', 'rounded', 'square'];
const COLORS = ['slate', 'primary', 'success', 'warning', 'error', 'violet'];
const STATUSES = ['none', 'online', 'offline', 'away', 'busy'];

// Resolve an icon node for the avatar's single icon slot, in the chosen style + family.
const glyphFor = (name, size, variant = 'linear', family) =>
  name ? <TPIcon name={name} variant={variant} family={family || undefined} size={size} /> : undefined;

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Profile mark. Content is one of **image · initials · icon**; deeply configurable via **shape**, **radius**, **color**, **status dot**, and an optional brand **ring**. Used by the Header and anywhere a user avatar is needed.' } },
  },
  argTypes: {
    content: { control: 'inline-radio', options: ['image', 'initials', 'icon'], description: 'What the avatar shows', table: { category: 'Content' } },
    name: { control: 'text', description: 'Initials source + alt text', table: { category: 'Content' } },
    src: { control: 'text', description: 'Image URL (content = image)', table: { category: 'Content' } },
    size: { control: { type: 'range', min: 20, max: 96, step: 2 }, table: { category: 'Appearance' } },
    // ── Appearance ──
    shape: { control: 'inline-radio', options: SHAPES, description: 'Corner shape — circle · rounded · square', table: { category: 'Appearance' } },
    radius: { control: 'text', name: 'corner radius', description: "px number, or 'pill' / 'sharp'", table: { category: 'Appearance' } },
    color: { control: 'select', options: COLORS, description: 'Background (—100) + initials/icon (—600) ramp', table: { category: 'Appearance' } },
    status: { control: 'inline-radio', options: STATUSES, description: 'Corner status dot', table: { category: 'Appearance' } },
    ring: { control: 'boolean', description: 'Brand gradient ring', table: { category: 'Appearance' } },
    // ── Icons ──
    iconName: { control: 'text', tpIcon: true, name: 'icon', description: 'CDN icon name (content = icon; blank = none)', table: { category: 'Icons' } },
    iconVariant: { control: 'select', options: ICON_VARIANTS, name: 'icon style', description: 'Icon style for the icon slot', table: { category: 'Icons' } },
    iconFamily: { control: 'text', name: 'icon family', description: 'Override the auto-resolved CDN family (blank = auto)', table: { category: 'Icons' } },
  },
  args: {
    content: 'image',
    name: 'Ramesh Kumar',
    src: 'https://i.pravatar.cc/100?img=12',
    size: 48,
    shape: 'circle',
    radius: '',
    color: 'slate',
    status: 'none',
    ring: true,
    iconName: 'profile',
    iconVariant: 'linear',
    iconFamily: '',
  },
};

export default meta;

// A radius control comes in as a string. Coerce a pure-number string to a number;
// pass keywords ("pill"/"sharp") / tokens through; blank → undefined (use shape).
const radiusValue = (r) => {
  const s = String(r ?? '').trim();
  if (!s) return undefined;
  return /^-?\d+$/.test(s) ? Number(s) : s;
};

// Map the `content` control to the matching Avatar prop (icon → image → initials).
// The icon fallback is half the avatar diameter, in the chosen style + family.
const fromArgs = ({ content, name, src, size, shape, radius, color, status, ring, iconName, iconVariant, iconFamily }) => ({
  size, shape, color, ring, name,
  radius: radiusValue(radius),
  status: status && status !== 'none' ? status : undefined,
  src: content === 'image' ? src : undefined,
  icon: content === 'icon' ? glyphFor(iconName, Math.round(size * 0.5), iconVariant, iconFamily) : undefined,
});

// Build an accurate, copy-paste code snippet from the controls (what "Show code" shows).
const iconJsx = (name, variant, family, size) =>
  `<TPIcon name="${name}"${variant && variant !== 'linear' ? ` variant="${variant}"` : ''}${family ? ` family="${family}"` : ''} size={${size}} />`;

const avatarCode = ({ content, name = '', src = '', size = 48, shape = 'circle', radius, color = 'slate', status = 'none', ring, iconName, iconVariant, iconFamily }) => {
  const lines = [`  size={${size}}`];
  if (shape && shape !== 'circle') lines.push(`  shape="${shape}"`);
  const rv = radiusValue(radius);
  if (rv != null) lines.push(typeof rv === 'number' ? `  radius={${rv}}` : `  radius="${rv}"`);
  if (color && color !== 'slate') lines.push(`  color="${color}"`);
  if (status && status !== 'none') lines.push(`  status="${status}"`);
  if (ring) lines.push('  ring');
  if (content === 'image') {
    lines.push(`  src="${src}"`, `  name="${name}"`);
  } else if (content === 'icon' && iconName) {
    lines.push(`  icon={${iconJsx(iconName, iconVariant, iconFamily, Math.round(size * 0.5))}}`);
  } else {
    lines.push(`  name="${name}"`);
  }
  return `<Avatar\n${lines.join('\n')}\n/>`;
};

export const Playground = {
  render: (args) => <Avatar {...fromArgs(args)} />,
  parameters: { docs: { source: { transform: (_code, ctx) => avatarCode(ctx.args) } } },
};

const Row = ({ children }) => <div style={{ display: 'flex', gap: 'var(--tesseract-space-4)', alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>;
const Label = ({ children }) => <div style={{ fontSize: 'var(--tesseract-text-caption-sm)', fontWeight: 'var(--tesseract-weight-semibold)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--tesseract-slate-500,#717179)', marginBottom: 'var(--tesseract-space-2-5)', fontFamily: 'var(--tesseract-font-body)' }}>{children}</div>;

/** The three content forms — image, initials, icon. */
export const Content = {
  render: () => (
    <Row>
      <Avatar src="https://i.pravatar.cc/100?img=12" name="Ramesh Kumar" size={48} />
      <Avatar name="Ramesh Kumar" size={48} />
      <Avatar icon="profile" size={48} />
    </Row>
  ),
};

/** Corner shapes — circle (default) · rounded · square. */
export const Shapes = {
  render: () => (
    <Row>
      {SHAPES.map((shape) => (
        <Avatar key={shape} shape={shape} name="Ramesh Kumar" size={48} />
      ))}
    </Row>
  ),
};

/** Background + foreground colour ramps (—100 background, —600 initials/icon). */
export const Colors = {
  render: () => (
    <Row>
      {COLORS.map((color) => (
        <Avatar key={color} color={color} name="Ramesh Kumar" size={48} />
      ))}
    </Row>
  ),
};

/** Status dot — online · offline · away · busy, with a white ring. */
export const Status = {
  render: () => (
    <Row>
      {['online', 'offline', 'away', 'busy'].map((status) => (
        <Avatar key={status} status={status} src="https://i.pravatar.cc/100?img=12" name="Ramesh Kumar" size={56} />
      ))}
    </Row>
  ),
};

/** The brand ring — with vs without (shown for each content form). */
export const Ring = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tesseract-space-5)' }}>
      <div>
        <Label>With ring</Label>
        <Row>
          <Avatar src="https://i.pravatar.cc/100?img=12" name="Ramesh Kumar" size={48} ring />
          <Avatar name="Ramesh Kumar" size={48} ring />
          <Avatar icon="profile" size={48} ring />
        </Row>
      </div>
      <div>
        <Label>Without ring</Label>
        <Row>
          <Avatar src="https://i.pravatar.cc/100?img=12" name="Ramesh Kumar" size={48} />
          <Avatar name="Ramesh Kumar" size={48} />
          <Avatar icon="profile" size={48} />
        </Row>
      </div>
    </div>
  ),
};

/** Sizes. */
export const Sizes = {
  render: () => (
    <Row>
      {[24, 32, 40, 48, 64, 80].map((s) => <Avatar key={s} name="Ramesh Kumar" size={s} ring />)}
    </Row>
  ),
};
