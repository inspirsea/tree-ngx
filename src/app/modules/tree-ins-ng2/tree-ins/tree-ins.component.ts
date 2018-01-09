import { Component, OnInit, Input } from '@angular/core';
import { NodeItemIns } from '../model/node-item-ins';

@Component({
  selector: 'tree-ins',
  templateUrl: './tree-ins.component.html'
})
export class TreeInsComponent implements OnInit {

  @Input() nodeitems: NodeItemIns[];

  constructor() { }

  ngOnInit() {
  }

}
