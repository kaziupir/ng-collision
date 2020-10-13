import { Component } from '@angular/core';

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
export class AppComponent {
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

  public handleRectChange(
    position: DOMRect,
    rectangleName: RectanglesEnum
  ): void {
    this.rectangles.find(
      (rectangle) => rectangle.name === rectangleName
    ).position = position;
    console.log(this.rectangles);
  }
}
