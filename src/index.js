// ─────────────────────────────────────────────────────────────────────────────
// TatvaPractice UI — public entry point.
//
// Single import surface for consumers:
//   import { Button, Badge, DataTable, Dropdown } from "tp-ui";
//
// Everything is built in-house with zero runtime dependencies beyond
// react / react-dom. Atoms are primitives; molecules compose atoms.
// ─────────────────────────────────────────────────────────────────────────────

// Foundational styles ship with the package (bundled into tp-ui.css): the design
// tokens (CSS variables), the minimal base reset, and the type-role classes.
import "./tp-tokens.css";
import "./tp-base.css";
import "./tp-typography.css";

export * from "./components/atoms";
export * from "./components/molecules";
