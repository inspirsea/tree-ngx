import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NodeItemIns } from '../model/node-item-ins';

@Component({
  selector: 'node-ins',
  templateUrl: './node-ins.component.html'
})
export class NodeInsComponent implements OnInit {

  @ViewChild('collapsed') collapsed: ElementRef;
  @ViewChild('unCollapsed') unCollapsed: ElementRef;
  @Input() nodeitem: NodeItemIns;
  @Input() parent: NodeItemIns;

  public _this = this;
  public expanded = true;

  constructor() { }

  ngOnInit() {
  }

  public toggleExpand() {
    this.unCollapsed.nativeElement.class += "scaleTest";
  }

  public calculateCollapsedScale () {
    // The menu title can act as the marker for the collapsed state.
    let collapsed = this.collapsed.nativeElement.getBoundingClientRect();
  
    // Whereas the menu as a whole (title plus items) can act as
    // a proxy for the expanded state.
    let expanded = this.unCollapsed.nativeElement.getBoundingClientRect();
    return {
      x: collapsed.width / expanded.width,
      y: collapsed.height / expanded.height
    }
  }

}
