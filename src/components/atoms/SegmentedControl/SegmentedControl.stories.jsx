import React from "react";
import { SegmentedControl } from "./SegmentedControl";
import { TPLibraryIcon } from "../icons/tp/TPLibraryIcon";
import { TPIcon } from "@/src/components/atoms/icons/tp/TPIcon";

const ICON_VARIANTS = ["linear", "bulk", "bold", "broken", "twotone", "outline"];

// Resolve an icon node for an option, in the chosen style + family. Blank name → undefined.
const glyphFor = (name, variant = "linear", family) =>
  name ? <TPIcon name={name} variant={variant} family={family || undefined} size={16} /> : undefined;

const meta = {
  title: "Atoms/Segmented Control",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          'A horizontal (or vertical) row of mutually-exclusive options with a sliding indicator marking the active one.',
          '',
          '**When to use** — switching between a small set (2–5) of views or modes that share the same space: a queue/finished/cancelled filter, a list/grid toggle, a billing-period picker.',
          '**When not** — more than ~5 options, or options that need their own labels/icons in a menu, reach for `Tabs`; an on/off toggle is the `Switch`; a yes/no/maybe form field is `Radio`.',
          '',
          '**Key props** — `options` is the config array (`{ value, label, icon?, disabled? }`); `value` + `onValueChange` (controlled) or `defaultValue`; `variant` is `pill` vs `block`; `theme` colours the indicator; `orientation` row vs column; `fullWidth` stretches segments to fill the container.',
          '',
          '**Good to know** — selection is config-driven, so per-option `disabled` and `icon` live on the `options` entries, not on the root. Keep labels short and equal in weight; the indicator animates between equal-width cells.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"], description: "Segment height / text size" },
    variant: {
      control: "inline-radio",
      options: ["pill", "block"],
      description: "Pill (rounded) vs block (squared) track",
    },
    theme: {
      control: "select",
      options: ["neutral", "primary", "success", "error", "warning"],
      description:
        "Neutral uses a white indicator; primary/success/error/warning use the matching brand colour with white text",
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Lay the segments in a row (default) or stack them in a column",
    },
    radius: {
      control: "text",
      name: "corner radius",
      description: "px number, or 'pill' / 'sharp' — outer + indicator radius (blank = default)",
    },
    indicatorColor: {
      control: "color",
      name: "indicator color",
      description: "Override the sliding indicator's colour (blank = theme default)",
    },
    fullWidth: { control: "boolean", description: "Stretch segments to fill the container width" },
    disabled: { control: "boolean", description: "Disable the whole control (per-option disable lives on `options`)" },
    onValueChange: {
      table: { category: "Events" },
      control: false,
      description: "Fired with the newly-selected option value (stories manage selection internally)",
    },
    // ── Icons: one shared set of controls applied to every option ──
    withIcons: { control: "boolean", name: "with icons", description: "Show a leading icon on every segment", table: { category: "Icons" } },
    opt1Icon: { control: "text", tpIcon: true, name: "icon · Monthly", description: "CDN icon name for the first option", if: { arg: "withIcons" }, table: { category: "Icons" } },
    opt2Icon: { control: "text", tpIcon: true, name: "icon · Quarterly", description: "CDN icon name for the second option", if: { arg: "withIcons" }, table: { category: "Icons" } },
    opt3Icon: { control: "text", tpIcon: true, name: "icon · Yearly", description: "CDN icon name for the third option", if: { arg: "withIcons" }, table: { category: "Icons" } },
    iconVariant: { control: "select", options: ICON_VARIANTS, name: "icon style", description: "Shared icon style for all option icons", if: { arg: "withIcons" }, table: { category: "Icons" } },
    iconFamily: { control: "text", name: "icon family", description: "Override the auto-resolved CDN family (blank = auto)", if: { arg: "withIcons" }, table: { category: "Icons" } },
  },
  args: {
    size: "md",
    variant: "pill",
    theme: "neutral",
    orientation: "horizontal",
    radius: "",
    fullWidth: false,
    disabled: false,
    withIcons: false,
    opt1Icon: "calendar-1",
    opt2Icon: "calendar-2",
    opt3Icon: "calendar",
    iconVariant: "linear",
    iconFamily: "",
  },
};

export default meta;

// A radius control comes in as a string. Coerce a pure-number string to a number;
// pass keywords ("pill"/"sharp") / tokens through; blank → undefined (default look).
const radiusValue = (r) => {
  const s = String(r ?? "").trim();
  if (!s) return undefined;
  return /^-?\d+$/.test(s) ? Number(s) : s;
};

// Normalise the args for rendering (coerce radius). Strip the story-only icon
// controls so they don't leak onto the DOM via `...rest`.
const withRadius = ({ radius, withIcons, opt1Icon, opt2Icon, opt3Icon, iconVariant, iconFamily, ...args }) => ({
  ...args,
  radius: radiusValue(radius),
});

// Render an option's `icon` prop for the snippet, in the shared style/family.
const iconJsx = (name, variant, family) =>
  `<TPIcon name="${name}"${variant && variant !== "linear" ? ` variant="${variant}"` : ""}${family ? ` family="${family}"` : ""} size={16} />`;

const scCode = ({
  size = "md",
  variant = "pill",
  theme = "neutral",
  orientation = "horizontal",
  radius,
  indicatorColor,
  fullWidth = false,
  disabled = false,
  withIcons = false,
  opt1Icon,
  opt2Icon,
  opt3Icon,
  iconVariant,
  iconFamily,
}) => {
  const lines = [`  size="${size}"`, `  variant="${variant}"`, `  theme="${theme}"`];
  if (orientation !== "horizontal") lines.push(`  orientation="${orientation}"`);
  const rv = radiusValue(radius);
  if (rv != null) lines.push(typeof rv === "number" ? `  radius={${rv}}` : `  radius="${rv}"`);
  if (indicatorColor) lines.push(`  indicatorColor="${indicatorColor}"`);
  if (fullWidth) lines.push("  fullWidth");
  if (disabled) lines.push("  disabled");
  if (withIcons) {
    const labels = ["Monthly", "Quarterly", "Yearly"];
    const values = ["monthly", "quarterly", "yearly"];
    const names = [opt1Icon, opt2Icon, opt3Icon];
    const opts = values
      .map((value, i) => {
        const icon = names[i] ? `, icon: ${iconJsx(names[i], iconVariant, iconFamily)}` : "";
        return `    { value: "${value}", label: "${labels[i]}"${icon} },`;
      })
      .join("\n");
    lines.push(`  options={[\n${opts}\n  ]}`);
  } else {
    lines.push("  options={options}");
  }
  lines.push("  value={value}");
  lines.push("  onValueChange={setValue}");
  return `<SegmentedControl\n${lines.join("\n")}\n/>`;
};

const Row = ({ children, label }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {label && (
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--tesseract-slate-400)",
          fontFamily: "Inter, system-ui, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
    )}
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      {children}
    </div>
  </div>
);

// Build the Playground options, attaching a shared-style icon to each when
// `withIcons` is on. Default (off) renders the original icon-less options.
const playgroundOptions = ({ withIcons, opt1Icon, opt2Icon, opt3Icon, iconVariant, iconFamily }) => {
  const names = [opt1Icon, opt2Icon, opt3Icon];
  return [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ].map((opt, i) =>
    withIcons ? { ...opt, icon: glyphFor(names[i], iconVariant, iconFamily) } : opt,
  );
};

export const Playground = {
  render: (args) => {
    const [val, setVal] = React.useState("monthly");
    return (
      <SegmentedControl
        {...withRadius(args)}
        options={playgroundOptions(args)}
        value={val}
        onValueChange={setVal}
      />
    );
  },
  parameters: { docs: { source: { transform: (_code, ctx) => scCode(ctx.args) } } },
};

export const TwoOptions = {
  name: "Two Options (Boolean)",
  render: (args) => {
    const [val, setVal] = React.useState("false");
    return (
      <SegmentedControl
        {...args}
        options={[
          { value: "false", label: "False" },
          { value: "true", label: "True" },
        ]}
        value={val}
        onValueChange={setVal}
      />
    );
  },
};

export const ThreeOptions = {
  name: "Three Options",
  render: (args) => {
    const [val, setVal] = React.useState("all");
    return (
      <SegmentedControl
        {...args}
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
        value={val}
        onValueChange={setVal}
      />
    );
  },
};

export const FourOptions = {
  name: "Four Options",
  render: (args) => {
    const [val, setVal] = React.useState("day");
    return (
      <SegmentedControl
        {...args}
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
          { value: "year", label: "Year" },
        ]}
        value={val}
        onValueChange={setVal}
      />
    );
  },
};

export const Sizes = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Row label="Small">
        <SegmentedControl
          {...args}
          size="sm"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
            { value: "c", label: "Option C" },
          ]}
          defaultValue="a"
        />
      </Row>
      <Row label="Medium">
        <SegmentedControl
          {...args}
          size="md"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
            { value: "c", label: "Option C" },
          ]}
          defaultValue="b"
        />
      </Row>
      <Row label="Large">
        <SegmentedControl
          {...args}
          size="lg"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
            { value: "c", label: "Option C" },
          ]}
          defaultValue="c"
        />
      </Row>
    </div>
  ),
};

export const Variants = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Row label="Pill (rounded)">
        <SegmentedControl
          {...args}
          variant="pill"
          options={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
          ]}
          defaultValue="list"
        />
      </Row>
      <Row label="Block (squared)">
        <SegmentedControl
          {...args}
          variant="block"
          options={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
          ]}
          defaultValue="list"
        />
      </Row>
    </div>
  ),
};

export const Themes = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {["neutral", "primary", "success", "error", "warning"].map((theme) => (
        <Row key={theme} label={theme}>
          <SegmentedControl
            {...withRadius(args)}
            theme={theme}
            options={[
              { value: "on", label: "Enabled" },
              { value: "off", label: "Disabled" },
            ]}
            defaultValue="on"
          />
        </Row>
      ))}
    </div>
  ),
};

export const Orientation = {
  name: "Orientation (Vertical)",
  render: (args) => (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <Row label="Horizontal">
        <SegmentedControl
          {...withRadius(args)}
          orientation="horizontal"
          options={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
            { value: "calendar", label: "Calendar" },
          ]}
          defaultValue="list"
        />
      </Row>
      <Row label="Vertical">
        <SegmentedControl
          {...withRadius(args)}
          orientation="vertical"
          options={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
            { value: "calendar", label: "Calendar" },
          ]}
          defaultValue="list"
        />
      </Row>
    </div>
  ),
};

export const Radius = {
  name: "Corner Radius",
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {[
        { label: "Default", radius: undefined },
        { label: "Sharp", radius: "sharp" },
        { label: "8px", radius: 8 },
        { label: "Pill", radius: "pill" },
      ].map(({ label, radius }) => (
        <Row key={label} label={label}>
          <SegmentedControl
            {...args}
            variant="block"
            radius={radius}
            options={[
              { value: "a", label: "Option A" },
              { value: "b", label: "Option B" },
              { value: "c", label: "Option C" },
            ]}
            defaultValue="a"
          />
        </Row>
      ))}
    </div>
  ),
};

export const FullWidth = {
  render: (args) => (
    <div style={{ width: 400 }}>
      <SegmentedControl
        {...args}
        fullWidth
        options={[
          { value: "opd", label: "OPD" },
          { value: "ipd", label: "IPD" },
          { value: "daycare", label: "Daycare" },
        ]}
        defaultValue="opd"
      />
    </div>
  ),
};

export const WithIcons = {
  render: (args) => {
    const [val, setVal] = React.useState("list");
    return (
      <SegmentedControl
        {...args}
        options={[
          {
            value: "list",
            label: "List",
            icon: <TPLibraryIcon name="row-vertical" size={16} />,
          },
          {
            value: "grid",
            label: "Grid",
            icon: <TPLibraryIcon name="element-3" size={16} />,
          },
          {
            value: "calendar",
            label: "Calendar",
            icon: <TPLibraryIcon name="calendar" size={16} />,
          },
        ]}
        value={val}
        onValueChange={setVal}
      />
    );
  },
};

export const DisabledOption = {
  name: "Disabled Option",
  render: (args) => {
    const [val, setVal] = React.useState("active");
    return (
      <SegmentedControl
        {...args}
        options={[
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived", disabled: true },
          { value: "deleted", label: "Deleted" },
        ]}
        value={val}
        onValueChange={setVal}
      />
    );
  },
};

export const AppointmentView = {
  name: "Appointment View Switcher",
  render: (args) => {
    const [view, setView] = React.useState("queue");
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          background: "var(--tesseract-slate-0, #fff)",
          borderRadius: "var(--tesseract-radius-12, 12px)",
          border: "1px solid var(--tesseract-slate-100, #ececf0)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tesseract-slate-700)" }}>
          Appointments
        </span>
        <SegmentedControl
          {...args}
          size="sm"
          options={[
            { value: "queue", label: "Queue" },
            { value: "finished", label: "Finished" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          value={view}
          onValueChange={setView}
        />
      </div>
    );
  },
};

export const BillingPeriod = {
  name: "Billing Period Selector",
  render: (args) => {
    const [period, setPeriod] = React.useState("monthly");
    const prices = { monthly: "2,499", quarterly: "6,499", yearly: "19,999" };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: 24,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <SegmentedControl
          {...args}
          theme="primary"
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "quarterly", label: "Quarterly" },
            { value: "yearly", label: "Yearly" },
          ]}
          value={period}
          onValueChange={setPeriod}
        />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--tesseract-slate-900)" }}>
            ₹{prices[period]}
          </div>
          <div style={{ fontSize: 13, color: "var(--tesseract-slate-500)", marginTop: 4 }}>
            per {period === "monthly" ? "month" : period === "quarterly" ? "quarter" : "year"}
          </div>
        </div>
      </div>
    );
  },
};
