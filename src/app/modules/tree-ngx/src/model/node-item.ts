export interface NodeItem<T> {
    name: string;
    item?: T;
    id?: string;
    children?: NodeItem<any>[];
    selected?: boolean;
    expanded?: boolean;
    disabled?: boolean;
}
