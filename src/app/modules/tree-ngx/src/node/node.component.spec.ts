import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeComponent } from './node.component';
import { NodeItem } from '../model/node-item';
import { NodeSelectedState } from '../model/node-selected-state';
import { TreeService } from '../service/tree-service';
import { TreeMode } from '../model/tree-mode';
import { TreeOptions } from '../model/tree-options';
import { TreeNgxComponent } from '../tree-ngx/tree-ngx.component';
import { NodeIconWrapperComponent } from '../node-icon-wrapper/node-icon-wrapper.component';
import { NodeNameComponent } from '../node-name/node-name.component';

fdescribe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  let multi = {
    checkboxes: false,
    mode: TreeMode.MultiSelect
  } as TreeOptions;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NodeComponent, NodeIconWrapperComponent, NodeNameComponent],
      providers: [TreeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;

    let service = fixture.debugElement.injector.get(TreeService);

    service.options = multi;

    component.state = {
      parent: null,
      children: [],
      filteredChildren: [],
      hasFilteredChildren: false,
      nodeItem: { id: '88', name: 'Grandchildren_0_8_0', item: 'gchild0_8_0', selected: true },
      expanded: true,
      markSelected: true,
      collapseVisible: false,
      selectedState: 1,
      selected: false,
      showCheckBox: false
    };

    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Toggle', () => {

    fixture.detectChanges();

    component.checkBoxClick();

    fixture.detectChanges();

    expect(component.state.selected).toEqual(true);
    expect(component.state.selectedState).toEqual(NodeSelectedState.checked);
  });
});
