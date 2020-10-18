import {
  Directive,
  AfterContentChecked,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  HostBinding,
  Optional,
} from '@angular/core';
import { timer, Subscription, Subject } from 'rxjs';
import { NgcConfig } from './models/ngc-config.model';

/**
 * Object containing changed element's domRect and element itself
 */
export interface NgcElementChange {
  domRect: DOMRect;
  element: AngularCollisionDirective;
}

/**
 * Object with info about element's collisions
 */
export interface NgcCollisionChange {
  id: number;
  active: boolean;
  collidedElements: AngularCollisionDirective[];
}

@Directive({
  selector: '[ngcAngularCollision]',
  exportAs: 'ngcAngularCollision',
})
export class AngularCollisionDirective
  implements AfterContentChecked, OnDestroy {
  /**
   * Disable interval position checking
   */
  @Input() public disableInterval: boolean;

  /**
   * Interval time for position checking
   */
  @Input() public intervalTime: number = 100;

  /**
   * Element's position changes
   */
  @Output() public rectangleChange: EventEmitter<
    NgcElementChange
  > = new EventEmitter();

  /**
   * Element's collision changes
   */
  @Output() public collisionActiveChange: EventEmitter<
    NgcCollisionChange
  > = new EventEmitter();

  @HostBinding('class.collision') private collisionActive: boolean;

  /**
   * Element's collision changes as observable, same as output
   */
  public rectangleChange$: Subject<NgcElementChange> = new Subject();

  /**
   * Observable that emits on instance destroy
   */
  public destroy$: Subject<number> = new Subject();

  /**
   * Unique id for directive instance
   */
  public id: number;

  /**
   * True if element has any collision
   */
  public collision: boolean;

  private timerSubscription: Subscription;
  private active: boolean = false;
  private static uid: number = 0;

  constructor(public element: ElementRef, @Optional() config?: NgcConfig) {
    this.id = AngularCollisionDirective.uid++;
  }

  public ngAfterContentChecked(): void {
    if (this.active) {
      this.checkPosition();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe();
    this.destroy$.next(this.id);
  }

  /**
   * Update collision status
   *
   * @param active
   * @param collidedIds
   */
  public updateCollisionState(
    active: boolean,
    collidedElements: AngularCollisionDirective[]
  ): void {
    this.collisionActive = active;
    this.collision = active;
    this.collisionActiveChange.emit({ id: this.id, active, collidedElements });
  }

  /**
   * Check and emit element position
   */
  public checkPosition(): void {
    const domRect: DOMRect = this.element.nativeElement.getBoundingClientRect();

    this.rectangleChange$.next({ domRect, element: this });
    this.rectangleChange.emit({ domRect, element: this });
  }

  /**
   * Start tracking element
   */
  public startTracking(): void {
    this.active = true;

    if (!this.disableInterval) {
      this.timerSubscription = timer(0, this.intervalTime).subscribe(() => {
        this.checkPosition();
      });
    }
  }

  /**
   * Stop tracking element
   */
  public stopTracking(): void {
    this.active = false;
    this.updateCollisionState(false, []);
    this.unsubscribe();
  }

  /**
   * Unsubscribe timer observable
   */
  public unsubscribe(): void {
    if (this.timerSubscription && !this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
    }
  }
}
