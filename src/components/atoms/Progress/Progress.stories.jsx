import React from 'react';
import { Progress } from './Progress';

const COLORS = ['primary', 'success', 'warning', 'error'];

const meta = {
  title: 'Atoms/Progress',
  component: Progress,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    variant: { control: 'inline-radio', options: ['determinate', 'indeterminate'] },
    color: { control: 'select', options: COLORS },
    height: { control: 'number' },
  },
  args: {
    value: 60,
    max: 100,
    variant: 'determinate',
    color: 'primary',
    height: 4,
  },
};

export default meta;

const Stack = ({ children }) => (
  <div style={{ width: 320, display: 'grid', gap: 16 }}>{children}</div>
);

export const Playground = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Progress {...args} />
    </div>
  ),
};

export const Values = {
  render: (args) => (
    <Stack>
      {[0, 25, 50, 75, 100].map((value) => (
        <Progress key={value} {...args} value={value} />
      ))}
    </Stack>
  ),
};

export const Colors = {
  render: (args) => (
    <Stack>
      {COLORS.map((color) => (
        <Progress key={color} {...args} color={color} />
      ))}
    </Stack>
  ),
};

export const Heights = {
  render: (args) => (
    <Stack>
      {[2, 4, 8, 12].map((height) => (
        <Progress key={height} {...args} height={height} />
      ))}
    </Stack>
  ),
};

export const Indeterminate = {
  args: { variant: 'indeterminate' },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Progress {...args} />
    </div>
  ),
};

// ── Healthcare in-context scenarios ──────────────────────────────────────────

/** Upload progress for a DICOM scan or lab report PDF. */
export const UploadProgress = {
  name: '⬆️ Document Upload',
  render: (args) => {
    const [progress, setProgress] = React.useState(0);
    const [uploading, setUploading] = React.useState(false);
    const start = () => {
      setProgress(0);
      setUploading(true);
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(interval); setUploading(false); return 100; }
          return p + Math.floor(Math.random() * 12) + 3;
        });
      }, 200);
    };
    return (
      <div style={{ width: 340, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#454551' }}>scan-029.dcm</span>
          <span style={{ fontSize: 12, color: '#54545C' }}>{progress}%</span>
        </div>
        <Progress {...args} value={Math.min(progress, 100)} color={progress >= 100 ? 'success' : 'primary'} height={6} />
        <div style={{ marginTop: 12 }}>
          <button
            onClick={start}
            disabled={uploading}
            style={{ padding: '7px 18px', borderRadius: 6, border: 'none', background: uploading ? '#E2E2EA' : '#4B4AD5', color: uploading ? '#54545C' : '#fff', fontWeight: 600, fontSize: 13, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            {progress >= 100 ? 'Upload again' : uploading ? 'Uploading…' : 'Start upload'}
          </button>
        </div>
      </div>
    );
  },
};

/** Profile completion prompt — how complete is the patient record. */
export const ProfileCompletion = {
  name: '👤 Profile Completion',
  render: (args) => {
    const fields = [
      { label: 'Personal details', value: 100, color: 'success' },
      { label: 'Medical history', value: 60, color: 'warning' },
      { label: 'Insurance info', value: 20, color: 'error' },
      { label: 'Emergency contacts', value: 0, color: 'error' },
    ];
    const overall = Math.round(fields.reduce((s, f) => s + f.value, 0) / fields.length);
    return (
      <div style={{ width: 320, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#171725' }}>Patient record completeness</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#4B4AD5' }}>{overall}%</span>
        </div>
        <Progress {...args} value={overall} color={overall >= 80 ? 'success' : overall >= 50 ? 'warning' : 'error'} height={8} />
        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          {fields.map((f) => (
            <div key={f.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#454551' }}>{f.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: f.value === 100 ? '#15803D' : f.value >= 50 ? '#92400E' : '#9F1239' }}>{f.value}%</span>
              </div>
              <Progress {...args} value={f.value} color={f.color} height={4} />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/** Storage usage bar with colour threshold feedback. */
export const StorageUsage = {
  name: '💾 Storage Usage',
  render: (args) => {
    const used = 8.4;
    const total = 10;
    const pct = Math.round((used / total) * 100);
    const color = pct >= 90 ? 'error' : pct >= 70 ? 'warning' : 'success';
    return (
      <div style={{ width: 320, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#454551' }}>Cloud storage</span>
          <span style={{ fontSize: 13, color: color === 'error' ? '#E11D48' : '#454551' }}>{used} GB / {total} GB</span>
        </div>
        <Progress {...args} value={pct} color={color} height={8} />
        {pct >= 80 && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#E11D48', fontWeight: 500 }}>
            ⚠ Storage {pct >= 90 ? 'critically' : 'almost'} full — consider archiving old records.
          </div>
        )}
      </div>
    );
  },
};
