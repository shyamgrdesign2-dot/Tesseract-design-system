/**
 * @param {{ className?: string, style?: object,
 *   lineColor?: string,   // lattice stroke (default faint white for dark surfaces)
 *   cometColor?: string,  // travelling pulse color (default white)
 *   edgeFade?: number|boolean  // edge-fade strength 0..1 (true → 0.6, false → 0)
 * }} props
 */
export function AnimatedGrid({ className, style, lineColor, cometColor, edgeFade, }: {
    className?: string;
    style?: object;
    lineColor?: string;
    cometColor?: string;
    edgeFade?: number | boolean;
}): import("react/jsx-runtime").JSX.Element;
export default AnimatedGrid;
