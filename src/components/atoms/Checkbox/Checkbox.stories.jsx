import React from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    state: { control: 'inline-radio', options: ['unchecked', 'checked', 'indeterminate'], description: 'Tri-state value (indeterminate is reachable here, not just via boolean)' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    state: 'unchecked',
    size: 'md',
    disabled: false,
    required: false,
  },
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Sizes = {
  render: () => (
    <Row>
      {['sm', 'md', 'lg'].map((size) => (
        <Checkbox key={size} size={size} defaultChecked />
      ))}
    </Row>
  ),
};

const Label = ({ children, ...props }) => (
  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--tesseract-slate-700)' }} {...props}>
    {children}
  </label>
);

// Keyed by `state` so changing the control re-initialises the local value
// (no set-state-in-effect needed).
function CheckboxDemo({ state, ...args }) {
  const initial = state === 'checked' ? true : state === 'indeterminate' ? 'indeterminate' : false;
  const [checked, setChecked] = React.useState(initial);
  return <Checkbox {...args} checked={checked} onCheckedChange={setChecked} />;
}

export const Playground = {
  render: (args) => <CheckboxDemo key={args.state} {...args} />,
};

export const Uncontrolled = {
  render: () => <Checkbox defaultChecked />,
};

export const States = {
  render: () => (
    <Row>
      <Checkbox aria-label="unchecked" />
      <Checkbox defaultChecked aria-label="checked" />
      <Checkbox checked="indeterminate" aria-label="indeterminate" readOnly />
    </Row>
  ),
};

export const Disabled = {
  render: () => (
    <Row>
      <Checkbox disabled aria-label="disabled unchecked" />
      <Checkbox disabled defaultChecked aria-label="disabled checked" />
    </Row>
  ),
};

export const WithLabel = {
  render: () => {
    const [checked, setChecked] = React.useState(true);
    const id = React.useId();
    return (
      <Label htmlFor={id}>
        <Checkbox id={id} checked={checked} onCheckedChange={setChecked} />
        Accept terms and conditions
      </Label>
    );
  },
};

const SYMPTOMS = ['Fever', 'Cough', 'Shortness of breath', 'Chest pain', 'Fatigue'];

export const CheckboxList = {
  render: () => {
    const [checked, setChecked] = React.useState(new Set());
    const toggle = (symptom) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(symptom)) next.delete(symptom);
        else next.add(symptom);
        return next;
      });
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#171725', marginBottom: 4 }}>Select symptoms</div>
        {SYMPTOMS.map((symptom) => {
          const id = `symptom-${symptom}`;
          return (
            <Label key={symptom} htmlFor={id}>
              <Checkbox
                id={id}
                checked={checked.has(symptom)}
                onCheckedChange={() => toggle(symptom)}
              />
              {symptom}
            </Label>
          );
        })}
        <div style={{ fontSize: 13, color: '#54545C', marginTop: 8 }}>
          {checked.size} selected
        </div>
      </div>
    );
  },
};

const CONSENT_ITEMS = [
  'I consent to data sharing with treating physicians',
  'I accept the terms and conditions',
  'I confirm that I am 18 years or older',
];

export const ConsentForm = {
  render: () => {
    const [agreed, setAgreed] = React.useState({});
    const allChecked = CONSENT_ITEMS.every((item) => agreed[item]);
    const toggle = (item) => setAgreed((prev) => ({ ...prev, [item]: !prev[item] }));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#171725', marginBottom: 4 }}>Patient Consent</div>
        {CONSENT_ITEMS.map((item) => {
          const id = `consent-${item}`;
          return (
            <Label key={item} htmlFor={id}>
              <Checkbox id={id} checked={!!agreed[item]} onCheckedChange={() => toggle(item)} />
              {item}
            </Label>
          );
        })}
        <button
          disabled={!allChecked}
          style={{
            marginTop: 8,
            padding: '8px 20px',
            borderRadius: 6,
            border: 'none',
            background: allChecked ? '#4B4AD5' : '#E2E2EA',
            color: allChecked ? '#fff' : '#54545C',
            fontWeight: 600,
            fontSize: 14,
            cursor: allChecked ? 'pointer' : 'not-allowed',
            fontFamily: 'Inter, sans-serif',
            transition: 'background 0.2s',
          }}
        >
          Proceed
        </button>
      </div>
    );
  },
};

const SUB_ITEMS = ['Cardiology', 'Neurology', 'Orthopedics', 'Gynecology'];

export const IndeterminateGroup = {
  render: () => {
    const [checked, setChecked] = React.useState(new Set());
    const allChecked = checked.size === SUB_ITEMS.length;
    const someChecked = checked.size > 0 && !allChecked;
    const toggleAll = () => {
      if (allChecked) setChecked(new Set());
      else setChecked(new Set(SUB_ITEMS));
    };
    const toggle = (item) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(item)) next.delete(item);
        else next.add(item);
        return next;
      });
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'Inter, sans-serif' }}>
        <Label htmlFor="select-all">
          <Checkbox
            id="select-all"
            checked={allChecked ? true : someChecked ? 'indeterminate' : false}
            onCheckedChange={toggleAll}
          />
          <span style={{ fontWeight: 600 }}>Select all departments</span>
        </Label>
        <div style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SUB_ITEMS.map((item) => {
            const id = `sub-${item}`;
            return (
              <Label key={item} htmlFor={id}>
                <Checkbox id={id} checked={checked.has(item)} onCheckedChange={() => toggle(item)} />
                {item}
              </Label>
            );
          })}
        </div>
      </div>
    );
  },
};
