import React from "react";
import { SecondarySidebar } from "./SecondarySidebar";

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
        component:
          "Blue-gradient secondary sidebar rail (RxPad pattern). " +
          "Always collapsed at 80px. Supports badges, signal dots, bottom fade, and active state indicator.",
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
    className: { table: { disable: true } },
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
  },
  args: {
    collapsedWidth: 80,
    pillRadius: 12,
    bottomFade: true,
    badgeStyle: "default",
  },
};

export default meta;

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
};
