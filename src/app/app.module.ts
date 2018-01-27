import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TreeNgxModule, TreeInsComponent } from './modules/tree-ngx';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TreeNgxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
