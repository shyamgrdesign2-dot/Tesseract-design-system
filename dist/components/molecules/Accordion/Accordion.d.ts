export function Accordion({ type, collapsible, value, defaultValue, onValueChange, className, style, children, ...props }: {
    [x: string]: any;
    type?: string | undefined;
    collapsible?: boolean | undefined;
    value: any;
    defaultValue: any;
    onValueChange: any;
    className?: string | undefined;
    style: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace Accordion {
    let displayName: string;
}
export const AccordionItem: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
export const AccordionTrigger: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
export const AccordionContent: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
import * as React from "react";
