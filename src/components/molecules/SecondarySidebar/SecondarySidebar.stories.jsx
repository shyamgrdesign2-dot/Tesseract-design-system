import React from "react";
import { SecondarySidebar } from "./SecondarySidebar";
import { TPIcon } from "@/src/components/atoms/icons/tp/TPIcon";

const ITEMS = [
  { id: "pastVisits", label: "Past Visits", icon: "clipboard-text" },
  { id: "vitals", label: "Vitals", icon: "heart-rate", signal: true },
  { id: "history", label: "History", icon: "clipboard-activity" },
  { id: "labResults", label: "Lab Results", icon: "lab" },
  { id: "records", label: "Records", icon: "health-file-03" },
  { id: "gynec", label: "Gynec", icon: "gynec" },
  { id: "obstetric", label: "Obstetric", icon: "obstetric" },
  { id: "vaccine", label: "Vaccine", icon: "injection", badge: "trial" },
  { id: "growth", label: "Growth", icon: "ruler" },
  { id: "optal", label: "Ophthal", icon: "eye" },
  { id: "personalNotes", label: "Private Notes", icon: "document-text" },
  { id: "zydus", label: "Zydus Reports", icon: "microscope" },
];

function transformBadges(items, style) {
  if (!style || style === "default") return items;
  return items.map((item) => {
    const out = { ...item };
    if (style === "none") {
      out.badge = undefined;
      out.signal = undefined;
    } else if (style === "dot") {
      if (out.badge) {
        out.signal = true;
        out.badge = undefined;
      }
    } else {
      const side = style === "sticky-left" ? "left" : "right";
      if (out.badge === "trial")
        out.badge = { text: "Trial", variant: "gradient", color: "warning", sticky: side };
      else if (out.badge === "soon")
        out.badge = { text: "Soon", variant: "soft", color: "violet", sticky: side };
      else if (out.badge && typeof out.badge === "object" && out.badge.text)
        out.badge = { ...out.badge, sticky: side };
    }
    return out;
  });
}

const meta = {
  title: "Molecules/SecondarySidebar",
  component: SecondarySidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          'A gradient secondary rail (the RxPad pattern) — a fixed-width column of icon pills, always collapsed, with an active-state indicator.',
          '',
          '**When to use** — a per-record context nav nested inside a page (a patient\'s Visits / Vitals / Labs), sitting beside the primary `Sidebar`.',
          '**When not** — the app\'s top-level navigation, or a rail that needs to expand to labels — use `Sidebar`.',
          '',
          '**Key props** — `items` (`[{ id, label, icon, badge?, signal? }]`); `activeId` + `onSelect` (controlled selection); `tone` (`blue` default · `violet` · `slate` · `green` — drives gradient, fade, and active-icon ramp); `density` (`comfortable` | `compact` pill/label sizing); `badgeStyle` (`default` · `none` · `dot` · `sticky-right` · `sticky-left`); `collapsedWidth`, `pillRadius`, `bottomFade`, `footer`.',
          '',
          '**Good to know** — the rail stays collapsed at 80px; an item `signal: true` shows a notification dot, while `badge` renders a `Badge` (string shorthand or a full `{ text, variant, color, sticky }` object).',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    items: { table: { disable: true } },
    activeId: { table: { disable: true } },
    onSelect: { table: { disable: true } },
    collapsed: { table: { disable: true } },
    defaultCollapsed: { table: { disable: true } },
    onCollapsedChange: { table: { disable: true } },
    search: { table: { disable: true } },
    searchPlaceholder: { table: { disable: true } },
    showCollapseToggle: { table: { disable: true } },
    expandedWidth: { table: { disable: true } },
    width: { table: { disable: true } },
    gradient: { table: { disable: true } },
    header: { table: { disable: true } },
    footer: { table: { disable: true } },
    emptyState: { table: { disable: true } },
    pointerColor: { table: { disable: true } },
    className: { table: { disable: true } },
    tone: {
      control: "inline-radio",
      options: ["blue", "violet", "slate", "green"],
      description: "Rail gradient + fade + active-icon ramp",
      table: { category: "Appearance" },
    },
    density: {
      control: "inline-radio",
      options: ["comfortable", "compact"],
      description: "Pill / padding / label sizing",
      table: { category: "Appearance" },
    },
    // Dead in these stories: the empty state only renders when the search
    // filter matches nothing, but every story runs with search disabled and a
    // non-empty list, so this control can never change the preview. Kept
    // documented but removed from the panel.
    emptyText: {
      control: "text",
      description: "No-matches message (shown only when the search filter matches nothing)",
      table: { category: "Content", disable: true },
    },
    collapsedWidth: {
      control: { type: "number", min: 64, max: 100, step: 4 },
      description: "Rail width in px",
      table: { category: "Appearance" },
    },
    pillRadius: {
      control: { type: "range", min: 4, max: 20, step: 2 },
      description: "Pill corner radius (px)",
      table: { category: "Appearance" },
    },
    bottomFade: {
      control: "boolean",
      description: "Bottom fade overlay",
      table: { category: "Appearance" },
    },
    badgeStyle: {
      control: "select",
      options: ["default", "none", "dot", "sticky-right", "sticky-left"],
      description: "Badge display variant",
      table: { category: "Badge" },
    },
    // Icon controls are dead in these stories: every story renders the rail
    // collapsed with `search={false}`, `showCollapseToggle={false}` and a flat
    // item list (no children), so the search input, collapse toggle and section
    // caret are never rendered and these icons can't change the preview. Kept
    // documented but removed from the panel.
    searchIcon: {
      control: "text",
      tpIcon: true,
      description: "Icon shown inside the search input (visible in expanded mode with search enabled)",
      table: { category: "Icons", disable: true },
    },
    collapseIcon: {
      control: "text",
      tpIcon: true,
      description: "Icon for the collapse/expand toggle button (visible when showCollapseToggle)",
      table: { category: "Icons", disable: true },
    },
    caretIcon: {
      control: "text",
      tpIcon: true,
      description: "Caret icon on expandable section rows (visible for items with children)",
      table: { category: "Icons", disable: true },
    },
  },
  args: {
    collapsedWidth: 80,
    pillRadius: 12,
    bottomFade: true,
    badgeStyle: "default",
    tone: "blue",
    density: "comfortable",
    emptyText: "No matches",
    searchIcon: "search-normal-1",
    collapseIcon: "sidebar-left",
    caretIcon: "chevron-down",
  },
};

export default meta;

// Build an accurate, copy-paste snippet from the controls (what "Show code" shows).
const sidebarCode = ({ tone = "blue", density = "comfortable", collapsedWidth = 80, bottomFade = true, emptyText, searchIcon, collapseIcon, caretIcon }) => {
  const lines = ["  items={items}", '  activeId={active}', "  onSelect={setActive}", "  collapsed"];
  if (tone !== "blue") lines.push(`  tone="${tone}"`);
  if (density !== "comfortable") lines.push(`  density="${density}"`);
  if (collapsedWidth !== 80) lines.push(`  collapsedWidth={${collapsedWidth}}`);
  if (!bottomFade) lines.push("  bottomFade={false}");
  if (emptyText && emptyText !== "No matches") lines.push(`  emptyText="${emptyText}"`);
  if (searchIcon && searchIcon !== "search-normal-1") lines.push(`  searchIcon="${searchIcon}"`);
  if (collapseIcon && collapseIcon !== "sidebar-left") lines.push(`  collapseIcon="${collapseIcon}"`);
  if (caretIcon && caretIcon !== "chevron-down") lines.push(`  caretIcon="${caretIcon}"`);
  return `<SecondarySidebar\n${lines.join("\n")}\n/>`;
};

const transform = { docs: { source: { transform: (_code, ctx) => sidebarCode(ctx.args) } } };

const Shell = ({ children, height = 640, style }) => (
  <div
    style={{
      display: "flex",
      height,
      background: "var(--tesseract-slate-50, #FAFAFB)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Content = ({ activeId }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--tesseract-font-body)",
      color: "var(--tesseract-slate-500)",
      fontSize: 14,
      padding: 24,
    }}
  >
    Active:{" "}
    <strong style={{ color: "var(--tesseract-slate-900)", marginLeft: 6 }}>
      {activeId}
    </strong>
  </div>
);

export const Playground = {
  render: (args) => {
    const { badgeStyle, pillRadius, ...rest } = args;
    const items = transformBadges(ITEMS, badgeStyle);
    const [active, setActive] = React.useState("vitals");
    return (
      <Shell style={{ "--tesseract-radius-12": `${pillRadius}px` }}>
        <SecondarySidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          collapsed
          showCollapseToggle={false}
          search={false}
        />
        <Content activeId={active} />
      </Shell>
    );
  },
  parameters: transform,
};

export const WithBadges = {
  name: "Badges + Signal Dots",
  render: (args) => {
    const { badgeStyle, pillRadius, ...rest } = args;
    const items = transformBadges(ITEMS, badgeStyle);
    const [active, setActive] = React.useState("vaccine");
    return (
      <Shell style={{ "--tesseract-radius-12": `${pillRadius}px` }}>
        <SecondarySidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          collapsed
          showCollapseToggle={false}
          search={false}
        />
        <Content activeId={active} />
      </Shell>
    );
  },
  parameters: transform,
};

export const SignalDot = {
  name: "Signal Dot (Notification)",
  render: (args) => {
    const { badgeStyle, pillRadius, ...rest } = args;
    const items = transformBadges(ITEMS, badgeStyle);
    const [active, setActive] = React.useState("history");
    return (
      <Shell style={{ "--tesseract-radius-12": `${pillRadius}px` }}>
        <SecondarySidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          collapsed
          showCollapseToggle={false}
          search={false}
        />
        <Content activeId={active} />
      </Shell>
    );
  },
  parameters: transform,
};

/** Reskin via `tone`, tighten with `density`, and pin a `footer` slot at the
 *  bottom of the rail (parallel to Sidebar's footer). Defaults stay blue. */
export const ToneDensityFooter = {
  name: "Tone + Density + Footer",
  render: (args) => {
    const { badgeStyle, pillRadius, ...rest } = args;
    const items = transformBadges(ITEMS, badgeStyle);
    const [active, setActive] = React.useState("vitals");
    const footer = (
      <button
        type="button"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          width: "100%",
          padding: "12px 0",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "var(--tesseract-slate-0, #fff)",
          fontFamily: "var(--tesseract-font-body)",
          fontSize: 11,
          fontWeight: 500,
        }}
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 34,
            height: 34,
            borderRadius: 12,
            background: "color-mix(in srgb, var(--tesseract-slate-0) 16%, transparent)",
          }}
        >
          <TPIcon name="setting-2" variant="linear" size={18} color="var(--tesseract-slate-0, #fff)" />
        </span>
        Settings
      </button>
    );
    return (
      <Shell style={{ "--tesseract-radius-12": `${pillRadius}px` }}>
        <SecondarySidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          collapsed
          showCollapseToggle={false}
          search={false}
          footer={footer}
        />
        <Content activeId={active} />
      </Shell>
    );
  },
  args: { tone: "violet", density: "compact" },
  parameters: transform,
};
