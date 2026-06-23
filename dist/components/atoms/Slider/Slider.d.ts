/**
 * Slider — Range input atom with Tesseract token styling.
 * Uses native <input type="range"> with CSS accent-color.
 */
export function Slider({ value, defaultValue, min, max, step, onChange, disabled, color, size, className, style: styleProp, }: {
    value: any;
    defaultValue: any;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    onChange: any;
    disabled?: boolean | undefined;
    color?: string | undefined;
    size?: string | undefined;
    className: any;
    style: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace Slider {
    let displayName: string;
}
export default Slider;
