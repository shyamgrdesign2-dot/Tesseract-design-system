import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from './Field';
import { InputBox } from '@/src/components/atoms/Input/InputBox';
import { Checkbox } from '@/src/components/atoms/Checkbox';

const meta = {
  title: 'Molecules/Field',
  component: Field,
  tags: ['autodocs'],
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
  render: () => (
    <Field required style={{ maxWidth: 360 }}>
      <FieldLabel>Email address</FieldLabel>
      <FieldControl><InputBox placeholder="you@example.com" fullWidth /></FieldControl>
      <FieldDescription>We’ll never share it.</FieldDescription>
    </Field>
  ),
};

/** Invalid state — FieldError shows and the control gets aria-invalid + describedby. */
export const Invalid = {
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
  render: () => (
    <Field orientation="horizontal" style={{ maxWidth: 420 }}>
      <FieldControl><Checkbox /></FieldControl>
      <FieldLabel>Send appointment reminders</FieldLabel>
      <FieldDescription>An SMS goes out 24h before each visit.</FieldDescription>
    </Field>
  ),
};
