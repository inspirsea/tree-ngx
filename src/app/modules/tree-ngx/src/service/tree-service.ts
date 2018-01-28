import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NodeItem } from '../model/node-item';
import { NodeComponent } from '../node/node.component';
import { TreeInsComponent } from '../tree-ngx/tree-ngx.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subject } from 'rxjs/Subject';
import { NodeState } from '../model/node-state';
import { NodeSelectedState } from '../model/node-selected-state';
import { TreeMode } from '../model/tree-mode';
import { TreeOptions } from '../model/tree-options';
import { TreeCallbacks } from '../model/tree-callbacks';

@Injectable()
export class TreeService {

    public options: TreeOptions;
    public callbacks: TreeCallbacks = {};
    private selectedItems: any[] = [];
    private selectedStates: NodeState[] = [];
    private filter = '';
    private selectedItemsSubject = new BehaviorSubject(this.selectedItems);
    private filterChangeSubject = new BehaviorSubject(this.filter);
    private nodeItems: NodeItem<any>[];

    constructor() {
        this.filterChangeSubject.debounceTime(300).distinctUntilChanged().subscribe(it => {
            this.onFilterChanged();
        });
    }

    public toggleSelected(state: NodeState) {
        if (state.selectedState === NodeSelectedState.unChecked) {
            if (this.options.mode === TreeMode.SingleSelect) {
                this.clear();
            }
            this.setChecked(state, true);
        } else if (state.selectedState === NodeSelectedState.checked
            || state.selectedState === NodeSelectedState.indeterminate) {
            this.setUnchecked(state, true);
        }

        if (this.callbacks.toggle) {
            this.callbacks.toggle(state.nodeItem);
        }

        if (state.parent) {
            this.childStateChanged(state.parent);
        }
    }

    public childStateChanged(state) {
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

    public nameClick(state: NodeState) {
        if (this.callbacks.nameClick) {
            this.callbacks.nameClick(state.nodeItem);
        }

        if (this.canToggleChildrenOnName(state)) {
            this.toggleSelected(state);
        }
    }

    public toggleExpanded(nodeStates: NodeState[], value: boolean) {
        for (let state of nodeStates) {
            state.expanded = value;
            this.toggleExpanded(state.children, value);
        }
    }

    public clear() {
        for (let state of this.selectedStates) {
            state.selected = false;
            state.selectedState = NodeSelectedState.unChecked;
        }

        this.selectedItems.length = 0;
        this.selectedStates.length = 0;
    }

    public addNodeById(nodeStates: NodeState[], nodeState: NodeState, id: string) {
        let result = this.getNodeItem(nodeStates, id, this.findById);

        if (result) {
            if (result.children) {
                nodeState.parent = result;
                result.children.push(nodeState);
                this.childStateChanged(result);
            }
        }
    }

    public deleteById(nodeStates: NodeState[], nodeItems: NodeItem<any>[], id: string) {
        let result = this.getNodeItem(nodeStates, id, this.findById);
        if (result) {
            this.delete(result);

            if (!result.parent) {
                this.deleteRoot(result, nodeStates, nodeItems);
            }

            this.childStateChanged(result);
        }
    }

    private delete(state: NodeState) {
        while (state.children.length > 0) {
            this.delete(state.children.pop());
        }

        this.removeSelected(state.nodeItem.item);
        this.remove(state);
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

    private remove(state: NodeState) {
        if (state.parent) {
            let itemIndex = state.parent.nodeItem.children.indexOf(state.nodeItem);

            if (itemIndex !== -1) {
                state.parent.nodeItem.children.splice(itemIndex, 1);
            }

            let index = state.parent.children.indexOf(state);

            if (index !== -1) {
                state.parent.children.splice(index, 1);
            }
        }
    }

    private canToggleChildrenOnName(state: NodeState) {
        if (this.options.checkboxes === false) {
            if (this.options.mode === TreeMode.SingleSelect && !state.nodeItem.children) {
                return true;
            } else if (this.options.mode === TreeMode.MultiSelect) {
                return true;
            }
        }

        return false;
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

    private setUnchecked(state: NodeState, propogate: boolean) {
        state.selectedState = NodeSelectedState.unChecked;
        state.selected = false;

        if (this.callbacks.unSelect) {
            this.callbacks.unSelect(state.nodeItem);
        }

        if (!state.nodeItem.children) {
            this.removeSelected(state.nodeItem.item);
        } else {
            if (propogate === true) {
                for (let child of state.children) {
                    this.setUnchecked(child, propogate);
                }
            }
        }
    }

    private setIndeterminate(state) {
        state.selectedState = NodeSelectedState.indeterminate;
        state.selected = true;
    }

    private setChecked(state: NodeState, propogate: boolean) {
        state.selectedState = NodeSelectedState.checked;
        state.selected = true;

        if (this.callbacks.select) {
            this.callbacks.select(state.nodeItem);
        }

        if (!state.nodeItem.children) {
            this.addSelected(state);
        } else {
            if (propogate === true) {
                for (let child of state.children) {
                    this.setChecked(child, propogate);
                }
            }
        }
    }

    private addSelected(state: NodeState) {
        this.selectedItems.push(state.nodeItem.item);
        this.selectedStates.push(state);
    }

    private removeSelected(item: any) {
        let index = this.selectedItems.indexOf(item);
        if (index !== -1) {
            this.selectedItems.splice(index, 1);
        }
    }

    private applyFilter(node: NodeComponent, res: boolean) {
        return node.applyFilter(res);
    }



    private findById(state: NodeState, arg: string) {
        return state.nodeItem.id === arg;
    }

    private removeItem(item: any) {
        let index = this.selectedItems.indexOf(item);
        if (index !== -1) {
            this.selectedItems.splice(index, 1);
        }
    }

    private getNodeItem(nodeStates: NodeState[], arg: any, compare: (state: NodeState, find: any) => boolean) {
        let result = nodeStates.find(it => compare(it, arg));

        if (result) {
            return result;
        } else {
            for (let state of nodeStates) {
                result = this.getNodeItem(state.children, arg, compare);
                if (result) {
                    return result;
                }
            }
        }

        return result;
    }

    public filterChanged(value: string) {
        this.filter = value;
        this.filterChangeSubject.next(value);
    }



    public connect() {
        return this.selectedItemsSubject.asObservable();
    }

    public getFilter() {
        return this.filter;
    }

    private onFilterChanged() {
        // this.executeOnParents(this.root.nodeChildren.toArray(), this.applyFilter);
    }

    private unSelectSubTree(context: NodeComponent) {
        // let nodeChildren = context.nodeChildren.toArray();
        // if (nodeChildren.length > 0) {
        //     for (let child of nodeChildren) {
        //         this.unSelectSubTree(child);
        //     }
        // }

        // this.unSelect(context);
    }


}
