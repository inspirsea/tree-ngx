import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeInsComponent } from './tree-ins/tree-ins.component';
import { NodeInsComponent } from './node-ins/node-ins.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TreeInsComponent,
    NodeInsComponent
  ],
  exports: [
    TreeInsComponent
  ]
})
export class TreeInsNg2Module { }
