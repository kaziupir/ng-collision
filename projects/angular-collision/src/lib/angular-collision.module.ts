import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularCollisionDirective } from './angular-collision.directive';
import { AngularCollisionConfig } from './angular-collision.service';

@NgModule({
  declarations: [AngularCollisionDirective],
  exports: [AngularCollisionDirective],
})
export class AngularCollisionModule {
  static forRoot(
    config: AngularCollisionConfig
  ): ModuleWithProviders<AngularCollisionModule> {
    return {
      ngModule: AngularCollisionModule,
      providers: [{ provide: AngularCollisionConfig, useValue: config }],
    };
  }
}
