import { AppTopHeader } from "./AppTopHeader";

export default {
  title: "Organisms/AppTopHeader",
  component: AppTopHeader,
  parameters: {
    layout: "fullscreen",
  },
};

/**
 * Default full header with clinic switcher. Click the clinic button to
 * open the dropdown and search / switch clinics.
 */
export const Default = {
  name: "Default",
  render: () => <AppTopHeader />,
};

/**
 * Shows the header rendered on a light page background, matching how it
 * appears on the Appointments and All Patients screens.
 */
export const OnPageBackground = {
  name: "On Page Background",
  render: () => (
    <div className="min-h-screen bg-tp-slate-50">
      <AppTopHeader />
      <div className="p-6">
        <p className="text-tp-slate-500 text-sm">Page content goes here…</p>
      </div>
    </div>
  ),
};

/**
 * Header rendered inside a dark container to check contrast of the
 * elements against a coloured backdrop.
 */
export const DarkVariant = {
  name: "Dark Variant",
  render: () => (
    <div
      style={{
        background:
          "radial-gradient(256.21% 808.53% at -194.95% 36.46%, #161558 0%, #232277 25%, #313097 50%, #4B4AD5 100%)",
        minHeight: "100vh",
        padding: "0",
      }}>
      <AppTopHeader />
      <div className="p-6">
        <p className="text-white/60 text-sm">Dark background page content…</p>
      </div>
    </div>
  ),
};

/**
 * Three viewport widths side-by-side (rendered via CSS scaling). Shows
 * how the header adapts: the clinic switcher is hidden below `sm` breakpoint.
 */
export const Responsive = {
  name: "Responsive",
  render: () => (
    <div className="flex flex-col gap-8 p-4 bg-tp-slate-100 min-h-screen">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-tp-slate-500">
          Mobile — 375px
        </p>
        <div style={{ width: 375, overflow: "hidden", border: "1px solid #e2e8f0", borderRadius: 8 }}>
          <AppTopHeader />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-tp-slate-500">
          Tablet — 768px
        </p>
        <div style={{ width: 768, overflow: "hidden", border: "1px solid #e2e8f0", borderRadius: 8 }}>
          <AppTopHeader />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-tp-slate-500">
          Desktop — 1280px
        </p>
        <div style={{ width: 1280, overflow: "hidden", border: "1px solid #e2e8f0", borderRadius: 8 }}>
          <AppTopHeader />
        </div>
      </div>
    </div>
  ),
};
