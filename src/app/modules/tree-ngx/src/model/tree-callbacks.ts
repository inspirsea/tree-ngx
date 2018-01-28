import { NodeItem } from './node-item';

export interface TreeCallbacks {
    nameClick?: (item: NodeItem<any>) => void;
    select?: (item: NodeItem<any>) => void;
    unSelect?: (item: NodeItem<any>) => void;
    toggle?: (item: NodeItem<any>) => void;
}
