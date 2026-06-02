import { jsx, jsxs } from "react/jsx-runtime";

// Three separate filled dots in a horizontal row (•••). Style-agnostic, so it
// maps to every variant. Rotate 90° for a vertical kebab (⋮).
const MoreHorizontal = (props) =>
  /* @__PURE__ */ jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    ...props,
    children: [
      /* @__PURE__ */ jsx("circle", { cx: 5, cy: 12, r: 2, fill: "currentColor" }),
      /* @__PURE__ */ jsx("circle", { cx: 12, cy: 12, r: 2, fill: "currentColor" }),
      /* @__PURE__ */ jsx("circle", { cx: 19, cy: 12, r: 2, fill: "currentColor" }),
    ],
  });

var MoreHorizontal_default = MoreHorizontal;
export { MoreHorizontal_default as default };
