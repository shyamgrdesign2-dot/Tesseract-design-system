import React from "react";
import { Sidebar } from "./Sidebar";
import { Badge } from "@/src/components/atoms/Badge";

/* ── Flat items (original rail pattern) ── */
const FLAT_ITEMS = [
  { id: "appointments", label: "Appointments", icon: "calendar" },
  { id: "all-patients", label: "All Patients", icon: "profile-2user" },
  { id: "follow-ups", label: "Follow-ups", icon: "calendar-add" },
  { id: "opd-billing", label: "OPD Billing", icon: "receipt-text", badge: "trial" },
  { id: "pharmacy", label: "Pharmacy", icon: "shop" },
  { id: "ipd", label: "IPD", icon: "hospital" },
  { id: "daycare", label: "Daycare", icon: "document-like" },
  { id: "bulk-messages", label: "Bulk Messages", icon: "message-programming" },
];

/* ── Nested items (analytics pattern) ── */
const NESTED_ITEMS = [
  { id: "overview", label: "Overview", icon: "chart" },
  { id: "appointments", label: "Appointments", icon: "calendar" },
  { id: "billing", label: "Billing", icon: "receipt-text" },
  { id: "patients", label: "Patients", icon: "profile-2user" },
  {
    id: "care",
    label: "Care",
    icon: "heart",
    children: [
      { id: "symptoms", label: "Symptoms", icon: "health" },
      { id: "diagnoses", label: "Diagnoses", icon: "clipboard-text" },
      { id: "medications", label: "Medications", icon: "note" },
      { id: "lab-tests", label: "Lab Tests", icon: "flask" },
      { id: "procedures", label: "Procedures", icon: "activity" },
      { id: "vitals", label: "Vitals", icon: "heart-tick" },
    ],
  },
  { id: "pharmacy", label: "Pharmacy", icon: "shop" },
  {
    id: "grow",
    label: "Grow",
    icon: "trend-up",
    children: [
      { id: "follow-ups", label: "Follow-ups", icon: "calendar-add" },
      { id: "campaigns", label: "Campaigns", icon: "message-programming" },
    ],
  },
  { id: "reports", label: "Reports", icon: "document-text" },
];

/* ── Mixed items (badges, disabled) ── */
const MIXED_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "element-3" },
  { id: "appointments", label: "Appointments", icon: "calendar" },
  {
    id: "clinical",
    label: "Clinical",
    icon: "stethoscope",
    children: [
      { id: "symptoms", label: "Symptoms", icon: "health" },
      { id: "diagnoses", label: "Diagnoses", icon: "clipboard-text" },
      { id: "medications", label: "Medications", icon: "note" },
      { id: "lab-tests", label: "Lab Tests", icon: "flask", badge: "soon" },
    ],
  },
  { id: "billing", label: "Billing", icon: "receipt-text", badge: "trial" },
  {
    id: "settings",
    label: "Settings",
    icon: "setting-2",
    children: [
      { id: "general", label: "General", icon: "setting" },
      { id: "users", label: "Users", icon: "people" },
      { id: "integrations", label: "Integrations", icon: "link-2", badge: { text: "New", variant: "soft", color: "success" } },
    ],
  },
];

function transformBadges(items, style) {
  if (!style || style === "default") return items;
  return items.map((item) => {
    const out = { ...item };
    if (style === "none") {
      out.badge = undefined;
    } else if (style === "dot") {
      if (out.badge)
        out.badge = <Badge variant="dot" color="error" size="md" />;
    } else {
      const side = style === "sticky-left" ? "left" : "right";
      if (out.badge === "trial")
        out.badge = { text: "Trial", variant: "gradient", color: "warning", sticky: side };
      else if (out.badge === "soon")
        out.badge = { text: "Soon", variant: "soft", color: "violet", sticky: side };
      else if (out.badge && typeof out.badge === "object" && out.badge.text)
        out.badge = { ...out.badge, sticky: side };
    }
    if (out.children) out.children = transformBadges(out.children, style);
    return out;
  });
}

const meta = {
  title: "Molecules/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Scalable sidebar with collapsed rail (80px) and expanded (236px) modes. " +
          "Supports flat items, nested children with expand/collapse, flyout popovers " +
          "on collapsed hover, search filtering, badges, and a configurable collapse toggle.",
      },
    },
  },
  argTypes: {
    items: { table: { disable: true } },
    activeId: { table: { disable: true } },
    onSelect: { table: { disable: true } },
    collapsed: { table: { disable: true } },
    onCollapsedChange: { table: { disable: true } },
    logo: { table: { disable: true } },
    footer: { table: { disable: true } },
    className: { table: { disable: true } },
    defaultCollapsed: {
      control: "boolean",
      description: "Collapsed (rail) or expanded mode",
      table: { category: "State" },
    },
    search: {
      control: "boolean",
      description: "Enable search input in expanded mode",
      table: { category: "Features" },
    },
    showCollapseToggle: {
      control: "boolean",
      description: "Show the collapse/expand toggle button",
      table: { category: "Features" },
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
      table: { category: "Features" },
    },
    bottomFade: {
      control: "boolean",
      description: "Bottom fade overlay",
      table: { category: "Appearance" },
    },
    expandedWidth: {
      control: { type: "number", min: 200, max: 320, step: 4 },
      description: "Expanded width in px",
      table: { category: "Appearance" },
    },
    collapsedWidth: {
      control: { type: "number", min: 64, max: 100, step: 4 },
      description: "Collapsed rail width in px",
      table: { category: "Appearance" },
    },
    chipRadius: {
      control: { type: "range", min: 4, max: 20, step: 2 },
      description: "Icon chip corner radius (px)",
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
    defaultCollapsed: false,
    search: true,
    showCollapseToggle: true,
    searchPlaceholder: "Search…",
    bottomFade: true,
    expandedWidth: 236,
    collapsedWidth: 80,
    chipRadius: 12,
    badgeStyle: "default",
  },
};

export default meta;

const Shell = ({ children, height = 600, style }) => (
  <div
    style={{
      display: "flex",
      height,
      background: "var(--tesseract-slate-50, #FAFAFB)",
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid var(--tesseract-slate-100, #ececf0)",
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
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(NESTED_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("appointments");
    const [collapsed, setCollapsed] = React.useState(args.defaultCollapsed);
    React.useEffect(() => setCollapsed(args.defaultCollapsed), [args.defaultCollapsed]);
    return (
      <Shell style={{ "--tesseract-radius-12": `${chipRadius}px` }}>
        <Sidebar
          {...rest}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          items={items}
          activeId={active}
          onSelect={setActive}
        />
        <Content activeId={active} />
      </Shell>
    );
  },
};

export const CollapsedRail = {
  name: "Collapsed Rail",
  render: (args) => {
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(FLAT_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("appointments");
    const [collapsed, setCollapsed] = React.useState(true);
    return (
      <Shell style={{ "--tesseract-radius-12": `${chipRadius}px` }}>
        <Sidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          search={false}
        />
        <Content activeId={active} />
      </Shell>
    );
  },
};

export const ExpandedFlat = {
  name: "Expanded (Flat Items)",
  render: (args) => {
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(FLAT_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("appointments");
    return (
      <Shell style={{ "--tesseract-radius-12": `${chipRadius}px` }}>
        <Sidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          search={false}
        />
        <Content activeId={active} />
      </Shell>
    );
  },
};

export const NestedWithSearch = {
  name: "Nested Items + Search",
  render: (args) => {
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(NESTED_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("symptoms");
    return (
      <Shell style={{ "--tesseract-radius-12": `${chipRadius}px` }} height={700}>
        <Sidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          search
          searchPlaceholder="Search analytics…"
        />
        <Content activeId={active} />
      </Shell>
    );
  },
};

export const CollapsedWithFlyouts = {
  name: "Collapsed + Flyout Popovers",
  render: (args) => {
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(NESTED_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("medications");
    const [collapsed, setCollapsed] = React.useState(true);
    return (
      <Shell style={{ "--tesseract-radius-12": `${chipRadius}px` }} height={700}>
        <Sidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
        <Content activeId={active} />
      </Shell>
    );
  },
};

export const WithBadges = {
  name: "Badges & Mixed Content",
  render: (args) => {
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(MIXED_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("dashboard");
    const [collapsed, setCollapsed] = React.useState(args.defaultCollapsed);
    React.useEffect(() => setCollapsed(args.defaultCollapsed), [args.defaultCollapsed]);
    return (
      <Shell style={{ "--tesseract-radius-12": `${chipRadius}px` }} height={640}>
        <Sidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          search
          searchPlaceholder="Search menu…"
        />
        <Content activeId={active} />
      </Shell>
    );
  },
};

export const Controlled = {
  name: "Controlled Collapse",
  render: (args) => {
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(NESTED_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("appointments");
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 12px",
            fontFamily: "var(--tesseract-font-body)",
            fontSize: 13,
            color: "var(--tesseract-slate-600)",
          }}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              padding: "6px 14px",
              border: "1px solid var(--tesseract-slate-200)",
              borderRadius: 8,
              background: "var(--tesseract-slate-0)",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "var(--tesseract-font-body)",
            }}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
          <span>
            State: <strong>{collapsed ? "collapsed" : "expanded"}</strong>
          </span>
        </div>
        <Shell style={{ "--tesseract-radius-12": `${chipRadius}px` }}>
          <Sidebar
            {...rest}
            items={items}
            activeId={active}
            onSelect={setActive}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            search
          />
          <Content activeId={active} />
        </Shell>
      </div>
    );
  },
};

export const NoCollapseToggle = {
  name: "No Collapse Toggle (Locked)",
  render: (args) => {
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(FLAT_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("appointments");
    return (
      <div style={{ display: "flex", gap: 16, "--tesseract-radius-12": `${chipRadius}px` }}>
        <Shell>
          <Sidebar
            {...rest}
            items={items}
            activeId={active}
            onSelect={setActive}
            showCollapseToggle={false}
            defaultCollapsed={false}
            search={false}
          />
          <Content activeId={active} />
        </Shell>
        <Shell>
          <Sidebar
            {...rest}
            items={items}
            activeId={active}
            onSelect={setActive}
            showCollapseToggle={false}
            defaultCollapsed
            search={false}
          />
          <Content activeId={active} />
        </Shell>
      </div>
    );
  },
};

export const CollapsedWithBadges = {
  name: "Collapsed Rail + Badges",
  render: (args) => {
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(MIXED_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("billing");
    const [collapsed, setCollapsed] = React.useState(true);
    return (
      <Shell style={{ "--tesseract-radius-12": `${chipRadius}px` }} height={640}>
        <Sidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
        <Content activeId={active} />
      </Shell>
    );
  },
};

export const WithFooter = {
  name: "With Footer",
  render: (args) => {
    const { badgeStyle, chipRadius, ...rest } = args;
    const items = transformBadges(NESTED_ITEMS, badgeStyle);
    const [active, setActive] = React.useState("overview");
    return (
      <Shell style={{ "--tesseract-radius-12": `${chipRadius}px` }}>
        <Sidebar
          {...rest}
          items={items}
          activeId={active}
          onSelect={setActive}
          search
          footer={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--tesseract-success-500, #22c55e)",
                  boxShadow: "0 0 0 3px var(--tesseract-success-50, #f0fdf4)",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "var(--tesseract-slate-400)",
                  fontWeight: 500,
                }}
              >
                TatvaCare Analytics
              </span>
            </div>
          }
        />
        <Content activeId={active} />
      </Shell>
    );
  },
};
