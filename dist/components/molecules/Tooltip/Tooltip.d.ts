export function TooltipProvider({ delayDuration, children }: {
    delayDuration?: number | undefined;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace TooltipProvider {
    let displayName: string;
}
export function Tooltip({ content, children, side, align, sideOffset, collisionPadding, delayDuration, variant, arrow, maxWidth, disabled, whenTruncated, trigger, dismissible, icon, className, open: openProp, defaultOpen, onOpenChange, }: {
    content: any;
    children: any;
    side?: string | undefined;
    align?: string | undefined;
    sideOffset?: number | undefined;
    collisionPadding?: number | undefined;
    delayDuration: any;
    variant?: string | undefined;
    arrow?: boolean | undefined;
    maxWidth?: number | undefined;
    disabled?: boolean | undefined;
    whenTruncated?: boolean | undefined;
    trigger?: string | undefined;
    dismissible?: boolean | undefined;
    icon: any;
    className: any;
    open: any;
    defaultOpen: any;
    onOpenChange: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace Tooltip {
    let displayName_1: string;
    export { displayName_1 as displayName };
}
export function TooltipTrigger({ asChild, children, ...props }: {
    [x: string]: any;
    asChild: any;
    children: any;
}): any;
export namespace TooltipTrigger {
    let displayName_2: string;
    export { displayName_2 as displayName };
}
export function TooltipContent({ className, side: sideProp, align: alignProp, sideOffset: sideOffsetProp, collisionPadding: collisionPaddingProp, style, children, ...props }: {
    [x: string]: any;
    className?: string | undefined;
    side: any;
    align: any;
    sideOffset: any;
    collisionPadding: any;
    style: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element | null;
export namespace TooltipContent {
    let displayName_3: string;
    export { displayName_3 as displayName };
}
export default Tooltip;
