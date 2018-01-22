import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NodeItem } from '../model/node-item';
import { NodeComponent } from '../node/node.component';
import { TreeInsComponent } from '../tree-ins/tree-ins.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/delay';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TreeService {

    private selectedContexts: NodeComponent[] = [];
    private selectedItems: any[] = [];
    private selectedItemsSubject = new BehaviorSubject(this.selectedItems);
    private filterChangeSubject = new BehaviorSubject('');
    private debounceFilterChange = new Subject<string>();
    private nodeItems: NodeItem<any>[];
    private root: TreeInsComponent;

    constructor() {
        this.debounceFilterChange.debounceTime(300).distinctUntilChanged().subscribe(it => {
            this.filterChangeSubject.next(it);
        });
    }

    public connectFilterOnChange() {
        return this.filterChangeSubject.asObservable();
    }

    public filterChanged(value: string) {
        this.debounceFilterChange.next(value);
    }

    public connect() {
        return this.selectedItemsSubject.asObservable();
    }

    public select(item: any, context: NodeComponent) {
        this.selectedContexts.push(context);
        this.selectedItems.push(item);
    }

    public unSelect(item: any, context: NodeComponent) {
        this.removeItem(item);
        this.removeContext(context);
    }

    public clear() {
        for (let context of this.selectedContexts) {
            context.toggleSelected();
        }
    }

    public setNodeItems(nodeItems: NodeItem<any>[]) {
        this.nodeItems = nodeItems;
    }

    public addNodeById(nodeItem: NodeItem<any>, id: string) {
        let result = this.getNodeItem(this.root, id, this.findById);

        if (result) {
            if (result.nodeItem.children) {
                result.nodeItem.children.push(nodeItem);
                result.childStateChanged();
            }
        }
    }

    public deleteRoot(nodeItem: NodeItem<any>) {
        let context = this.root.nodeChildren.toArray().find(it => it.nodeItem === nodeItem);

        if (context) {
            this.unSelect(context.nodeItem.item, context);
            let index = this.root.nodeItems.indexOf(nodeItem);

            if (index !== -1) {
                this.root.nodeItems.splice(index, 1);
            }
        }
    }

    public deleteById(id: string) {
        let result = this.getNodeItem(this.root, id, this.findById);
        result.delete();
    }

    public setRoot(root: TreeInsComponent) {
        this.root = root;
    }

    public expandAll() {
        this.executeOnParents(this.root.nodeChildren.toArray(), this.expand);
    }

    public collapseAll() {
        this.executeOnParents(this.root.nodeChildren.toArray(), this.collapse);
    }

    private collapse(node: NodeComponent) {
        node.expanded = false;
    }

    private expand(node: NodeComponent) {
        node.expanded = true;
    }

    private executeOnParents(children: NodeComponent[], action: (node: NodeComponent) => void) {
        for (let child of children) {
            if (child.nodeItem.children) {
                action(child);
                this.executeOnParents(child.nodeChildren.toArray(), action);
            }
        }
    }

    private findById(node: NodeComponent, arg: string) {
        return node.nodeItem.id === arg;
    }

    private removeItem(item: any) {
        let index = this.selectedItems.indexOf(item);
        if (index !== -1) {
            this.selectedItems.splice(index, 1);
        }
    }

    private removeContext(context: NodeComponent) {
        let index = this.selectedContexts.indexOf(context);
        if (index !== -1) {
            this.selectedContexts.splice(index);
        }
    }

    private getNodeItem(tree: TreeInsComponent, arg: any, compare: (nodeItem, find: any) => boolean): NodeComponent {

        let children = tree.nodeChildren.toArray();
        let child = children.find(it => compare(it, arg));
        if (child) {
            return child;
        }

        return this.findByArg(children, arg, compare);
    }

    private findByArg(children: NodeComponent[], arg: any, compare: (nodeComponent: NodeComponent, find: any) => boolean): NodeComponent {
        for (let child of children) {
            if (child.nodeItem.children) {
                let result = child.nodeChildren.find(it => compare(it, arg));
                if (result) {
                    return result;
                } else {
                    result = this.findByArg(child.nodeChildren.toArray(), arg, compare);
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }
}
