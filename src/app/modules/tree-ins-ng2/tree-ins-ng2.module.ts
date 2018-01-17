import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeInsComponent } from './tree-ins/tree-ins.component';
import { NodeComponent } from './node/node.component';
import { TreeService } from './service/tree-service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TreeInsComponent,
    NodeComponent
  ],
  exports: [
    TreeInsComponent
  ],
  providers: [
    TreeService
  ]
})
export class TreeInsNg2Module { }
