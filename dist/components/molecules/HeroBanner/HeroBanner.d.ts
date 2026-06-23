/**
 * HeroBanner — The page hero banner. Dark radial-gradient surface with an
 * animated geometric lattice accent (right side, partly off-canvas), an
 * optional back button, and a top-aligned title + subtitle. This is the
 * only banner.
 *
 * Props:
 *   size          "sm" | "md" | "lg"          banner height; default "md"
 *   bottomRadius  number                       overrides the size default (sm 20 / md 24 / lg 32); max 42
 *   title         string                       required
 *   subtitle      string                       optional
 *   titleSize     "sm" (18px) | "md" (24px)    default "md"
 *   subtitleSize  "sm" | "md"                  default "sm"
 *   showBackButton boolean                     back button (centered on the heading)
 *   actions       ReactNode                    CTA slot (dark-surface Button: text / icon / split)
 *   pattern       boolean                      default true — animated lattice accent
 *   className     string
 */
export function HeroBanner({ size, bottomRadius, title, subtitle, titleSize, subtitleSize, showBackButton, onBack, actions, pattern, className, }: {
    size?: string | undefined;
    bottomRadius: any;
    title: any;
    subtitle: any;
    titleSize?: string | undefined;
    subtitleSize?: string | undefined;
    showBackButton?: boolean | undefined;
    onBack: any;
    actions: any;
    pattern?: boolean | undefined;
    className?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
