export interface DialogSelectItem {
    name: string;
    value: string;
    index?: number;
}

export interface DialogSelectField {
    label: string;
    selectName: string;
    selectItems: DialogSelectItem[];
    defaultValue: string;
}

export interface DialogSelectsFields extends Array<DialogSelectField> {}
