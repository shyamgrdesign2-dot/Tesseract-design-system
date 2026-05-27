import { PatientActionsMenu } from "./PatientActionsMenu";

export default {
  title: "Organisms/PatientActionsMenu",
  component: PatientActionsMenu,
  parameters: {
    layout: "centered",
  },
};

const logAction = (id) => console.log("[PatientActionsMenu] selected:", id);

/**
 * All available action slots rendered in a single menu. Gives a
 * complete overview of every label, icon, and separator placement.
 */
export const AllSlots = {
  name: "All Slots",
  render: () => (
    <div className="flex items-center gap-4">
      <span className="text-sm text-tp-slate-500">Dr. Meena Krishnan — Slot: all</span>
      <PatientActionsMenu
        slots={[
          "view",
          "edit",
          "upload",
          "certificate",
          "admit-ipd",
          "advance-deposit",
          "add-labs",
          "health-checkup",
          "create-bill",
          "cancel-appointment",
          "end-visit",
          "send-reminder",
        ]}
        onSelect={logAction}
      />
    </div>
  ),
};

/**
 * Appointment row actions: view, edit, cancel, and end visit.
 * Mirrors what an appointments listing page would use.
 */
export const AppointmentActions = {
  name: "Appointment Actions",
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { name: "Arjun Mehta", time: "10:30 AM", token: "T-04" },
        { name: "Priya Nair", time: "11:00 AM", token: "T-05" },
        { name: "Suresh Iyer", time: "11:30 AM", token: "T-06" },
      ].map((p) => (
        <div
          key={p.token}
          className="flex items-center gap-3 rounded-[10px] border border-tp-slate-100 bg-white px-4 py-3 shadow-sm">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            style={{ background: "var(--tp-blue-100, #EEF2FF)", color: "var(--tp-blue-600, #4338CA)" }}>
            {p.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-tp-slate-800">{p.name}</p>
            <p className="text-xs text-tp-slate-500">{p.time} · {p.token}</p>
          </div>
          <PatientActionsMenu
            slots={["view", "edit", "cancel-appointment", "end-visit"]}
            onSelect={logAction}
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * Full patient profile actions: view, edit, upload, certificate, IPD
 * admission, and advance deposit — typical All Patients page surface.
 */
export const PatientProfileActions = {
  name: "Patient Profile Actions",
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { name: "Dr. Kavya Reddy", uhid: "TP-00412", dept: "Cardiology" },
        { name: "Ravi Shankar", uhid: "TP-00567", dept: "Orthopaedics" },
        { name: "Anita Desai", uhid: "TP-00783", dept: "Gynaecology" },
      ].map((p) => (
        <div
          key={p.uhid}
          className="flex items-center gap-3 rounded-[10px] border border-tp-slate-100 bg-white px-4 py-3 shadow-sm">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            style={{ background: "var(--tp-violet-100, #EDE9FE)", color: "var(--tp-violet-600, #7C3AED)" }}>
            {p.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-tp-slate-800">{p.name}</p>
            <p className="text-xs text-tp-slate-500">UHID: {p.uhid} · {p.dept}</p>
          </div>
          <PatientActionsMenu
            slots={["view", "edit", "upload", "certificate", "admit-ipd", "advance-deposit"]}
            onSelect={logAction}
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * Minimal two-slot menu (view + edit) used in read-only or restricted
 * contexts where only basic navigation is allowed.
 */
export const MinimalActions = {
  name: "Minimal Actions",
  render: () => (
    <div className="flex items-center gap-4">
      <span className="text-sm text-tp-slate-500">Siddharth Rao — read-only row</span>
      <PatientActionsMenu
        slots={["view", "edit"]}
        onSelect={logAction}
      />
    </div>
  ),
};
