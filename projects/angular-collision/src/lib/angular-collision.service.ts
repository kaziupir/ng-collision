import { Injectable, Optional } from '@angular/core';

export class AngularCollisionConfig {}

@Injectable({
  providedIn: 'root',
})
export class AngularCollisionService {
  constructor(@Optional() config?: AngularCollisionConfig) {}
}
