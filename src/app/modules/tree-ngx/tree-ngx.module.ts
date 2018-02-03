import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNgxComponent } from './src/tree-ngx/tree-ngx.component';
import { NodeComponent } from './src//node/node.component';
import { TreeService } from './src//service/tree-service';
import { NodeNameComponent } from './src/node-name/node-name.component';
import { NodeIconWrapperComponent } from './src/node-icon-wrapper/node-icon-wrapper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TreeNgxComponent,
    NodeComponent,
    NodeNameComponent,
    NodeIconWrapperComponent,
  ],
  providers: [
    TreeService
  ],
  exports: [
    TreeNgxComponent
  ]
})
export class TreeNgxModule { }
