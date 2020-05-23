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
import { TreeNgx } from '../model/tree-ngx';
import { TreeUtil } from '../util/util';

@Component({
  selector: 'tree-ngx',
  templateUrl: './tree-ngx.component.html',
  providers: [TreeService]
})
export class TreeNgxComponent implements OnInit, OnDestroy, OnChanges, TreeNgx {
  @ContentChild('nodeNameTemplate', { static: false }) nodeNameTemplate: TemplateRef<any>;
  @ContentChild('nodeCollapsibleTemplate', { static: false }) nodeCollapsibleTemplate: TemplateRef<any>;

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
      if (this.treeService.nodeItems) {
        this.treeService.treeState = this.initTreeStructure(null, this.treeService.nodeItems, this.treeService.options);
        this.treeService.clear();
        this.treeService.setInitialState();
        this.treeService.forceFilterTraverse();
      }
    }

    if (changes.callbacks) {
      this.treeService.callbacks = this.callbacks;
    }

    if (changes.nodeItems) {
      this.initialize();
    }
  }

  public addNodeById(nodeItem: NodeItem<any>, id?: string): void {
    const newNodeState = TreeUtil.initState(null, nodeItem, this.options);
    this.treeService.addNodeById(newNodeState, id);
  }

  public deleteById(id: string): void {
    this.treeService.deleteById(id);
  }

  public editNameById(id: string, name: string): void {
    this.treeService.editNameById(id, name);
  }

  public editItemById(id: string, item: any): void {
    this.treeService.editItemById(id, item);
  }

  public getParentById(id: string): NodeItem<any> {
    return this.treeService.getParentById(id);
  }

  public expandAll(): void {
    this.treeService.toggleExpanded(true);
  }

  public collapseAll(): void {
    this.treeService.toggleExpanded(false);
  }

  public expandById(id: string): void {
    this.treeService.expandById(id);
  }

  public collapseById(id: string): void {
    this.treeService.collapseById(id);
  }

  public selectById(id: string): void {
    this.treeService.selectById(id);
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

      const nodeState = TreeUtil.initState(parent, nodeItem, options);

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
}
