import { Avatar } from './Avatar';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Profile image with an initial fallback and an optional gradient ring. Used by the Header (and anywhere a user avatar is needed).' } },
  },
  argTypes: {
    name: { control: 'text' },
    src: { control: 'text' },
    size: { control: { type: 'range', min: 20, max: 96, step: 2 } },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    ring: { control: 'boolean' },
  },
  args: { name: 'Dr. Sheela', src: '', size: 40, shape: 'circle', ring: true },
};

export default meta;

export const Playground = {};

const Row = ({ children }) => <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>;

export const Fallbacks = {
  render: () => (
    <Row>
      <Avatar name="Ramesh Kumar" />
      <Avatar name="Sheela BR" ring />
      <Avatar name="A" shape="square" />
      <Avatar name="Dr Mehta" size={56} ring />
    </Row>
  ),
};
