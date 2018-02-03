import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNgxComponent } from './tree-ngx.component';
import { TreeService } from '../service/tree-service';
import { NodeComponent } from '../node/node.component';
import { TreeMode } from '../model/tree-mode';
import { TreeOptions } from '../model/tree-options';
import { NodeIconWrapperComponent } from '../node-icon-wrapper/node-icon-wrapper.component';
import { NodeNameComponent } from '../node-name/node-name.component';
import { SimpleChanges } from '@angular/core';

fdescribe('TreeInsComponent', () => {
  let component: TreeNgxComponent;
  let fixture: ComponentFixture<TreeNgxComponent>;
  let service: TreeService;

  let multiCheckbox = {
    checkboxes: true,
    mode: TreeMode.MultiSelect
  } as TreeOptions;

  let singleCheckbox = {
    checkboxes: true,
    mode: TreeMode.MultiSelect
  } as TreeOptions;

  let multi = {
    checkboxes: false,
    mode: TreeMode.MultiSelect
  } as TreeOptions;

  let single = {
    checkboxes: false,
    mode: TreeMode.MultiSelect
  } as TreeOptions;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [TreeService],
      declarations: [TreeNgxComponent, NodeComponent, NodeIconWrapperComponent, NodeNameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNgxComponent);
    component = fixture.componentInstance;

    component.nodeItems = [{
      id: '1',
      name: 'test1',
      item: 'root',
      expanded: false,
      children: [{
        id: '2',
        name: 'child',
        item: 'item1',
        expanded: true,
        children: [{
          id: '3',
          name: 'child',
          item: 'item1',
          expanded: false,
        }]
      },
      {
        id: '4',
        name: 'test2',
        item: 'root2'
      }]
    }];

    service = fixture.debugElement.injector.get(TreeService);

    component.initialize();
    fixture.detectChanges();
    component.ngOnChanges({});
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('DefaultOptions is set', () => {
    expect(component.options).toBeDefined();
    expect(component.options.mode).toBeDefined();
    expect(component.options.checkboxes).toBeDefined();
  });

  it('AddNodeById, multiCheckbox', () => {
    component.options = multiCheckbox;

    fixture.detectChanges();

    let testItem = { name: 'test', id: '10', item: 'test' };
    component.addNodeById({ name: 'test', id: '10', item: 'test' }, '2');
    fixture.detectChanges();

    expect(component.nodeItems[0].children[0].children[1] === testItem);
  });

  it('AddNodeById, singleCheckbox', () => {
    component.options = singleCheckbox;

    fixture.detectChanges();

    let testItem = { name: 'test', id: '10', item: 'test' };
    component.addNodeById({ name: 'test', id: '10', item: 'test' }, '2');
    fixture.detectChanges();

    expect(component.nodeItems[0].children[0].children[1] === testItem);
  });

  it('AddNodeById, multi', () => {
    component.options = multi;

    fixture.detectChanges();

    let testItem = { name: 'test', id: '10', item: 'test' };
    component.addNodeById({ name: 'test', id: '10', item: 'test' }, '2');
    fixture.detectChanges();

    expect(component.nodeItems[0].children[0].children[1] === testItem);
  });

  it('AddNodeById, single', () => {

    component.options = single;

    fixture.detectChanges();

    let testItem = { name: 'test', id: '10', item: 'test' };
    component.addNodeById({ name: 'test', id: '10', item: 'test' }, '2');
    fixture.detectChanges();

    expect(component.nodeItems[0].children[0].children[1] === testItem);
  });

  it('CollapseAll', () => {

    component.collapseAll();
    fixture.detectChanges();

    expect(service.treeState[0].expanded).toBeFalsy();
    expect(service.treeState[0].children[0].expanded).toBeFalsy();

  });

  it('ExpandAll', () => {

    component.expandAll();
    fixture.detectChanges();

    expect(service.treeState[0].expanded).toBeTruthy();
    expect(service.treeState[0].children[0].expanded).toBeTruthy();
  });

  it('DeleteById', () => {

    expect(component.nodeItems[0].children[0].children.length).toEqual(1);

    component.deleteById('3');

    fixture.detectChanges();

    expect(component.nodeItems[0].children[0].children.length).toEqual(0);
  });
});
