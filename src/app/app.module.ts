import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TreeInsComponent } from './modules/tree-ins-ng2/tree-ins/tree-ins.component';
import { TreeInsNg2Module } from './modules/tree-ins-ng2/tree-ins-ng2.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    TreeInsNg2Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }