import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NodeItem } from '../model/node-item';
import { NodeComponent } from '../node/node.component';


@Injectable()
export class TreeService {

    private selectedContexts: NodeComponent[] = [];
    private selectedItems: any[] = [];
    private selectedItemsSubject = new BehaviorSubject(this.selectedItems);

    constructor() {
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
}
