import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeInsComponent } from './node-ins.component';

describe('NodeInsComponent', () => {
  let component: NodeInsComponent;
  let fixture: ComponentFixture<NodeInsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeInsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
