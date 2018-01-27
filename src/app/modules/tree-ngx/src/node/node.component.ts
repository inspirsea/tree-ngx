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
  OnDestroy
} from '@angular/core';
import { NodeItem } from '../model/node-item';
import { Observable } from 'rxjs/Observable';
import { NodeSelectedState } from '../model/node-selected-state';
import { TreeService } from '../service/tree-service';
import { TreeCallbacks } from '../model/tree-callbacks';
import { TreeOptions } from '../model/tree-options';
import { TreeMode } from '../model/tree-mode';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'node',
  templateUrl: './node.component.html'
})
export class NodeComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('nodeCheckbox') nodeCheckbox: ElementRef;
  @ViewChildren('nodeChild') nodeChildren: QueryList<NodeComponent>;

  @Input() nodeItem: NodeItem<any>;
  @Input() parent: NodeComponent;
  @Input() nodeNameTemplate: TemplateRef<any>;
  @Input() callbacks: TreeCallbacks = {};
  @Input() options: TreeOptions;

  public _this = this;
  public expanded = true;
  public markSelected = false;
  public collapseVisible;
  public selectedState: NodeSelectedState = NodeSelectedState.unChecked;
  public selected: boolean;
  public showCheckBox: boolean;
  public filteredChildren: NodeItem<any>[];
  private filterChangeSubscription: Subscription;

  constructor(private treeService: TreeService) { }

  ngOnInit() {
    this.connectToFilterOnChange();
    this.setCollapseVisible();
    this.setInitialExpandedValue(this.nodeItem.expanded);
  }

  ngOnChanges() {
    this.setCheckBoxVisible();
    this.setMarkSelected();
  }

  ngOnDestroy() {
    if (this.filterChangeSubscription) {
      this.filterChangeSubscription.unsubscribe();
    }
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

  public deleteChild(nodeContext: NodeComponent) {
    this.treeService.deleteSubTree(this, nodeContext);
    this.applyFilter();
  }

  public delete() {
    if (this.parent) {
      this.parent.deleteChild(this);
    } else {
      this.treeService.deleteRoot(this.nodeItem);
    }
  }

  public add(nodeItem: NodeItem<any>) {
    this.nodeItem.children.push(nodeItem);
    this.applyFilter();
  }

  private setUnchecked(propagate: boolean) {
    this.selectedState = NodeSelectedState.unChecked;
    this.selected = false;

    this.setIndeterminateClass(false);

    if (this.callbacks.unSelect) {
      this.callbacks.unSelect(this.nodeItem);
    }

    if (!this.nodeItem.children) {
      this.treeService.unSelect(this);
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
    return this.nodeChildren.toArray().every(it => it.selectedState === NodeSelectedState.checked)
      && this.nodeChildren.length === this.nodeItem.children.length;
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

  private setInitialExpandedValue(value: boolean) {
    if (value != null) {
      this.expanded = value;
    }
  }

  private connectToFilterOnChange() {
    if (this.nodeItem.children) {
      this.filterChangeSubscription = this.treeService.connectFilterOnChange().subscribe(() => {
        this.applyFilter();
      });
    }
  }

  private applyFilter() {
    this.filteredChildren = this.filter(this.nodeItem.children, this.treeService.getFilter());
  }

  private filter(items: NodeItem<any>[], value: string) {
    return items.filter(it => (it.children && it.children.length > 0) || value === '' || it.name.toLowerCase().indexOf(value) !== -1);
  }
}
