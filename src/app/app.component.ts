import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNgx, NodeItem, TreeCallbacks, TreeOptions, TreeMode } from './modules/tree-ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('firstTreeRef', { static: false }) firstTreeRef: TreeNgx;
  @ViewChild('secondTreeRef', { static: false }) secondTreeRef: TreeNgx;

  public firstTree: NodeItem<string>[] = [];
  public firstTreecallbacks: TreeCallbacks;
  public firstTreeoptions: TreeOptions;
  public firstSelectedItems: any[];

  public secondTree: NodeItem<string>[] = [];
  public secondTreecallbacks: TreeCallbacks;
  public secondTreeoptions: TreeOptions;
  public secondSelectedItems: any[];
  public filter = '';

  public editableNode: NodeItem<any>;

  public currentId: string;

  ngOnInit() {

    this.firstTree = [
      {
        id: '0',
        name: 'all',
        item: 'asd',
        children: [
          {
            id: '1',
            name: 'child',
            item: 'asd',
          }
        ]
      }
    ];

    setTimeout(() => {
      this.firstTree = [this.createTree()];
    }, 500);


    this.firstTreeoptions = {
      checkboxes: true,
      mode: TreeMode.MultiSelect,
      alwaysEmitSelected: false
    };

    this.firstTreecallbacks = {
      toggle: this.onNameClick,
    };

    this.secondTree.push(this.createTree());

    this.secondTreecallbacks = {
      nameClick: this.onNameClick,
      select: this.onSelect,
      unSelect: this.onUnselect
    };

    this.secondTreeoptions = {
      checkboxes: false,
      mode: TreeMode.MultiSelect,
      alwaysEmitSelected: true
    };
  }

  public selectNode() {
    this.firstTreeRef.selectById(this.currentId);
  }

  public selecedItemsChanged(items: any[]) {
    this.firstSelectedItems = items;
  }

  public editNodeName() {
    this.firstTreeRef.editNameById(this.currentId, 'wubwub');
  }

  public editNodeItem() {
    this.firstTreeRef.editItemById(this.currentId, 'item');
  }

  public expandById() {
    this.firstTreeRef.expandById(this.currentId);
  }

  public collapseById() {
    this.firstTreeRef.collapseById(this.currentId);
  }

  public addNode() {
    let item = {
      name: 'newItem',
      item: { name: 'superitem' }
    };

    this.secondTreeRef.addNodeById(item, this.currentId);
  }

  public deleteNode() {
    this.secondTreeRef.deleteById(this.currentId);
  }

  private createTree() {
    let id = 0;
    let roots = [];
    for (let i = 0; i < 10; i++) {

      let children = [];
      for (let j = 0; j < 10; j++) {

        let grandChildren = [];
        for (let z = 0; z < 10; z++) {
          if (i === 0 && j === 0) {
            z = 10;
          }
          grandChildren.push({
            id: (++id).toString(),
            name: 'Grandchildren_' + i + '_' + j + '_' + z,
            item: 'gchild' + i + '_' + j + '_' + z,
            selected: i === 0 ? true : false,
            disabled: false
          });
        }

        children.push({
          id: (++id).toString(),
          name: 'Child_' + i + '_' + j,
          children: grandChildren,
          item: null
        });

        children.push({
          id: (++id).toString(),
          name: 'Child_' + i + '_' + j,
          item: { name: 'superitem' },
          children: [{
            id: 'item',
            name: 'child',
            item: 'childwubwubwid',
            selected: false,
            disabled: true
          }]
        });
      }

      roots.push({
        id: (++id).toString(),
        name: 'Root_' + i,
        children: children,
        item: 'Root',
        expanded: true
      });
    }

    return {
      id: (++id).toString(),
      name: 'All',
      children: roots,
      item: 'All',
      expanded: true
    };
  }

  private onNameClick(item: NodeItem<any>) {
    console.log(item);
  }

  private onSelect(item: NodeItem<any>) {
    console.log('select');
  }

  private onUnselect(item: NodeItem<any>) {
    console.log('unselect');
  }

  SelectedItem(item: any) {

    console.log(item);
  }
}
