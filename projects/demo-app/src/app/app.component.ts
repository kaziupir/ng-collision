import {
  Component,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { AngularCollisionService } from 'projects/angular-collision/src/lib/angular-collision.service';
import {
  AngularCollisionDirective,
  NgcCollisionChange,
  NgcElementChange,
} from 'projects/angular-collision/src/lib/angular-collision.directive';

interface Rectangle {
  name: RectanglesEnum;
  position: DOMRect;
}

enum RectanglesEnum {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
}

@Component({
  selector: 'ngc-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChildren(AngularCollisionDirective) elements: QueryList<
    AngularCollisionDirective
  >;

  public collisions: Map<number, NgcCollisionChange> = new Map();

  public rectangles: Rectangle[] = [
    {
      name: RectanglesEnum.ONE,
      position: null,
    },
    {
      name: RectanglesEnum.TWO,
      position: null,
    },
    {
      name: RectanglesEnum.THREE,
      position: null,
    },
  ];

  constructor(public service: AngularCollisionService) {}

  public ngAfterViewInit(): void {
    // Register elements for collision detection
    this.service.register(this.elements);

    setTimeout(() => {
      this.stopTrackingFirstElement();
    }, 10000);
  }

  public stopTrackingFirstElement(): void {
    // Remove first element from tracking
    this.service.remove(this.elements.first);
  }

  public handleRectChange(
    position: NgcElementChange,
    rectangleName: RectanglesEnum
  ): void {
    // Handle position changes
    this.rectangles.find(
      (rectangle) => rectangle.name === rectangleName
    ).position = position.domRect;
  }

  public handleCollisionActiveChange(change: NgcCollisionChange): void {
    // Handle collisions
    this.collisions.set(change.id, change);
  }
}
