import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './DropdownMenu';
import { Button } from '@/src/components/atoms';

const meta = {
  title: 'Molecules/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs', 'ai-generated'],
};

export default meta;

/** Click the trigger to toggle. ESC / click-outside close, arrow keys navigate. */
export const Playground = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Open by default so the menu surface is visible. */
export const Open = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ paddingBottom: 200 }}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};

/** A disabled item is skipped by keyboard navigation. */
export const WithDisabledItem = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ paddingBottom: 200 }}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Available</DropdownMenuItem>
            <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
            <DropdownMenuItem>Also available</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};

/** Aligned to the end edge of the trigger. */
export const AlignEnd = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 200 }}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>First</DropdownMenuItem>
            <DropdownMenuItem>Second</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};

// ─── Healthcare stories ────────────────────────────────────────────────────

import { MoreVertical, Pencil, Eye, Trash2, UploadCloud, ClipboardList } from '@/src/components/atoms/icons/lucide';

/** Three-dot kebab menu for a patient row — grouped with a danger zone. */
export const PatientKebabMenu = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ paddingBottom: 280 }}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Patient actions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 6,
                border: '1px solid #E2E2EA',
                background: 'transparent',
                cursor: 'pointer',
                color: '#717179',
              }}
            >
              <MoreVertical width={16} height={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Patient Info</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit patient</DropdownMenuItem>
            <DropdownMenuLabel>Appointments</DropdownMenuLabel>
            <DropdownMenuItem>Book appointment</DropdownMenuItem>
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Danger Zone</DropdownMenuLabel>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem>
              <span style={{ color: '#E11D48' }}>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};

/** Status picker for an appointment row — coloured dot indicators. */
export const AppointmentStatusMenu = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [status, setStatus] = React.useState('Confirmed');
    const statuses = [
      { label: 'Confirmed', color: '#16A34A' },
      { label: 'Waiting', color: '#D97706' },
      { label: 'No-show', color: '#E11D48' },
      { label: 'Completed', color: '#64748B' },
    ];
    return (
      <div style={{ paddingBottom: 240 }}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #E2E2EA',
                background: '#fff',
                cursor: 'pointer',
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
                color: '#171725',
              }}
            >
              {status}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statuses.map((s) => (
              <DropdownMenuItem key={s.label} onClick={() => setStatus(s.label)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0, display: 'inline-block' }} />
                  {s.label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};

/** Doctor profile avatar trigger with notification badge on one item. */
export const DoctorProfileMenu = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ paddingBottom: 260 }}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '4px 10px 4px 4px',
                borderRadius: 8,
                border: '1px solid #E2E2EA',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#4B4AD5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>DR</span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#171725', fontFamily: 'Inter, sans-serif' }}>Dr. Ananya Mehta</span>
                <span style={{ fontSize: 11, color: '#717179', fontFamily: 'Inter, sans-serif' }}>Cardiologist</span>
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#717179" strokeWidth="2.5" aria-hidden><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Dr. Ananya Mehta / Cardiologist</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12 }}>
                Notifications
                <span style={{ background: '#4B4AD5', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 10, padding: '1px 7px', fontFamily: 'Inter, sans-serif' }}>3</span>
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};

/** Menu items each prefixed with a small 14px icon. */
export const WithIcons = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const iconSize = { width: 14, height: 14, flexShrink: 0 };
    return (
      <div style={{ paddingBottom: 240 }}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Pencil {...iconSize} />
                Edit
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <UploadCloud {...iconSize} />
                Upload
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ClipboardList {...iconSize} />
                Archive
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#E11D48' }}>
                <Trash2 {...iconSize} />
                Delete
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};
