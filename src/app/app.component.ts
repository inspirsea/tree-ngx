import { Component } from '@angular/core';
import { NodeItemIns } from './modules/tree-ins-ng2/model/node-item-ins';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public items: NodeItemIns[];

  ngOnInit() {
    this.items = [
      {
        name: "Root1"
      },
      {
        name: "Root2"
      },
      {
        name: "Root3"
      },
      {
        name: "Root4"
      }
    ] as NodeItemIns[];
  }
}
