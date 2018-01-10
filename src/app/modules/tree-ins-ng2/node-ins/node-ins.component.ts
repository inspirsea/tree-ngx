import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NodeItemIns } from '../model/node-item-ins';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'node-ins',
  templateUrl: './node-ins.component.html'
})
export class NodeInsComponent implements OnInit {

  @Input() nodeitem: NodeItemIns;
  @Input() parent: NodeItemIns;

  public _this = this;
  public collapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
