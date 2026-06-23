import { Avatar } from './Avatar';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Always-circular profile mark. Content is one of **image · initials · icon**; an optional brand **ring** is the only variant. Used by the Header and anywhere a user avatar is needed.' } },
  },
  argTypes: {
    content: { control: 'inline-radio', options: ['image', 'initials', 'icon'], description: 'What the avatar shows' },
    name: { control: 'text', description: 'Initials source + alt text' },
    src: { control: 'text', description: 'Image URL (content = image)' },
    iconName: { control: 'text', tpIcon: true, description: 'Tesseract icon (content = icon)' },
    size: { control: { type: 'range', min: 20, max: 96, step: 2 } },
    ring: { control: 'boolean', description: 'Brand gradient ring' },
  },
  args: { content: 'image', name: 'Ramesh Kumar', src: 'https://i.pravatar.cc/100?img=12', iconName: 'profile', size: 48, ring: true },
};

export default meta;

// Map the `content` control to the matching Avatar prop (icon → image → initials).
const fromArgs = ({ content, name, src, iconName, size, ring }) => ({
  size, ring, name,
  src: content === 'image' ? src : undefined,
  icon: content === 'icon' ? iconName : undefined,
});

export const Playground = {
  render: (args) => <Avatar {...fromArgs(args)} />,
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

/** The only variant — with vs without the brand ring (shown for each content form). */
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
