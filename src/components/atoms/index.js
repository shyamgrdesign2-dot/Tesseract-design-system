// ─────────────────────────────────────────────────────────────────────────────
// TatvaPractice Atoms — Barrel Export
// All atomic UI primitives available from a single import path:
//   import { Button, Badge } from "@/src/components/atoms"
// ─────────────────────────────────────────────────────────────────────────────

// Actions
export { Button } from "./Button";

// Display
export { MedicalIcon } from "./MedicalIcon";
export { Logo } from "./Logo";
export { Badge } from "./Badge";
export { Divider } from "./Divider";
export { Skeleton } from "./Skeleton";

// Feedback
export { LoadingIndicator } from "./LoadingIndicator";

// Form
export { InputBox } from "./Input";
export { Checkbox } from "./Checkbox";
export { Switch } from "./Switch";

// Form — extended
export { Radio, RadioGroup, FormControlLabel } from "./Radio";
export { Slider } from "./Slider";

// Data Display
export { Chip } from "./Chip";

// Medical
export { TPMedicalIcon, tpMedicalIconRegistry, tpMedicalIconNames, resolveTPMedicalIconName } from "./MedicalIcon";

// Icons (vendored TP_Icons — 6 styles)
export { TPIcon, TP_ICON_NAMES, TP_ICON_VARIANTS } from "./icons/tp";

// Animation / Decorative
export { NoiseOverlay } from "./NoiseOverlay";
export { AnimatedGrid } from "./AnimatedGrid";
