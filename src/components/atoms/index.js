// ─────────────────────────────────────────────────────────────────────────────
// Tesseract Atoms — Barrel Export
// All atomic UI primitives available from a single import path:
//   import { Button, Badge } from "@/src/components/atoms"
// ─────────────────────────────────────────────────────────────────────────────

// Actions
export { Button } from "./Button";

// Display
export { MedicalIcon } from "./MedicalIcon";
export { Logo } from "./Logo";
export { Avatar } from "./Avatar";
export { Badge } from "./Badge";
export { Divider } from "./Divider";
export { Skeleton } from "./Skeleton";

// Feedback
export { LoadingIndicator } from "./LoadingIndicator";
export { Progress } from "./Progress";

// Form
export { InputBox } from "./Input";
export { Checkbox } from "./Checkbox";
export { Toggle } from "./Toggle";

// Form — extended
export { Radio, RadioGroup, FormControlLabel } from "./Radio";
export { Slider } from "./Slider";

// Data Display
export { Chip } from "./Chip";

// Medical
export { TPMedicalIcon, tpMedicalIconNames, resolveTPMedicalIconName } from "./MedicalIcon";

// Icons (CDN-served — 6 styles). TPLibraryIcon renders any icon by name; TPIcon
// is the curated subset. iconPath/hasIcon help build/validate CDN paths.
export { TPIcon, TPLibraryIcon, TP_ICON_NAMES, TP_ICON_VARIANTS, TP_LIBRARY_ICONS, iconPath } from "./icons/tp";

// Animation / Decorative
export { AnimatedGrid } from "./AnimatedGrid";
