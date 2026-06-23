export function Toast({ status, title, children, action, showIcon, icon: iconOverride, dismissible, duration, onDismiss, className, style, }: {
    status?: string | undefined;
    title: any;
    children: any;
    action: any;
    showIcon?: boolean | undefined;
    icon: any;
    dismissible?: boolean | undefined;
    duration?: number | undefined;
    onDismiss: any;
    className?: string | undefined;
    style: any;
}): import("react/jsx-runtime").JSX.Element | null;
export namespace Toast {
    let displayName: string;
}
export default Toast;
