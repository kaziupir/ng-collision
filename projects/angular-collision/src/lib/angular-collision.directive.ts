import {
  Directive,
  AfterContentChecked,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  HostBinding,
} from '@angular/core';
import { timer, Subscription, Subject } from 'rxjs';

// TODO: move to files
export interface NgcElementChange {
  domRect: DOMRect;
  element: AngularCollisionDirective;
}

// TODO: move to files
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
  @Input() public disableInterval: boolean; // TODO add to config
  @Input() public intervalTime: number = 100; // TODO add to config
  @Input() public customEvents: string[];

  @Output() public rectangleChange: EventEmitter<
    NgcElementChange
  > = new EventEmitter();
  @Output() public collisionActiveChange: EventEmitter<
    NgcCollisionChange
  > = new EventEmitter();

  @HostBinding('class.collision') public collisionActive: boolean;

  public rectangleChange$: Subject<NgcElementChange> = new Subject();
  public destroy$: Subject<number> = new Subject();
  public id: number;

  private timerSubscription: Subscription;
  private active: boolean = false;
  private static uid: number = 0;

  constructor(public element: ElementRef) {
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
