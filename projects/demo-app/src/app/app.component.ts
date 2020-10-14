import {
  Component,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { AngularCollisionService } from 'projects/angular-collision/src/lib/angular-collision.service';
import { AngularCollisionDirective } from 'projects/angular-collision/src/lib/angular-collision.directive';

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
    this.service.register(this.elements);
  }

  public handleRectChange(
    position: DOMRect,
    rectangleName: RectanglesEnum
  ): void {
    this.rectangles.find(
      (rectangle) => rectangle.name === rectangleName
    ).position = position;
  }
}
