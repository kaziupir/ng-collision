import { Injectable, Optional, QueryList } from '@angular/core';
import { AngularCollisionDirective } from './angular-collision.directive';

export class NgcConfig {}

@Injectable({
  providedIn: 'root',
})
export class AngularCollisionService {
  /**
   *  Tracked elements ids
   */
  public trackedElements: number[] = [];

  constructor(@Optional() config?: NgcConfig) {}

  /**
   * Start tracking element / elements
   *
   * @param elements
   */
  public register(
    elements:
      | QueryList<AngularCollisionDirective>
      | AngularCollisionDirective
      | AngularCollisionDirective[]
  ): void {
    if (Array.isArray(elements) || elements instanceof QueryList) {
      elements.forEach((element) => {
        this.addTrackedElement(element);
      });
    } else {
      this.addTrackedElement(elements);
    }
  }

  /**
   * Stop tracking element / elements
   *
   * @param elements
   */
  public remove(
    elements:
      | QueryList<AngularCollisionDirective>
      | AngularCollisionDirective
      | AngularCollisionDirective[]
  ): void {
    if (Array.isArray(elements) || elements instanceof QueryList) {
      elements.forEach((element) => {
        this.removeTrackedElement(element);
      });
    } else {
      this.removeTrackedElement(elements);
    }
  }

  private addTrackedElement(element: AngularCollisionDirective): void {
    if (!this.trackedElements.includes(element.id)) {
      element.startTracking();
      this.trackedElements.push(element.id);
    }
  }

  private removeTrackedElement(element: AngularCollisionDirective): void {
    element.stopTracking();
    this.trackedElements = this.trackedElements.filter(
      (trackedElement) => trackedElement !== element.id
    );
  }
}
