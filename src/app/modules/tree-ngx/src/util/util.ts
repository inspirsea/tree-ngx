import { NodeItem } from '../model/node-item';
import { NodeState } from '../model/node-state';
import { NodeSelectedState } from '../model/node-selected-state';
import { TreeOptions } from '../model/tree-options';
import { TreeMode } from '../model/tree-mode';

export class TreeUtil {

  public static initState(parent: NodeState, nodeItem: NodeItem<any>, options: TreeOptions): NodeState {

    const nodeState: NodeState = {
      parent: parent,
      children: [],
      filteredChildren: [],
      hasFilteredChildren: false,
      nodeItem: nodeItem,
      expanded: nodeItem.expanded === false ? false : true,
      disabled: nodeItem.disabled === true ? true : false,
      markSelected: this.getMarkSelected(nodeItem, options),
      selectedState: NodeSelectedState.unChecked,
      selected: false,
      showCheckBox: options.checkboxes
    };

    return nodeState;
  }

  public static getMarkSelected(nodeItem: NodeItem<any>, options: TreeOptions): boolean {
    if (((!nodeItem.children || nodeItem.children.length === 0) || options.mode === TreeMode.SingleSelect) && !options.checkboxes) {
      return true;
    } else {
      return false;
    }
  }
}
