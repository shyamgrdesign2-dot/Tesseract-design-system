import { Timeline, TimelineItem } from './Timeline';
import { Button } from '../../atoms/Button/Button';
import { TPLibraryIcon } from '../../atoms/icons/tp/TPLibraryIcon';

const meta = {
  title: 'Molecules/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A vertical event timeline — visit history, audit logs, plan progress. Each item has a connector line + node dot and a card with a title, date pill, right-aligned action, and any body content.',
          '',
          '**When to use** — chronological entries inside a SectionCard (e.g. a treatment plan service’s visit timeline).',
          '',
          '**Key props** — Timeline: `tone` (violet · primary · success · neutral). TimelineItem: `title`, `date`, `action`, `muted` (hollow node for skipped entries), `tone` override.',
        ].join('\n'),
      },
    },
  },
  argTypes: { tone: { control: 'inline-radio', options: ['violet', 'primary', 'success', 'neutral'] } },
  args: { tone: 'violet' },
};
export default meta;

const ViewRx = () => (
  <Button variant="tonal" theme="neutral" size="sm" leftIcon={<TPLibraryIcon name="document-text" variant="linear" size={14} />}>View Rx</Button>
);

export const Playground = {
  render: (a) => (
    <Timeline {...a}>
      <TimelineItem title="Dr. Sheela B R" date="10 Apr 2026" action={<ViewRx />}>
        <strong>Clinical Notes:</strong> Canal shaping + obturation completed
      </TimelineItem>
      <TimelineItem title="Dr. Sheela B R" date="3 Apr 2026" action={<ViewRx />}>
        <strong>Clinical Notes:</strong> Initial debridement, access opening, BMP placed
      </TimelineItem>
      <TimelineItem title="Dr. Riya Kapoor" date="1 Apr 2026, 2:00 PM" muted>
        <strong>Clinical Notes:</strong> Patient rescheduled — no treatment performed.
      </TimelineItem>
    </Timeline>
  ),
};

/** Tones. */
export const Tones = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
      {['violet', 'primary', 'success', 'neutral'].map((t) => (
        <Timeline key={t} tone={t}>
          <TimelineItem title="Step one" date="Day 1">Created the record.</TimelineItem>
          <TimelineItem title="Step two" date="Day 3">Reviewed and approved.</TimelineItem>
        </Timeline>
      ))}
    </div>
  ),
};
