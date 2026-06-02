import { ShinyText } from './index.js';

const meta = {
  title: 'Atoms/ShinyText',
  component: ShinyText,
  tags: ['autodocs', 'ai-generated'],
  // Scope a strict color matcher here so the polymorphic `shineColor`
  // (string OR array of gradient stops) isn't auto-assigned the string-only
  // color picker. Only an exact `color` arg gets the swatch.
  parameters: { controls: { matchers: { color: /^(background|color)$/i } } },
  argTypes: {
    text: { control: 'text' },
    disabled: { control: 'boolean' },
    speed: { control: { type: 'range', min: 0.5, max: 8, step: 0.5 } },
    color: { control: 'color' },
    // Polymorphic: a single color string OR an array of gradient stops.
    // Use an object control so the string-only color picker never receives an array.
    shineColor: { control: 'object' },
    spread: { control: { type: 'range', min: 0, max: 360, step: 10 } },
    yoyo: { control: 'boolean' },
    pauseOnHover: { control: 'boolean' },
    direction: { control: 'inline-radio', options: ['left', 'right'] },
    delay: { control: 'number' },
  },
  args: {
    text: 'Shimmering text',
    disabled: false,
    speed: 2,
    color: '#b5b5b5',
    shineColor: '#ffffff',
    spread: 120,
    yoyo: false,
    pauseOnHover: false,
    direction: 'left',
    delay: 0,
  },
};

export default meta;

const Stage = ({ children }) => (
  <div
    style={{
      fontSize: 28,
      fontWeight: 700,
      fontFamily: 'Inter, sans-serif',
      padding: 24,
      background: 'var(--tp-blue-900, #161558)',
      borderRadius: 12,
      display: 'inline-block',
    }}
  >
    {children}
  </div>
);

export const Playground = {
  render: (args) => (
    <Stage>
      <ShinyText {...args} />
    </Stage>
  ),
};

export const Speeds = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {[1, 2, 4].map((speed) => (
        <Stage key={speed}>
          <ShinyText {...args} speed={speed} text={`Speed ${speed}`} />
        </Stage>
      ))}
    </div>
  ),
};

export const Directions = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Stage>
        <ShinyText {...args} direction="left" text="Direction left" />
      </Stage>
      <Stage>
        <ShinyText {...args} direction="right" text="Direction right" />
      </Stage>
    </div>
  ),
};

export const Yoyo = {
  args: { yoyo: true, text: 'Yoyo sweep' },
  render: (args) => (
    <Stage>
      <ShinyText {...args} />
    </Stage>
  ),
};

export const MultiColorShine = {
  args: { shineColor: ['#D565EA', '#673AAC', '#1A1994'], color: '#888', text: 'AI gradient' },
  render: (args) => (
    <Stage>
      <ShinyText {...args} />
    </Stage>
  ),
};

export const PauseOnHover = {
  args: { pauseOnHover: true, text: 'Hover to pause' },
  render: (args) => (
    <Stage>
      <ShinyText {...args} />
    </Stage>
  ),
};

export const Disabled = {
  args: { disabled: true, text: 'Animation disabled' },
  render: (args) => (
    <Stage>
      <ShinyText {...args} />
    </Stage>
  ),
};
