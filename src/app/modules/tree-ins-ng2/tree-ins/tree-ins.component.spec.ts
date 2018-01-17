import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeInsComponent } from './tree-ins.component';
import { TreeService } from '../service/tree-service';
import { NodeComponent } from '../node/node.component';
import { TreeMode } from '../model/tree-mode';

describe('TreeInsComponent', () => {
  let component: TreeInsComponent;
  let fixture: ComponentFixture<TreeInsComponent>;

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
      name: 'test1',
      item: 'root',
      children: [{
        name: 'child',
        item: 'item1'
      }]
    },
    {
      name: 'test2',
      item: 'root2'
    }];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaultOptions should be set', () => {
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
});
