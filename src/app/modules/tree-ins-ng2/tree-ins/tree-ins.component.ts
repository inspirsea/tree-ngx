import { Component, OnInit, Input, EventEmitter, Output, ContentChild, TemplateRef } from '@angular/core';
import { NodeItem } from '../model/node-item';
import { TreeService } from '../service/tree-service';
import { TreeOptions } from '../model/tree-options';
import { TreeCallbacks } from '../model/tree-callbacks';
import { TreeMode } from '../model/tree-mode';
import { ISubscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'tree-ins',
  templateUrl: './tree-ins.component.html'
})
export class TreeInsComponent implements OnInit, OnDestroy {

  @ContentChild('nodeNameTemplate') nodeNameTemplate: TemplateRef<any>;

  private defaultOptions: TreeOptions = {
    mode: TreeMode.MultiSelect,
    checkboxes: true
  };

  private subscription: ISubscription;

  @Input() options: TreeOptions = this.defaultOptions;
  @Input() callbacks: TreeCallbacks = {};
  @Input() nodeItems: NodeItem<any>[];
  @Output() selectedItems = new EventEmitter<any>();

  constructor(private treeService: TreeService) {
  }

  ngOnInit() {
    this.subscription = this.treeService.connect().subscribe(it => {
      this.selectedItems.emit(it);
    });
  }

  public connect() {
    return this.treeService.connect();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
