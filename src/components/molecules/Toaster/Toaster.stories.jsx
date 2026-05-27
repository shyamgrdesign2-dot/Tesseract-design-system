import { Toaster, toast } from './Toaster';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/Toaster',
  component: Toaster,
  tags: ['autodocs', 'ai-generated'],
};

export default meta;

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{children}</div>
);

export const Playground = {
  render: () => (
    <div>
      <Row>
        <Button onClick={() => toast('Microphone switched to iPhone')}>
          Show toast
        </Button>
      </Row>
      <Toaster />
    </div>
  ),
};

export const Tones = {
  render: () => (
    <div>
      <Row>
        <Button variant="outline" onClick={() => toast.success('Saved')}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error("Couldn't copy")}>
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning('Storage almost full')}
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info('A new version is available')}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.message('Plain message')}
        >
          Default
        </Button>
      </Row>
      <Toaster />
    </div>
  ),
};

export const Stacked = {
  render: () => (
    <div>
      <Row>
        <Button
          onClick={() => {
            toast.success('First toast');
            toast.info('Second toast');
            toast.warning('Third toast');
          }}
        >
          Show three toasts
        </Button>
      </Row>
      <Toaster />
    </div>
  ),
};

export const Persistent = {
  render: () => (
    <div>
      <Row>
        <Button
          onClick={() => toast.message('Dismiss me manually', { duration: 0 })}
        >
          Show persistent toast
        </Button>
      </Row>
      <Toaster />
    </div>
  ),
};

const Grid2 = ({ children }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      maxWidth: 480,
    }}
  >
    {children}
  </div>
);

export const HealthcareToasts = {
  name: '🏥 Healthcare Toasts',
  render: () => (
    <div>
      <Grid2>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.success('Prescription saved — Amlodipine 5mg × 30 days')
          }
        >
          Rx saved
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.success('Appointment confirmed — Dr. Mehta, 10:30 AM')
          }
        >
          Appt confirmed
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.error('Upload failed — scan-029.dcm exceeds 10 MB')
          }
        >
          Upload error
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.warning('Session expiring in 5 minutes')}
        >
          Session warning
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.info('Pre-authorisation submitted to Cigna Health')
          }
        >
          Pre-auth info
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.message('Patient record updated')}
        >
          Record updated
        </Button>
      </Grid2>
      <Toaster />
    </div>
  ),
};

export const WithDescription = {
  render: () => (
    <div>
      <Row>
        <Button
          variant="outline"
          onClick={() =>
            toast.success('Rx saved', {
              description:
                'Amlodipine 5mg sent to Apollo Pharmacy, Banjara Hills.',
            })
          }
        >
          Success with description
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('Lab report upload failed', {
              description:
                'File blood-panel-2024.pdf could not be processed. Please retry or contact support.',
            })
          }
        >
          Error with description
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning('Insurance authorisation pending', {
              description:
                'Cigna Health has not yet responded. Procedure may be delayed.',
            })
          }
        >
          Warning with description
        </Button>
      </Row>
      <Toaster />
    </div>
  ),
};

export const ToastWithAction = {
  render: () => (
    <div>
      <Row>
        <Button
          variant="outline"
          onClick={() =>
            toast('Appointment cancelled', {
              action: {
                label: 'Undo',
                onClick: () => {},
              },
            })
          }
        >
          Cancel appointment (with Undo)
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('Record deleted', {
              action: {
                label: 'Restore',
                onClick: () => {},
              },
            })
          }
        >
          Delete record (with Restore)
        </Button>
      </Row>
      <Toaster />
    </div>
  ),
};

export const PositionVariants = {
  name: '↕ Position Variants',
  render: () => (
    <div>
      <Row>
        <Button
          variant="outline"
          onClick={() => toast.success('Top-left toast')}
        >
          Top-left
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success('Top-center toast')}
        >
          Top-center
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success('Bottom-right toast')}
        >
          Bottom-right
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success('Bottom-center toast')}
        >
          Bottom-center
        </Button>
      </Row>
      <p
        style={{
          marginTop: 12,
          fontSize: 13,
          color: '#6b7280',
          fontStyle: 'italic',
        }}
      >
        Change <code>position</code> prop on <code>&lt;Toaster /&gt;</code> —
        default is <code>bottom-right</code>.
      </p>
      <Toaster />
    </div>
  ),
};
