import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  EventEmitter,
  Output,
  ContentChild,
  TemplateRef,
  SimpleChanges,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NodeItem } from '../model/node-item';
import { TreeService } from '../service/tree-service';
import { TreeOptions } from '../model/tree-options';
import { TreeCallbacks } from '../model/tree-callbacks';
import { TreeMode } from '../model/tree-mode';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import { NodeComponent } from '../node/node.component';
import { Observable } from 'rxjs/Observable';
import { NodeState } from '../model/node-state';
import { NodeSelectedState } from '../model/node-selected-state';

@Component({
  selector: 'tree-ngx',
  templateUrl: './tree-ngx.component.html',
  providers: [TreeService]
})
export class TreeInsComponent implements OnInit, OnDestroy, OnChanges {

  @ContentChild('nodeNameTemplate') nodeNameTemplate: TemplateRef<any>;

  private subscription: ISubscription;

  private defaultOptions: TreeOptions = {
    mode: TreeMode.MultiSelect,
    checkboxes: true
  };

  @Input() options: TreeOptions = this.defaultOptions;
  @Input() callbacks: TreeCallbacks = this.treeService.callbacks;
  @Input() nodeItems: NodeItem<any>[];
  @Input() filter = '';
  @Output() selectedItems = new EventEmitter<any>();

  constructor(private treeService: TreeService) {
  }

  ngOnInit() {
    this.treeService.options = this.options;
    this.treeService.callbacks = this.callbacks;
    this.treeService.nodeItems = this.nodeItems;

    this.subscription = this.treeService.connect().subscribe(it => {
      this.selectedItems.emit(it);
    });

    this.treeService.treeState = this.initTreeStructure(null, this.treeService.nodeItems, this.options);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter) {
      this.treeService.filterChanged(this.filter.toLowerCase());
    }

    if (changes.options) {
      this.treeService.options = this.options;
    }

    if (changes.callbacks) {
      this.treeService.callbacks = this.callbacks;
    }
  }

  public connect(): Observable<any[]> {
    return this.treeService.connect();
  }

  public addNodeById(nodeItem: NodeItem<any>, id: string) {
    let newNodeState = this.initState(null, nodeItem, this.options);
    this.treeService.addNodeById(newNodeState, id);
  }

  public deleteById(id: string) {
    this.treeService.deleteById(id);
  }

  public expandAll() {
    this.treeService.toggleExpanded(true);
  }

  public collapseAll() {
    this.treeService.toggleExpanded(false);
  }

  private initTreeStructure(parent: NodeState, nodeItems: NodeItem<any>[], options: TreeOptions) {
    let treeStructure: NodeState[] = [];

    for (let nodeItem of nodeItems) {

      let nodeState = this.initState(parent, nodeItem, options);

      if (nodeItem.children) {
        nodeState.children = this.initTreeStructure(nodeState, nodeItem.children, options);
        nodeState.filteredChildren = nodeState.children;
      }

      treeStructure.push(nodeState);
    }

    return treeStructure;
  }

  private initState(parent: NodeState, nodeItem: NodeItem<any>, options: TreeOptions) {

    let nodeState: NodeState = {
      parent: parent,
      children: [],
      filteredChildren: [],
      hasFilteredChildren: false,
      nodeItem: nodeItem,
      expanded: nodeItem.expanded === false ? false : true,
      markSelected: this.getMarkSelected(nodeItem, options),
      collapseVisible: this.getCollapseVisible(nodeItem),
      selectedState: NodeSelectedState.unChecked,
      selected: false,
      showCheckBox: this.getCheckBoxVisible(nodeItem, options)
    };

    return nodeState;
  }

  private getMarkSelected(nodeItem: NodeItem<any>, options: TreeOptions) {
    if (!nodeItem.children && !options.checkboxes) {
      return true;
    } else {
      return false;
    }
  }

  private getCheckBoxVisible(nodeItem: NodeItem<any>, options: TreeOptions) {
    if (nodeItem.children && this.options.mode === TreeMode.SingleSelect
      || !this.options.checkboxes) {
      return false;
    } else {
      return true;
    }
  }

  private getCollapseVisible(nodeItem: NodeItem<any>) {
    if (nodeItem.children && nodeItem.children.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
