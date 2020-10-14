import {
  Directive,
  AfterContentChecked,
  ElementRef,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  Input,
  HostBinding,
} from '@angular/core';
import { timer, Subscription, Subject } from 'rxjs';

@Directive({
  selector: '[ngcAngularCollision]',
  exportAs: 'ngcAngularCollision',
})
export class AngularCollisionDirective
  implements OnInit, AfterContentChecked, OnDestroy {
  @Input() public disableInterval: boolean; // TODO add to config
  @Input() public intervalTime: number = 100; // TODO add to config
  @Input() public customEvents: string[];

  @Output() public rectangleChange: EventEmitter<DOMRect> = new EventEmitter();

  @HostBinding('class.collision') public collisionActive: boolean;

  public rectangleChange$: Subject<DOMRect> = new Subject();
  public destroy$: Subject<void> = new Subject();
  public id: number;

  private timerSubscription: Subscription;
  private active: boolean = false;
  private static uid: number = 0;

  constructor(public element: ElementRef) {
    this.id = AngularCollisionDirective.uid++;
  }

  public ngOnInit(): void {}

  public ngAfterContentChecked(): void {
    if (this.active) {
      this.checkPosition();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe();
    this.destroy$.next();
  }

  public updateCollisionState(collisionActive: boolean): void {
    this.collisionActive = collisionActive;
  }

  public checkPosition(): void {
    const boundingRect: DOMRect = this.element.nativeElement.getBoundingClientRect();

    this.rectangleChange$.next(boundingRect);
    this.rectangleChange.emit(boundingRect);
  }

  public startTracking(): void {
    this.active = true;

    if (!this.disableInterval) {
      this.timerSubscription = timer(0, this.intervalTime).subscribe(() => {
        this.checkPosition();
      });
    }
  }

  public stopTracking(): void {
    this.active = false;
    this.unsubscribe();
  }

  public unsubscribe(): void {
    if (!this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
    }
  }
}
