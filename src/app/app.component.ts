import { Component, OnInit } from '@angular/core';
import { NodeItem } from './modules/tree-ins-ng2/model/node-item';
import { TreeCallbacks } from './modules/tree-ins-ng2/model/tree-callbacks';
import { TreeOptions } from './modules/tree-ins-ng2/model/tree-options';
import { TreeMode } from './modules/tree-ins-ng2/model/tree-mode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public items: NodeItem<string>[] = [];
  public selectedItems: any[];
  public callbacks: TreeCallbacks;
  public options: TreeOptions;

  ngOnInit() {
    let roots = [];
    for (let i = 0; i < 25; i++) {

      let children = [];
      for (let j = 0; j < 10; j++) {

        let grandChildren = [];
        for (let z = 0; z < 10; z++) {
          if (i === 0 && j === 0) {
            z = 10;
          }
          grandChildren.push({
            name: 'Grandchildren_' + i + '_' + j + '_' + z,
            item: 'gchild' + i + '_' + j + '_' + z
          });
        }

        children.push({
          name: 'Child_' + i + '_' + j,
          children: grandChildren,
          item: 'child'
        });

        children.push({
          name: 'Child_' + i + '_' + j,
          item: 'child'
        });
      }

      roots.push({
        name: 'Root_' + i,
        children: children,
        item: 'Root'
      });
    }

    this.items.push({
      name: 'All',
      children: roots,
      item: 'All'
    });

    this.callbacks = {
      nameClick: this.onNameClick
    };

    this.options = {
      checkboxes: false,
      mode: TreeMode.MultiSelect
    };
  }

  private onNameClick(item: NodeItem<any>) {
    item.name += 'I';
  }
}
