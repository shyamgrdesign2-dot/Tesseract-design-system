import { Avatar } from './Avatar';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Always-circular profile mark with three content types — image, initials, or icon. Optional gradient ring. Used by the Header and anywhere a user avatar is needed.' } },
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['initials', 'image', 'icon'], description: 'Which content to show' },
    name: { control: 'text', description: 'Initials source + alt' },
    src: { control: 'text', description: 'Image URL (type = image)' },
    iconName: { control: 'text', tpIcon: true, description: 'Icon (type = icon)' },
    size: { control: { type: 'range', min: 20, max: 96, step: 2 } },
    ring: { control: 'boolean' },
  },
  args: { type: 'initials', name: 'Ramesh Kumar', src: 'https://i.pravatar.cc/100?img=12', iconName: 'profile', size: 48, ring: true },
};

export default meta;

// Route the `type` control to the right Avatar prop.
const fromArgs = ({ type, name, src, iconName, size, ring }) => ({
  size,
  ring,
  name,
  src: type === 'image' ? src : undefined,
  icon: type === 'icon' ? iconName : undefined,
});

export const Playground = {
  render: (args) => <Avatar {...fromArgs(args)} />,
};

const Row = ({ children }) => <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>;

/** The three content types — image, initials, icon. */
export const Types = {
  render: () => (
    <Row>
      <Avatar src="https://i.pravatar.cc/100?img=12" name="Ramesh Kumar" size={48} ring />
      <Avatar name="Ramesh Kumar" size={48} ring />
      <Avatar icon="profile" size={48} ring />
      <Avatar name="Sheela" size={48} />
      <Avatar icon="hospital" size={48} />
    </Row>
  ),
};
