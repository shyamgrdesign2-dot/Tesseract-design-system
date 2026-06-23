export function EditableCell({ column: c, value, row, locked, onChange, onCommit }: {
    column: any;
    value: any;
    row: any;
    locked: any;
    onChange: any;
    onCommit: any;
}): import("react/jsx-runtime").JSX.Element;
export function DragHandle({ icon, onDragStart, onDragEnd }: {
    icon: any;
    onDragStart: any;
    onDragEnd: any;
}): import("react/jsx-runtime").JSX.Element;
export function RowActions({ row, deletable, menuItems, onDelete, moreIcon, deleteIcon }: {
    row: any;
    deletable: any;
    menuItems: any;
    onDelete: any;
    moreIcon: any;
    deleteIcon: any;
}): import("react/jsx-runtime").JSX.Element;
