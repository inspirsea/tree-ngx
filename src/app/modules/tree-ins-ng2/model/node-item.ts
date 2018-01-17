export interface NodeItem<T> {
    name: string;
    item: T;
    id?: string;
    children?: NodeItem<any>[];
}
