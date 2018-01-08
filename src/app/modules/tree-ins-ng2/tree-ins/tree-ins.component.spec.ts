import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeInsComponent } from './tree-ins.component';

describe('TreeInsComponent', () => {
  let component: TreeInsComponent;
  let fixture: ComponentFixture<TreeInsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeInsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
