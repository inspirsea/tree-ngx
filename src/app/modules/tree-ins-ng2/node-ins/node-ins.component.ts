import { Component, OnInit, Input } from '@angular/core';
import { NodeItemIns } from '../model/node-item-ins';

@Component({
  selector: 'node-ins',
  templateUrl: './node-ins.component.html',
  styleUrls: ['./node-ins.component.css']
})
export class NodeInsComponent implements OnInit {

  @Input() nodeitem: NodeItemIns;

  constructor() { }

  ngOnInit() {
  }

}
