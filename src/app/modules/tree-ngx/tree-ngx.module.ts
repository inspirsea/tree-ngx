import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeInsComponent } from './src/tree-ngx/tree-ngx.component';
import { NodeComponent } from './src//node/node.component';
import { TreeService } from './src//service/tree-service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TreeInsComponent,
    NodeComponent,
  ],
  providers: [
    TreeService
  ],
  exports: [
    TreeInsComponent
  ]
})
export class TreeNgxModule { }
