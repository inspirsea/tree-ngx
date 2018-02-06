import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { NodeState } from '../model/node-state';

@Component({
  selector: 'node-icon-wrapper',
  templateUrl: './node-icon-wrapper.component.html'
})
export class NodeIconWrapperComponent {

  @Input() state: NodeState;
  @Input() nodeCollapsibleTemplate: TemplateRef<any>;

  public _this = this;

  constructor() { }

  public toggleExpand() {
    this.state.expanded = !this.state.expanded;
  }
}
