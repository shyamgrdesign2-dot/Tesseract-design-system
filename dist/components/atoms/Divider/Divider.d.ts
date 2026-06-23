/**
 * Divider — visual separator atom.
 *
 * variant "solid"    — flat single-color line (default)
 * variant "gradient" — fades to transparent at both ends; colour in the middle.
 *                      Works horizontally and vertically.
 */
export function Divider({ orientation, variant, color, spacing, thickness, className, style: styleProp, }: {
    orientation?: string | undefined;
    variant?: string | undefined;
    color?: string | undefined;
    spacing?: number | undefined;
    thickness?: number | undefined;
    className: any;
    style: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace Divider {
    let displayName: string;
}
export default Divider;
