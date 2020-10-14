import { Injectable, Optional, QueryList } from '@angular/core';
import { AngularCollisionDirective } from './angular-collision.directive';

export class AngularCollisionConfig {}

@Injectable({
  providedIn: 'root',
})
export class AngularCollisionService {
  public trackedElements: number[] = [];

  constructor(@Optional() config?: AngularCollisionConfig) {}

  public register(
    elements:
      | QueryList<AngularCollisionDirective>
      | AngularCollisionDirective
      | AngularCollisionDirective[]
  ): void {
    if (Array.isArray(elements) || elements instanceof QueryList) {
      elements.forEach((element) => {
        element.startTracking();
        this.addTrackedElement(element);
      });
    } else {
      elements.startTracking();
      this.addTrackedElement(elements);
    }
  }

  public remove(
    elements:
      | QueryList<AngularCollisionDirective>
      | AngularCollisionDirective
      | AngularCollisionDirective[]
  ): void {
    if (Array.isArray(elements) || elements instanceof QueryList) {
      elements.forEach((element) => {
        element.stopTracking();
        this.removeTrackedElement(element);
      });
    } else {
      elements.stopTracking();
      this.removeTrackedElement(elements);
    }
  }

  public addTrackedElement(element: AngularCollisionDirective): void {
    if (!this.trackedElements.includes(element.id)) {
      this.trackedElements.push(element.id);
    }
  }

  public removeTrackedElement(element: AngularCollisionDirective): void {
    this.trackedElements = this.trackedElements.filter(
      (trackedElement) => trackedElement !== element.id
    );
  }
}
