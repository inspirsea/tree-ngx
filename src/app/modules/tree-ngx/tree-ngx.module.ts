import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeInsComponent } from './src/tree-ngx/tree-ngx.component';
import { NodeComponent } from './src//node/node.component';
import { TreeService } from './src//service/tree-service';
import { NodeNameComponent } from './src/node-name/node-name.component';
import { NodeIconWrapperComponent } from './src/node-icon-wrapper/node-icon-wrapper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TreeInsComponent,
    NodeComponent,
    NodeNameComponent,
    NodeIconWrapperComponent,
  ],
  providers: [
    TreeService
  ],
  exports: [
    TreeInsComponent
  ]
})
export class TreeNgxModule { }
