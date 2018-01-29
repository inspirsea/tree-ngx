import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  TemplateRef,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { NodeItem } from '../model/node-item';
import { Observable } from 'rxjs/Observable';
import { NodeSelectedState } from '../model/node-selected-state';
import { TreeService } from '../service/tree-service';
import { TreeCallbacks } from '../model/tree-callbacks';
import { TreeOptions } from '../model/tree-options';
import { TreeMode } from '../model/tree-mode';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NodeState } from '../model/node-state';

@Component({
  selector: 'node',
  templateUrl: './node.component.html'
})
export class NodeComponent implements OnChanges {

  @ViewChild('nodeCheckbox') nodeCheckbox: ElementRef;

  @Input() state: NodeState;
  @Input() selectedState: NodeSelectedState;
  @Input() parent: NodeComponent;
  @Input() nodeNameTemplate: TemplateRef<any>;
  @Input() callbacks: TreeCallbacks = {};
  @Input() options: TreeOptions;

  public _this = this;

  constructor(private treeService: TreeService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedState) {
      this.selectedStateChanged();
    }
  }

  private selectedStateChanged() {
    if (this.nodeCheckbox) {
      if (this.selectedState === NodeSelectedState.indeterminate) {
        this.nodeCheckbox.nativeElement.indeterminate = true;
      } else {
        this.nodeCheckbox.nativeElement.indeterminate = false;
      }
    }
  }

  public toggleSelected() {
    this.treeService.toggleSelected(this.state);
  }

  public nameClick() {
    this.treeService.nameClick(this.state);
  }

  public delete() {
    this.treeService.deleteByState(this.state);
  }
}
