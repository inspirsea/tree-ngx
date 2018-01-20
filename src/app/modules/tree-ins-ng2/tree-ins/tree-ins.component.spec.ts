import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeInsComponent } from './tree-ins.component';
import { TreeService } from '../service/tree-service';
import { NodeComponent } from '../node/node.component';
import { TreeMode } from '../model/tree-mode';
import { TreeOptions } from '../model/tree-options';

describe('TreeInsComponent', () => {
  let component: TreeInsComponent;
  let fixture: ComponentFixture<TreeInsComponent>;

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
      declarations: [TreeInsComponent, NodeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeInsComponent);
    component = fixture.componentInstance;

    component.nodeItems = [{
      id: '1',
      name: 'test1',
      item: 'root',
      children: [{
        id: '2',
        name: 'child',
        item: 'item1',
        children: [{
          id: '3',
          name: 'child',
          item: 'item1'
        }]
      },
      {
        id: '4',
        name: 'test2',
        item: 'root2'
      }]
    }];

    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('DefaultOptions is set', () => {
    expect(component.options).toBeDefined();
    expect(component.options.mode).toBeDefined();
    expect(component.options.checkboxes).toBeDefined();
  });

  it('Connect', () => {

    let service = fixture.debugElement.injector.get(TreeService);
    service.select(component.nodeItems[0].children[0].item, new NodeComponent(service));

    let hasBeenCalled;
    component.connect().subscribe(it => {
      expect(it[0]).toEqual(component.nodeItems[0].children[0].item);
      hasBeenCalled = true;
    });

    expect(hasBeenCalled).toBeTruthy();
  });

  it('AddNodeById, multiCheckbox', () => {

    let service = fixture.debugElement.injector.get(TreeService);

    component.options = multiCheckbox;

    fixture.detectChanges();

    let testItem = { name: 'test', id: '10', item: 'test' };
    component.addNodeById({ name: 'test', id: '10', item: 'test' }, '2');
    fixture.detectChanges();

    expect(component.nodeItems[0].children[0].children[1] === testItem);
  });

  it('AddNodeById, singleCheckbox', () => {

    let service = fixture.debugElement.injector.get(TreeService);

    component.options = singleCheckbox;

    fixture.detectChanges();

    let testItem = { name: 'test', id: '10', item: 'test' };
    component.addNodeById({ name: 'test', id: '10', item: 'test' }, '2');
    fixture.detectChanges();

    expect(component.nodeItems[0].children[0].children[1] === testItem);
  });

  it('AddNodeById, multi', () => {

    let service = fixture.debugElement.injector.get(TreeService);

    component.options = multi;

    fixture.detectChanges();

    let testItem = { name: 'test', id: '10', item: 'test' };
    component.addNodeById({ name: 'test', id: '10', item: 'test' }, '2');
    fixture.detectChanges();

    expect(component.nodeItems[0].children[0].children[1] === testItem);
  });

  it('AddNodeById, single', () => {

    let service = fixture.debugElement.injector.get(TreeService);

    component.options = single;

    fixture.detectChanges();

    let testItem = { name: 'test', id: '10', item: 'test' };
    component.addNodeById({ name: 'test', id: '10', item: 'test' }, '2');
    fixture.detectChanges();

    expect(component.nodeItems[0].children[0].children[1] === testItem);
  });
});
