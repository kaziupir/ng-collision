import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  AngularCollisionModule,
  NgcConfig,
} from 'projects/angular-collision/src/public-api';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularCollisionModule.forRoot(new NgcConfig(true, 0)),
    DragDropModule,
    CommonModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
