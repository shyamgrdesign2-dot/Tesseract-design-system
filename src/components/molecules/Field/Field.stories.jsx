import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from './Field';
import { InputBox } from '@/src/components/atoms/Input/InputBox';
import { Checkbox } from '@/src/components/atoms/Checkbox';

const meta = {
  title: 'Molecules/Field',
  component: Field,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout of label vs. control — `vertical` stacks them, `horizontal` places the label beside the control (e.g. a settings toggle/checkbox row).',
    },
    invalid: {
      control: 'boolean',
      description: 'Marks the field invalid — sets `data-invalid`, wires `aria-invalid`/`aria-describedby` onto the control, and reveals the FieldError message.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field required — renders the `*` marker on FieldLabel and sets `aria-required` on the control.',
    },
    // Story-helper args (not Field root props) that drive the Playground render():
    label: { control: 'text', description: '(Story helper) FieldLabel text.' },
    placeholder: { control: 'text', description: '(Story helper) InputBox placeholder.' },
    description: { control: 'text', description: '(Story helper) FieldDescription text (hidden when empty).' },
    error: { control: 'text', description: '(Story helper) FieldError message (shown only when `invalid`).' },
  },
  args: {
    orientation: 'vertical',
    invalid: false,
    required: true,
    label: 'Email address',
    placeholder: 'you@example.com',
    description: 'We’ll never share it.',
    error: 'Enter a valid email address.',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A form-field grammar — link a label, control, description, and error to ANY control with consistent layout + accessibility, so each control doesn’t re-implement label/help/error wiring.',
          '',
          '**When to use** — wrap a control (InputBox, Checkbox, Radio, Toggle, Slider, Dropdown, DateRangePicker) in dense, validation-heavy forms.',
          '',
          '**Key parts** — `Field` (root — `invalid`, `required`, `orientation` vertical/horizontal) · `FieldLabel` · `FieldControl` (auto-wires `id` + `aria-describedby` + `aria-invalid` onto the control via Slot) · `FieldDescription` · `FieldError` (role="alert", renders only when given a message).',
          '',
          '**Good to know** — ids are generated with `useId`; the label’s `htmlFor`, the control’s `id`, and the description/error `aria-describedby` are all linked automatically.',
        ].join('\n'),
      },
    },
  },
};
export default meta;

export const Playground = {
  render: ({ orientation, invalid, required, label, placeholder, description, error }) => (
    <Field orientation={orientation} invalid={invalid} required={required} style={{ maxWidth: 360 }}>
      <FieldLabel>{label}</FieldLabel>
      <FieldControl><InputBox placeholder={placeholder} status={invalid ? 'error' : undefined} fullWidth /></FieldControl>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {invalid ? <FieldError>{error}</FieldError> : null}
    </Field>
  ),
};

/** Invalid state — FieldError shows and the control gets aria-invalid + describedby. */
export const Invalid = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field invalid required style={{ maxWidth: 360 }}>
      <FieldLabel>Email address</FieldLabel>
      <FieldControl><InputBox status="error" defaultValue="invalid@@email" fullWidth /></FieldControl>
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
};

/** Horizontal — label beside the control (e.g. a settings toggle/checkbox row). */
export const Horizontal = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" style={{ maxWidth: 420 }}>
      <FieldControl><Checkbox /></FieldControl>
      <FieldLabel>Send appointment reminders</FieldLabel>
      <FieldDescription>An SMS goes out 24h before each visit.</FieldDescription>
    </Field>
  ),
};
