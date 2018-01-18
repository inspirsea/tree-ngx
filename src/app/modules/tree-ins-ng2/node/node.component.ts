import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList, TemplateRef } from '@angular/core';
import { NodeItem } from '../model/node-item';
import { Observable } from 'rxjs/Observable';
import { NodeSelectedState } from '../model/node-selected-state';
import { TreeService } from '../service/tree-service';
import { TreeCallbacks } from '../model/tree-callbacks';
import { TreeOptions } from '../model/tree-options';
import { TreeMode } from '../model/tree-mode';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'node',
  templateUrl: './node.component.html'
})
export class NodeComponent implements OnInit, OnChanges {

  @ViewChild('nodeCheckbox') nodeCheckbox: ElementRef;
  @ViewChildren('nodeChild') nodeChildren: QueryList<NodeComponent>;

  @Input() nodeItem: NodeItem<any>;
  @Input() parent: NodeComponent;
  @Input() nodeNameTemplate: TemplateRef<any>;
  @Input() callbacks: TreeCallbacks = {};
  @Input() options: TreeOptions;

  public _this = this;
  public collapsed = false;
  public markSelected = false;
  public collapseVisible;
  public selectedState: NodeSelectedState = NodeSelectedState.unChecked;
  public selected: boolean;
  public showCheckBox: boolean;

  constructor(private treeService: TreeService) { }

  ngOnInit() {
    this.setCollapseVisible();
  }

  ngOnChanges() {
    this.setCheckBoxVisible();
    this.setMarkSelected();
  }

  public toggleSelected() {
    if (this.selectedState === NodeSelectedState.unChecked) {
      if (this.options.mode === TreeMode.SingleSelect) {
        this.treeService.clear();
      }
      this.setChecked(true);
    } else if (this.selectedState === NodeSelectedState.checked || this.selectedState === NodeSelectedState.indeterminate) {
      this.setUnchecked(true);
    }

    if (this.parent) {
      this.parent.childStateChanged();
    }
  }

  public childStateChanged() {
    if (this.anyChildSelected()) {
      if (this.allChildrenSelected()) {
        this.setChecked(false);
      } else {
        this.setIndeterminate();
      }
    } else {
      this.setUnchecked(false);
    }

    if (this.parent) {
      this.parent.childStateChanged();
    }
  }

  public onNameClick() {
    if (this.callbacks.nameClick) {
      this.callbacks.nameClick(this.nodeItem);
    }

    if (this.canToggleChildrenOnName()) {
      this.toggleSelected();
    }
  }

  private setUnchecked(propagate: boolean) {
    this.selectedState = NodeSelectedState.unChecked;
    this.selected = false;

    this.setIndeterminateClass(false);

    if (this.callbacks.unSelect) {
      this.callbacks.unSelect(this.nodeItem);
    }

    if (!this.nodeItem.children) {
      this.treeService.unSelect(this.nodeItem.item, this);
    }

    if (propagate === true) {
      for (let child of this.nodeChildren.toArray()) {
        child.setUnchecked(propagate);
      }
    }
  }

  private setChecked(propagate: boolean) {
    this.selectedState = NodeSelectedState.checked;
    this.selected = true;
    this.setIndeterminateClass(false);

    if (this.callbacks.select) {
      this.callbacks.select(this.nodeItem);
    }

    if (!this.nodeItem.children) {
      this.treeService.select(this.nodeItem.item, this);
    }

    if (propagate === true) {
      for (let child of this.nodeChildren.toArray()) {
        child.setChecked(propagate);
      }
    }
  }

  private setIndeterminate() {
    this.selectedState = NodeSelectedState.indeterminate;
    this.selected = true;
    this.setIndeterminateClass(true);
  }

  private setIndeterminateClass(value: boolean) {
    if (this.showCheckBox === true) {
      this.nodeCheckbox.nativeElement.indeterminate = value;
    }
  }

  private anyChildSelected(): boolean {
    return this.nodeChildren.find(it => {
      return it.selectedState === NodeSelectedState.checked || it.selectedState === NodeSelectedState.indeterminate;
    }) != null ? true : false;
  }

  private allChildrenSelected() {
    return this.nodeChildren.toArray().every(it => it.selectedState === NodeSelectedState.checked);
  }

  private canToggleChildrenOnName() {
    if (this.options.checkboxes === false) {
      if (this.options.mode === TreeMode.SingleSelect && !this.nodeItem.children) {
        return true;
      } else if (this.options.mode === TreeMode.MultiSelect) {
        return true;
      }
    }

    return false;
  }

  private setCollapseVisible() {
    if (this.nodeItem.children) {
      if (this.nodeItem.children.length > 0) {
        this.collapseVisible = true;
      } else {
        this.collapseVisible = false;
      }
    }
  }

  private setCheckBoxVisible() {

    if (this.nodeItem.children && this.options.mode === TreeMode.SingleSelect
      || !this.options.checkboxes) {
      this.showCheckBox = false;
    } else {
      this.showCheckBox = true;
    }
  }

  private setMarkSelected() {
    if (!this.nodeItem.children && !this.options.checkboxes) {
      this.markSelected = true;
    } else {
      this.markSelected = false;
    }
  }

}
