import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NodeItem } from '../model/node-item';
import { NodeState } from '../model/node-state';
import { NodeSelectedState } from '../model/node-selected-state';
import { TreeMode } from '../model/tree-mode';
import { TreeOptions } from '../model/tree-options';
import { TreeCallbacks } from '../model/tree-callbacks';
import { TreeUtil } from '../util/util';

@Injectable()
export class TreeService {

  public options: TreeOptions;
  public callbacks: TreeCallbacks = {};
  public treeState: NodeState[] = [];
  public nodeItems: NodeItem<any>[];

  private selectedItems: any[] = [];
  private selectedStates: NodeState[] = [];
  private filterValue = '';
  private selectedItemsSubject = new BehaviorSubject(this.selectedItems);
  private filterChangeSubject = new BehaviorSubject(this.filterValue);

  constructor() {
    this.filterChangeSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(it => {
      this.filterTraverse(this.treeState, this.filterValue);
    });
  }

  public toggleSelected(state: NodeState) {
    this.toggleSelectedState(state, false);

    if (this.callbacks.toggle) {
      this.callbacks.toggle(state.nodeItem);
    }
  }

  public toggleSelectedState(state, ignoreDisabled: boolean) {
    if (this.isDisabled(state, ignoreDisabled)) {
      return;
    }

    if (state.selectedState === NodeSelectedState.unChecked) {
      if (this.options.mode === TreeMode.SingleSelect) {
        this.clear();
        this.setChecked(state, false, true, ignoreDisabled);
      } else {
        this.setChecked(state, true, false, ignoreDisabled);
      }
    } else if (state.selectedState === NodeSelectedState.checked) {
      if (this.options.mode === TreeMode.SingleSelect) {
        this.setUnchecked(state, false, true, ignoreDisabled);
      } else {
        this.setUnchecked(state, true, false, ignoreDisabled);
      }
    } else {
      if (this.anyActiveSelected(state) && !state.selected) {
        this.setUnchecked(state, true, false, ignoreDisabled);
      } else {
        this.setChecked(state, true, false, ignoreDisabled);
      }
    }

    if (state.parent && this.options.mode !== TreeMode.SingleSelect) {
      this.childStateChanged(state.parent);
    }
  }

  public setInitialState() {
    this.setInitialSelectedState(this.treeState);
  }

  public childStateChanged(state: NodeState) {
    if (this.anyChildSelected(state)) {
      if (this.allChildrenSelected(state)) {
        this.setChecked(state, false);
      } else {
        this.setIndeterminate(state);
      }
    } else {
      this.setUnchecked(state, false);
    }

    if (state.parent) {
      this.childStateChanged(state.parent);
    }
  }

  public checkBoxClick(state: NodeState) {
    if (this.options.mode !== TreeMode.HideSelected) {
      this.toggleSelected(state);
    }
  }

  public nameClick(state: NodeState) {
    if (this.callbacks.nameClick) {
      this.callbacks.nameClick(state.nodeItem);
    }

    if (this.canToggleChildrenOnName(state)) {
      this.toggleSelected(state);
    }
  }

  public toggleExpanded(value: boolean) {
    this.toggleExpandedTraverse(this.treeState, value);
  }

  public clear() {
    for (let state of this.selectedStates) {
      state.selected = false;
      state.selectedState = NodeSelectedState.unChecked;
    }

    this.selectedItems.length = 0;
    this.selectedStates.length = 0;
  }

  public addNodeById(nodeState: NodeState, id: string) {
    let result = this.getNodeState(this.treeState, id, this.findById);

    if (result) {
      if (!result.children) {
        result.children = [];
      }

      this.addNewNode(nodeState, result);

      if (result.nodeItem.item && this.options.mode === TreeMode.MultiSelect) {
        this.removeSelected(result.nodeItem.item);
      }
    }
  }

  public toggleById(id: string) {
    let result = this.getNodeState(this.treeState, id, this.findById);

    if (result) {
      this.toggleSelected(result);
    }
  }

  public editNameById(id: string, name: string) {
    const nodeState = this.getNodeState(this.treeState, id, this.findById);

    if (nodeState && nodeState.nodeItem) {
      nodeState.nodeItem.name = name;
    }
  }

  public editItemById(id: string, item: any) {
    const nodeState = this.getNodeState(this.treeState, id, this.findById);

    if (nodeState && nodeState.nodeItem) {
      if (this.selectedItems.includes(nodeState.nodeItem.item)) {
        this.removeSelected(nodeState.nodeItem.item);
        this.selectedItems.push(item);
        this.selectedItemsSubject.next(this.selectedItems);
      }

      nodeState.nodeItem.item = item;
    }
  }

  public deleteById(id: string) {
    let result = this.getNodeState(this.treeState, id, this.findById);
    if (result) {
      this.deleteByState(result);
    }
  }

  public deleteByState(state: NodeState) {
    this.delete(state);
    this.childStateChanged(state);
    this.filterTraverse(this.treeState, this.filterValue);
  }

  public expandById(id: string) {
    const result = this.getNodeState(this.treeState, id, this.findById);

    if (result) {
      this.toggleExpandedTraverseAsc(result, true);
    }
  }

  public collapseById(id: string) {
    const result = this.getNodeState(this.treeState, id, this.findById);

    if (result) {
      result.expanded = false;
    }
  }

  public reEvaluateSelectedState(state: NodeState): void {
    if (this.options.mode !== TreeMode.SingleSelect) {
      if (!this.hasNoChildren(state)) {
        this.childStateChanged(state);
        for (const child of state.children) {
          this.reEvaluateSelectedState(child);
        }
      }
    }
  }

  public filterChanged(value: string) {
    this.filterValue = value;
    this.filterChangeSubject.next(value);
  }

  public canToggleChildrenOnName(state: NodeState) {
    if (this.options.checkboxes === false) {
      if (this.options.mode === TreeMode.SingleSelect || this.options.mode === TreeMode.MultiSelect) {
        return true;
      }
    }

    return false;
  }

  public getParentById(id: string): NodeItem<any> {
    const result = this.getNodeState(this.treeState, id, this.findById);

    if (result) {
      return result.parent.nodeItem;
    }

    return null;
  }

  public forceFilterTraverse() {
    this.filterTraverse(this.treeState, this.filterValue);
  }

  private setInitialSelectedState(nodeStates: NodeState[]) {
    for (const state of nodeStates) {
      if (this.options.mode === TreeMode.MultiSelect) {
        if (state.nodeItem.selected && (!state.children || state.children.length === 0)) {
          this.toggleSelectedState(state, true);
        }
      } else {
        if (state.nodeItem.selected) {
          this.toggleSelectedState(state, true);
        }
      }

      this.setInitialSelectedState(state.children);
    }
  }

  private delete(state: NodeState) {
    while (state.children.length > 0) {
      this.delete(state.children.pop());
    }

    this.removeSelected(state.nodeItem.item);
    this.remove(state);

    if (!state.parent) {
      this.deleteRoot(state, this.treeState, this.nodeItems);
    }
  }

  private toggleExpandedTraverse(nodeStates: NodeState[], value: boolean) {
    for (let state of nodeStates) {
      state.expanded = value;
      this.toggleExpandedTraverse(state.children, value);
    }
  }

  private deleteRoot(state: NodeState, nodeStates: NodeState[], nodeItems: NodeItem<any>[]) {
    let itemIndex = nodeItems.indexOf(state.nodeItem);

    if (itemIndex !== -1) {
      nodeItems.splice(itemIndex, 1);
    }

    let index = nodeStates.indexOf(state);

    if (index !== -1) {
      nodeStates.splice(index, 1);
    }
  }

  private isDisabled(state: NodeState, ignoreDisabled: boolean): boolean {
    return (this.options.mode === TreeMode.NoSelect || (state.disabled && !ignoreDisabled));
  }

  private addNewNode(nodeState: NodeState, parent: NodeState): void {
    nodeState.parent = parent;
    parent.children.push(nodeState);
    parent.nodeItem.children.push(nodeState.nodeItem);

    parent.markSelected = TreeUtil.getMarkSelected(parent.nodeItem, this.options);

    if (this.options.mode === TreeMode.MultiSelect) {
      this.childStateChanged(parent);
    }

    this.filterTraverse(this.treeState, this.filterValue);
  }

  private remove(state: NodeState) {
    if (state.parent) {
      state.parent.hasFilteredChildren = false;

      let itemIndex = state.parent.nodeItem.children.indexOf(state.nodeItem);
      if (itemIndex !== -1) {
        state.parent.nodeItem.children.splice(itemIndex, 1);
      }

      let index = state.parent.children.indexOf(state);
      if (index !== -1) {
        state.parent.children.splice(index, 1);
      }

      let filteredIndex = state.parent.filteredChildren.indexOf(state);
      if (filteredIndex !== -1) {
        state.parent.filteredChildren.splice(filteredIndex, 1);
      }
    }
  }

  private anyChildSelected(state: NodeState): boolean {
    return state.children.find(it => {
      return it.selectedState === NodeSelectedState.checked || it.selectedState === NodeSelectedState.indeterminate;
    }) != null ? true : false;
  }

  private allChildrenSelected(state: NodeState) {
    return state.children.every(it => it.selectedState === NodeSelectedState.checked)
      && state.children.length === state.nodeItem.children.length;
  }

  private toggleExpandedTraverseAsc(nodeState: NodeState, value: boolean): void {
    nodeState.expanded = value;

    if (nodeState.parent) {
      this.toggleExpandedTraverseAsc(nodeState.parent, value);
    }
  }

  private setUnchecked(state: NodeState, propogate: boolean, force?: boolean, ignoreDisabled?: boolean) {
    if (state.disabled && !ignoreDisabled) {
      return;
    }

    state.selectedState = NodeSelectedState.unChecked;
    state.selected = false;

    if (this.hasNoChildren(state) || force) {
      this.removeSelected(state.nodeItem.item);

      if (this.options.alwaysEmitSelected === true) {
        this.selectedItemsSubject.next(this.selectedItems);
      }

      if (this.callbacks.unSelect) {
        this.callbacks.unSelect(state.nodeItem);
      }

    } else if (propogate === true) {
      for (const child of state.children) {
        this.setUnchecked(child, propogate, force, ignoreDisabled);
      }
    }
  }

  private setIndeterminate(state) {
    state.selectedState = NodeSelectedState.indeterminate;
    state.selected = false;
  }

  private anyActiveSelected(state: NodeState): boolean {
    let result = state.children.filter(it => !it.disabled && it.selected).length > 0;

    for (const child of state.children) {
      if (!this.hasNoChildren(child) && this.anyActiveSelected(child)) {
        result = true;
      }
    }

    return result;
  }

  private hasNoChildren(state: NodeState): boolean {
    return (!state.children || state.children.length === 0);
  }

  private setChecked(state: NodeState, propogate: boolean, force?: boolean, ignoreDisabled?: boolean) {
    if (state.disabled && !ignoreDisabled) {
      return;
    }

    state.selectedState = NodeSelectedState.checked;
    state.selected = true;

    if (this.hasNoChildren(state) || force) {
      this.addSelected(state);
    } else if (propogate === true) {
      for (const child of state.children) {
        this.setChecked(child, propogate, force, ignoreDisabled);
      }
    }
  }

  private addSelected(state: NodeState) {
    this.selectedItems.push(state.nodeItem.item);
    this.selectedStates.push(state);

    if (this.options.alwaysEmitSelected === true) {
      this.selectedItemsSubject.next(this.selectedItems);
    }

    if (this.callbacks.select) {
      this.callbacks.select(state.nodeItem);
    }
  }

  private removeSelected(item: any) {
    let index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
  }

  private findById(state: NodeState, arg: string) {
    return state.nodeItem.id === arg;
  }

  private getNodeState(nodeStates: NodeState[], arg: any, compare: (state: NodeState, find: any) => boolean) {
    let result = nodeStates.find(it => compare(it, arg));

    if (result) {
      return result;
    } else {
      for (let state of nodeStates) {
        result = this.getNodeState(state.children, arg, compare);
        if (result) {
          return result;
        }
      }
    }

    return result;
  }

  public connect(): Observable<any[]> {
    return this.selectedItemsSubject.asObservable();
  }

  public applyFilter(state: NodeState, filter: string) {
    state.filteredChildren = this.filter(state.children, filter);
    return state.filteredChildren.length > 0;
  }

  private filter(states: NodeState[], value: string) {
    return states.filter(it => {
      if (this.options.mode === TreeMode.HideSelected && !it.selected) {
        return false;
      }

      if ((it.hasFilteredChildren || value === '' || it.nodeItem.name.toLowerCase().indexOf(value) !== -1)) {
        return true;
      }
    });
  }

  private filterTraverse(states: NodeState[], filter: string) {
    let results: boolean[] = [];

    for (let state of states) {
      if (state.children.length > 0) {
        state.hasFilteredChildren = false;
        state.hasFilteredChildren = this.filterTraverse(state.children, filter);

        let res = this.applyFilter(state, filter);
        if (res) {
          state.hasFilteredChildren = true;
        }

        results.push(state.hasFilteredChildren);
      }
    }

    return results.some(it => it === true);
  }
}
