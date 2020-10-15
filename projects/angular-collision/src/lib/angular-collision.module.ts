import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularCollisionDirective } from './angular-collision.directive';
import { NgcConfig } from './angular-collision.service';

@NgModule({
  declarations: [AngularCollisionDirective],
  exports: [AngularCollisionDirective],
})
export class AngularCollisionModule {
  static forRoot(
    config: NgcConfig
  ): ModuleWithProviders<AngularCollisionModule> {
    return {
      ngModule: AngularCollisionModule,
      providers: [{ provide: NgcConfig, useValue: config }],
    };
  }
}
