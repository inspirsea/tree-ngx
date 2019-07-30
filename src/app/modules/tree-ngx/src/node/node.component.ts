import { Component, OnChanges, ElementRef, ViewChild, Input, TemplateRef, SimpleChanges, AfterViewInit } from '@angular/core';
import { NodeState } from '../model/node-state';
import { NodeSelectedState } from '../model/node-selected-state';
import { TreeService } from '../service/tree-service';


@Component({
  selector: 'node',
  templateUrl: './node.component.html'
})
export class NodeComponent implements OnChanges, AfterViewInit {

  @ViewChild('nodeCheckbox', { static: false }) nodeCheckbox: ElementRef;

  @Input() state: NodeState;
  @Input() selectedState: NodeSelectedState;
  @Input() nodeNameTemplate: TemplateRef<any>;
  @Input() nodeCollapsibleTemplate: TemplateRef<any>;

  public _this = this;

  constructor(public treeService: TreeService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedState) {
      this.selectedStateChanged();
    }
  }

  ngAfterViewInit() {
    this.selectedStateChanged();
  }

  private selectedStateChanged() {
    if (this.nodeCheckbox) {
      if (this.selectedState === NodeSelectedState.indeterminate) {
        this.nodeCheckbox.nativeElement.indeterminate = true;
      } else {
        this.nodeCheckbox.nativeElement.indeterminate = false;
      }

      if (this.selectedState === NodeSelectedState.checked) {
        this.nodeCheckbox.nativeElement.checked = true;
      } else if (this.selectedState === NodeSelectedState.unChecked) {
        this.nodeCheckbox.nativeElement.checked = false;
      }
    }
  }

  public checkBoxClick() {
    this.treeService.checkBoxClick(this.state);

    setTimeout(() => {
      this.treeService.reEvaluateSelectedState(this.state);
    }, 1);
  }
}
