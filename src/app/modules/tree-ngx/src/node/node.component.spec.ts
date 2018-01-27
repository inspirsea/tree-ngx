import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeComponent } from './node.component';
import { NodeItem } from '../model/node-item';
import { NodeSelectedState } from '../model/node-selected-state';
import { TreeService } from '../service/tree-service';
import { TreeMode } from '../model/tree-mode';
import { TreeOptions } from '../model/tree-options';

describe('NodeInsComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

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
      declarations: [NodeComponent],
      providers: [TreeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
    component.nodeItem = {
      id: '1',
      name: 'test',
      item: 'testItem',
      children: [
        {
          id: '2',
          name: 'test1',
          item: 'child1',
        },
        {
          id: '3',
          name: 'test2',
          item: 'child2',
        }
      ]
    } as NodeItem<string>;

    component.options = {
      mode: TreeMode.MultiSelect,
      checkboxes: true
    };

    fixture.detectChanges();
    component.ngOnChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Toggle', () => {

    fixture.detectChanges();

    component.toggleSelected();

    fixture.detectChanges();

    expect(component.selected).toEqual(true);
    expect(component.selectedState).toEqual(NodeSelectedState.checked);
  });

  it('Callback was called on toggle', () => {

    fixture.detectChanges();

    let selectCount = 0;
    let unselectCount = 0;

    component.callbacks = {
      nameClick: (item) => { item.name = 'callbackCalled'; },
      select: () => { selectCount++; },
      unSelect: () => { unselectCount++; },
    };

    component.toggleSelected();

    expect(selectCount).toEqual(1);
    expect(unselectCount).toEqual(0);

    component.toggleSelected();

    expect(selectCount).toEqual(1);
    expect(unselectCount).toEqual(1);

    component.onNameClick();

    expect(component.nodeItem.name).toEqual('callbackCalled');

  });

  it('Single select', () => {

    component.options = singleCheckbox;

    component.ngOnChanges();

    fixture.detectChanges();

    expect(component.nodeCheckbox).toBeDefined();
    
  });

  it('Multi select, no checkbox shown', () => {

    component.options = multi;

    component.ngOnChanges();

    fixture.detectChanges();

    expect(component.nodeCheckbox).toBeUndefined();
    
  });
});
