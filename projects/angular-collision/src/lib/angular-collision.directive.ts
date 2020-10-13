import {
  Directive,
  AfterContentChecked,
  ElementRef,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { timer, Subscription } from 'rxjs';

@Directive({
  selector: '[ngcAngularCollision]',
})
export class AngularCollisionDirective
  implements OnInit, AfterContentChecked, OnDestroy {
  @Input() public disableInterval: boolean; // TODO add to config
  @Input() public intervalTime: number = 100; // TODO add to config
  @Output() public rectChange: EventEmitter<DOMRect> = new EventEmitter();

  private timerSubscription: Subscription;

  constructor(private element: ElementRef) {}

  public ngOnInit(): void {
    if (!this.disableInterval) {
      this.timerSubscription = timer(0, this.intervalTime).subscribe(() => {
        this.checkPosition();
      });
    }
  }

  public ngAfterContentChecked(): void {
    this.checkPosition();
  }

  public ngOnDestroy(): void {
    if (!this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
    }
  }

  public checkPosition(): void {
    this.rectChange.emit(this.element.nativeElement.getBoundingClientRect());
  }
}
