import { Component } from '@angular/core';
import { NodeItemIns } from './modules/tree-ins-ng2/model/node-item-ins';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public items: NodeItemIns[] = [];

  ngOnInit() {

    for (let i = 0; i < 25; i++) {

      let children = [];
      for (let j = 0; j < 10; j++) {

        let grandChildren = [];
        for (let z = 0; z < 10; z++) {
          grandChildren.push({
            name: "Grandchildren_" + i + "_" + j + "_" + z
          });
        }

        children.push({
          name: "Child_" + i + "_" + j,
          children: grandChildren
        });
      }

      this.items.push({
        name: "Root_" + i,
        children: children
      });
    }
  }
}
