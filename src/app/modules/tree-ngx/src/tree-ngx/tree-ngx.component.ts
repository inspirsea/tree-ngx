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

@Component({
  selector: 'tree-ngx',
  templateUrl: './tree-ngx.component.html',
  providers: [TreeService]
})
export class TreeInsComponent implements OnInit, OnDestroy, OnChanges {

  @ContentChild('nodeNameTemplate') nodeNameTemplate: TemplateRef<any>;
  @ViewChildren('nodeChild') nodeChildren: QueryList<NodeComponent>;

  private defaultOptions: TreeOptions = {
    mode: TreeMode.MultiSelect,
    checkboxes: true
  };

  private subscription: ISubscription;

  @Input() options: TreeOptions = this.defaultOptions;
  @Input() callbacks: TreeCallbacks = {};
  @Input() nodeItems: NodeItem<any>[];
  @Input() filter = '';
  @Output() selectedItems = new EventEmitter<any>();

  constructor(private treeService: TreeService) {
  }

  ngOnInit() {
    this.subscription = this.treeService.connect().subscribe(it => {
      this.selectedItems.emit(it);
    });

    this.treeService.setRoot(this);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.nodeItems) {
      this.treeService.setNodeItems(this.nodeItems);
    }

    if (changes.filter) {
      this.treeService.filterChanged(this.filter.toLowerCase());
    }
  }

  public connect(): Observable<any[]> {
    return this.treeService.connect();
  }

  public addNodeById(nodeItem: NodeItem<any>, id: string) {
    this.treeService.addNodeById(nodeItem, id);
  }

  public deleteById(id: string) {
    this.treeService.deleteById(id);
  }

  public expandAll() {
    this.treeService.expandAll();
  }

  public collapseAll() {
    this.treeService.collapseAll();
  }
}
