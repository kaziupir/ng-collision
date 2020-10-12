import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularCollisionModule } from 'projects/angular-collision/src/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, AngularCollisionModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
