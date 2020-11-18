import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularCollisionModule, NgcConfig } from 'angular-collision';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularCollisionModule.forRoot(new NgcConfig(true)),
    DragDropModule,
    CommonModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
