import { NodeItem } from './node-item';
import { NodeSelectedState } from './node-selected-state';

export interface NodeState {
    parent: NodeState;
    children: NodeState[];
    filteredChildren: NodeState[];
    hasFilteredChildren: boolean;
    nodeItem: NodeItem<any>;
    disabled: boolean;
    expanded: boolean;
    markSelected: boolean;
    selectedState: NodeSelectedState;
    selected: boolean;
    showCheckBox: boolean;
}
