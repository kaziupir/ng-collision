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
  OnChanges,
  SimpleChanges,
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
  implements OnChanges, AfterContentChecked, OnDestroy {
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

  private _timerSubscription: Subscription;
  private _active: boolean = false;
  private _intervalTime: number;
  private _disableInterval: boolean;
  private static _uid: number = 0;

  constructor(public element: ElementRef, @Optional() config?: NgcConfig) {
    this.id = AngularCollisionDirective._uid++;
    if (config) {
      this._intervalTime = config.intervalTime;
      this._disableInterval = config.disableInterval;
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.intervalTime) {
      this._intervalTime = changes.intervalTime.currentValue;
    }

    if (changes.disableInterval) {
      this._disableInterval = changes.disableInterval.currentValue;
    }
  }

  public ngAfterContentChecked(): void {
    if (this._active) {
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
    this._active = true;

    if (!this._disableInterval) {
      this._timerSubscription = timer(0, this._intervalTime).subscribe(() => {
        this.checkPosition();
      });
    }
  }

  /**
   * Stop tracking element
   */
  public stopTracking(): void {
    this._active = false;
    this.updateCollisionState(false, []);
    this.unsubscribe();
  }

  /**
   * Unsubscribe timer observable
   */
  public unsubscribe(): void {
    if (this._timerSubscription && !this._timerSubscription.closed) {
      this._timerSubscription.unsubscribe();
    }
  }
}
