import { Injectable, OnDestroy, Optional, QueryList } from '@angular/core';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import {
  AngularCollisionDirective,
  NgcElementChange,
} from './angular-collision.directive';

export class NgcConfig {}

export interface NgcTrackedElement {
  id: number;
  subscription: Subscription;
}

@Injectable({
  providedIn: 'root',
})
export class AngularCollisionService implements OnDestroy {
  /**
   *  Tracked elements ids
   */
  public trackedElements: NgcTrackedElement[] = [];

  /**
   *  Map of tracked elements positions
   */
  public trackedElementsPositions: Map<number, NgcElementChange> = new Map();

  /**
   *  Observable wrapper of tracked elements positions
   */
  public trackedElementsPositions$: Subject<
    Map<number, NgcElementChange>
  > = new Subject();

  public trackedElementsPositionSubscription: Subscription;

  constructor(@Optional() config?: NgcConfig) {
    this.trackedElementsPositionSubscription = this.trackedElementsPositions$
      .pipe(throttleTime(100))
      .subscribe((elementsMap: Map<number, NgcElementChange>) => {
        // TODO work on performance
        elementsMap.forEach((element: NgcElementChange, id: number) => {
          const collisions: AngularCollisionDirective[] = [];

          elementsMap.forEach(
            (innerElement: NgcElementChange, innerId: number) => {
              if (
                id !== innerId &&
                this.checkElementsCollision(
                  element.domRect,
                  innerElement.domRect
                )
              ) {
                collisions.push(innerElement.element);
              }
            }
          );

          element.element.updateCollisionState(
            collisions.length > 0,
            collisions
          );
        });
      });
  }

  public ngOnDestroy(): void {
    if (!this.trackedElementsPositionSubscription.closed) {
      this.trackedElementsPositionSubscription.unsubscribe();
    }
  }

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

  /**
   * Checks collisions between two elements
   *
   * @param first
   * @param second
   */
  private checkElementsCollision(first: DOMRect, second: DOMRect): boolean {
    return (
      ((first.top <= second.bottom && first.top >= second.top) ||
        (first.bottom <= second.bottom && first.bottom >= second.top) ||
        (first.top <= second.top && first.bottom >= second.bottom)) &&
      ((first.left >= second.left && first.left <= second.right) ||
        (first.right <= second.right && first.right >= second.left) ||
        (first.left <= second.left && first.right >= second.right))
    );
  }

  /**
   * Init tracking of element
   *
   * @param element
   */
  private addTrackedElement(element: AngularCollisionDirective): void {
    if (!this.trackedElements.some((el) => el.id == element.id)) {
      element.startTracking();
      const subscription = element.rectangleChange$
        .pipe(takeUntil(element.destroy$))
        .subscribe((change: NgcElementChange) => {
          this.trackedElementsPositions.set(change.element.id, change);
          this.trackedElementsPositions$.next(this.trackedElementsPositions);
        });
      this.trackedElements.push({ id: element.id, subscription });
    }
  }

  /**
   * Finish tracking of element
   *
   * @param element
   */
  private removeTrackedElement(element: AngularCollisionDirective): void {
    element.stopTracking();

    this.trackedElementsPositions.delete(element.id);
    this.trackedElementsPositions$.next(this.trackedElementsPositions);

    const foundElement = this.trackedElements.find(
      (trackedElement) => trackedElement.id === element.id
    );

    if (foundElement?.subscription && !foundElement.subscription.closed) {
      foundElement.subscription.unsubscribe();
    }

    this.trackedElements = this.trackedElements.filter(
      (trackedElement) => trackedElement.id !== element.id
    );
  }
}
