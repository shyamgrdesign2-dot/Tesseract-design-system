import { useState } from "react";
import { SecondaryNavPanel } from "./SecondaryNavPanel";

export default {
  title: "Organisms/SecondaryNavPanel",
  component: SecondaryNavPanel,
  parameters: {
    layout: "centered",
  },
};

// ── Inline SVG icon helpers ──────────────────────────────────────────────────

function HomeIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2.5 7.5L10 2.5L17.5 7.5V16.25C17.5 16.94 16.94 17.5 16.25 17.5H13.75V12.5H6.25V17.5H3.75C3.06 17.5 2.5 16.94 2.5 16.25V7.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2.5" y="3.75" width="15" height="13.75" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M2.5 8.75H17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.25 2.5V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.75 2.5V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="7.5" cy="6.25" r="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M2.5 17.5C2.5 14.74 4.74 12.5 7.5 12.5C10.26 12.5 12.5 14.74 12.5 17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.75 3.75C15.13 3.75 16.25 4.87 16.25 6.25C16.25 7.63 15.13 8.75 13.75 8.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 12.5C16.93 12.5 18.5 14.07 18.5 16V17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RxPadIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3.75" y="2.5" width="12.5" height="15" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M6.25 6.25H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.25 10H13.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.25 13.75H11.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AnalyticsIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3.75 15L7.5 10L11.25 12.5L15.625 6.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.75 6.25H15.625V8.125" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="10" cy="10" r="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M10 2.5V3.75M10 16.25V17.5M3.75 10H2.5M17.5 10H16.25M5.16 5.16L5.98 5.98M14.02 14.02L14.84 14.84M5.16 14.84L5.98 14.02M14.02 5.98L14.84 5.16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Shared nav items ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "appointments", label: "Appointments", icon: CalendarIcon },
  { id: "patients", label: "Patients", icon: UsersIcon },
  { id: "rx-pad", label: "Rx Pad", icon: RxPadIcon },
  { id: "analytics", label: "Analytics", icon: AnalyticsIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

const NAV_ITEMS_WITH_BADGES = NAV_ITEMS.map((item) => {
  if (item.id === "appointments") {
    return {
      ...item,
      badge: {
        text: "12",
        gradient: "linear-gradient(135deg, #FF6B35 0%, #F7C59F 100%)",
      },
    };
  }
  if (item.id === "patients") {
    return {
      ...item,
      badge: {
        text: "3",
        gradient: "linear-gradient(135deg, #4B4AD5 0%, #818CF8 100%)",
      },
    };
  }
  return item;
});

// ── Stories ──────────────────────────────────────────────────────────────────

/**
 * Dark TP-blue gradient variant (the default "Rx" look used on the
 * appointment dashboard).
 */
export const RxVariant = {
  name: "Rx Variant (dark)",
  render: () => {
    const [active, setActive] = useState("home");
    return (
      <SecondaryNavPanel
        items={NAV_ITEMS}
        activeId={active}
        onSelect={setActive}
        variant="rx"
        height={600}
      />
    );
  },
};

/**
 * Light surface "primary" variant used on non-Rx pages.
 */
export const PrimaryVariant = {
  name: "Primary Variant (light)",
  render: () => {
    const [active, setActive] = useState("home");
    return (
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 4, overflow: "hidden" }}>
        <SecondaryNavPanel
          items={NAV_ITEMS}
          activeId={active}
          onSelect={setActive}
          variant="primary"
          height={600}
        />
      </div>
    );
  },
};

/**
 * Rx variant with "Patients" pre-selected as the active item.
 */
export const WithActiveItem = {
  name: "With Active Item",
  render: () => {
    const [active, setActive] = useState("patients");
    return (
      <SecondaryNavPanel
        items={NAV_ITEMS}
        activeId={active}
        onSelect={setActive}
        variant="rx"
        height={600}
      />
    );
  },
};

/**
 * Items with gradient badge counts attached to Appointments and Patients.
 */
export const WithBadges = {
  name: "With Badges",
  render: () => {
    const [active, setActive] = useState("home");
    return (
      <SecondaryNavPanel
        items={NAV_ITEMS_WITH_BADGES}
        activeId={active}
        onSelect={setActive}
        variant="rx"
        height={600}
      />
    );
  },
};

/**
 * Side-by-side comparison: rx variant (left) and primary variant (right),
 * both with "Analytics" active so all three item states — default, hover
 * (use your cursor), and active — are visible at once.
 */
export const AllItemStates = {
  name: "All Item States",
  parameters: { layout: "fullscreen" },
  render: () => {
    const [activeRx, setActiveRx] = useState("analytics");
    const [activePrimary, setActivePrimary] = useState("analytics");
    return (
      <div className="flex items-start gap-8 p-8 bg-tp-slate-50 min-h-screen">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-tp-slate-500">
            Rx (dark)
          </p>
          <SecondaryNavPanel
            items={NAV_ITEMS}
            activeId={activeRx}
            onSelect={setActiveRx}
            variant="rx"
            height={500}
          />
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-tp-slate-500">
            Primary (light)
          </p>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 4, overflow: "hidden" }}>
            <SecondaryNavPanel
              items={NAV_ITEMS}
              activeId={activePrimary}
              onSelect={setActivePrimary}
              variant="primary"
              height={500}
            />
          </div>
        </div>
      </div>
    );
  },
};
