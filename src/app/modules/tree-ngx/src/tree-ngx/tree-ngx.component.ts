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
  SimpleChanges
} from '@angular/core';
import { NodeItem } from '../model/node-item';
import { TreeService } from '../service/tree-service';
import { TreeOptions } from '../model/tree-options';
import { TreeCallbacks } from '../model/tree-callbacks';
import { TreeMode } from '../model/tree-mode';
import { Subscription, timer } from 'rxjs';
import { NodeState } from '../model/node-state';
import { NodeSelectedState } from '../model/node-selected-state';

@Component({
  selector: 'tree-ngx',
  templateUrl: './tree-ngx.component.html',
  providers: [TreeService]
})
export class TreeNgxComponent implements OnInit, OnDestroy, OnChanges {

  @ContentChild('nodeNameTemplate') nodeNameTemplate: TemplateRef<any>;
  @ContentChild('nodeCollapsibleTemplate') nodeCollapsibleTemplate: TemplateRef<any>;

  private subscription: Subscription;

  private defaultOptions: TreeOptions = {
    mode: TreeMode.SingleSelect,
    checkboxes: false,
    alwaysEmitSelected: false
  };

  @Input() options: TreeOptions = this.defaultOptions;
  @Input() callbacks: TreeCallbacks = this.treeService.callbacks;
  @Input() nodeItems: NodeItem<any>[];
  @Input() filter = '';
  @Output() selectedItems = new EventEmitter<any>();

  constructor(public treeService: TreeService) {
  }

  ngOnInit() {
    this.subscription = this.treeService.connect().subscribe(it => {
      const sub = timer(0).subscribe(() => {
        this.selectedItems.emit(it);
        sub.unsubscribe();
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter) {
      this.treeService.filterChanged(this.filter.toLowerCase());
    }

    if (changes.options) {
      this.setOptions();
    }

    if (changes.callbacks) {
      this.treeService.callbacks = this.callbacks;
    }

    if (changes.nodeItems) {
      this.initialize();
    }
  }

  public addNodeById(nodeItem: NodeItem<any>, id: string) {
    let newNodeState = this.initState(null, nodeItem, this.options);
    this.treeService.addNodeById(newNodeState, id);
  }

  public deleteById(id: string) {
    this.treeService.deleteById(id);
  }

  public editNameById(id: string, name: string) {
    this.treeService.editNameById(id, name);
  }

  public editItemById(id: string, item: any) {
    this.treeService.editItemById(id, item);
  }

  public expandAll() {
    this.treeService.toggleExpanded(true);
  }

  public collapseAll() {
    this.treeService.toggleExpanded(false);
  }

  public initialize() {
    this.setOptions();
    this.treeService.callbacks = this.callbacks;
    this.treeService.nodeItems = this.nodeItems;

    this.treeService.treeState = this.initTreeStructure(null, this.treeService.nodeItems, this.treeService.options);
    this.treeService.clear();
    this.treeService.setInitialState();
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

  private setOptions() {
    if (this.options.mode === TreeMode.NoSelect) {
      this.treeService.options = { ...this.options, checkboxes: false };
    } else {
      this.treeService.options = { ...this.options };
    }
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
    if (nodeItem.children && this.treeService.options.mode === TreeMode.SingleSelect
      || !this.treeService.options.checkboxes) {
      return false;
    } else {
      return true;
    }
  }

  private getCollapseVisible(nodeItem: NodeItem<any>) {
    if (nodeItem.children) {
      return true;
    } else {
      return false;
    }
  }
}
