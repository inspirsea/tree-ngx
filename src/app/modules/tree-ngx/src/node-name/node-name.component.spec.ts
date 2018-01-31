import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeNameComponent } from './node-name.component';

describe('NodeNameComponent', () => {
  let component: NodeNameComponent;
  let fixture: ComponentFixture<NodeNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
