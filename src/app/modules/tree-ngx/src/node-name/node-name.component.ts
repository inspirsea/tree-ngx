import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { NodeState } from '../model/node-state';
import { TreeService } from '../service/tree-service';

@Component({
  selector: 'node-name',
  templateUrl: './node-name.component.html'
})
export class NodeNameComponent {

  @Input() state: NodeState;
  @Input() nodeNameTemplate: TemplateRef<any>;

  public _this = this;

  constructor(private treeService: TreeService) { }

  public nameClick() {
    this.treeService.nameClick(this.state);
  }

  public delete() {
    this.treeService.deleteByState(this.state);
  }
}
