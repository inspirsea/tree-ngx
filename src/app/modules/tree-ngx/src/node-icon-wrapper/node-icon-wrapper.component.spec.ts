import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeIconWrapperComponent } from './node-icon-wrapper.component';

describe('NodeIconWrapperComponent', () => {
  let component: NodeIconWrapperComponent;
  let fixture: ComponentFixture<NodeIconWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeIconWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeIconWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
