export function DatePicker({ value, onChange, className, icon, mode, months: monthsProp, showPresets: showPresetsProp, presets, minDate, maxDate, isDateDisabled, use12Hour, minuteStep, label, helperText, status, required, disabled, placeholder, size, fullWidth, analyticsId, }: {
    value: any;
    onChange: any;
    className: any;
    icon: any;
    mode?: string | undefined;
    months: any;
    showPresets: any;
    presets?: {
        id: string;
        label: string;
        getRange: () => {
            start: Date;
            end: Date;
        };
    }[] | undefined;
    minDate: any;
    maxDate: any;
    isDateDisabled: any;
    use12Hour?: boolean | undefined;
    minuteStep?: number | undefined;
    label: any;
    helperText: any;
    status: any;
    required?: boolean | undefined;
    disabled?: boolean | undefined;
    placeholder: any;
    size?: string | undefined;
    fullWidth?: boolean | undefined;
    analyticsId: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace DatePicker {
    let displayName: string;
}
export function DateRangePicker({ value, onChange, className, icon, mode, months: monthsProp, showPresets: showPresetsProp, presets, minDate, maxDate, isDateDisabled, use12Hour, minuteStep, label, helperText, status, required, disabled, placeholder, size, fullWidth, analyticsId, }: {
    value: any;
    onChange: any;
    className: any;
    icon: any;
    mode?: string | undefined;
    months: any;
    showPresets: any;
    presets?: {
        id: string;
        label: string;
        getRange: () => {
            start: Date;
            end: Date;
        };
    }[] | undefined;
    minDate: any;
    maxDate: any;
    isDateDisabled: any;
    use12Hour?: boolean | undefined;
    minuteStep?: number | undefined;
    label: any;
    helperText: any;
    status: any;
    required?: boolean | undefined;
    disabled?: boolean | undefined;
    placeholder: any;
    size?: string | undefined;
    fullWidth?: boolean | undefined;
    analyticsId: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace DateRangePicker { }
export default DatePicker;
