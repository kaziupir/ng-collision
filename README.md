# NgCollision

### Angular 10 library for elements collision detection

[Auto-generated documentation](https://kaziupir.github.io/ng-collision/index.html)

### Example
 
- Module (add `AngularCollisionModule` to imports, `forRoot` is optional to pass config - in this case disable interval collision checking)

```
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AngularCollisionModule.forRoot(new NgcConfig(true)),
    CommonModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```


- Template (add `ngcAngularCollision` directive to any element)

```
  <div
    *ngFor="let rectangle of rectangles"
    class="rect"
    ngcAngularCollision
    #directiveRef="ngcAngularCollision"
    (rectangleChange)="handleRectChange($event, rectangle.name)"
    (collisionActiveChange)="handleCollisionActiveChange($event)"
  >
    <span>Example element ({{ directiveRef.collision$ | async }})</span>
      <div *ngIf="rectangle.position">
        <div>X: {{ position.x | number: '1.0-0' }}px</div>
        <div>Y: {{ position.y | number: '1.0-0' }}px</div>
        <div>W: {{ position.width | number: '1.0-0' }}px</div>
        <div>H: {{ position.height | number: '1.0-0' }}px</div>
      </div>
  </div>
```

- SCSS (class `collision` is applied by directive to host element)

```
.collision {
  border-color: red;
}

.rect {
  width: 150px;
  height: 150px;
  border: 2px solid transparent;
  position: relative;


  &__one {
    top: 100px;
    left: 100px;
  }

  &__two {
    top: 50px;
    left: 150px;
  }
  
   &__three {
    top: 250px;
    left: 300px;
   }
}
```


- Component (register elements to collision checking with `AngularCollisionService`)

```
@Component({
  selector: 'app-root',
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
    this.service.remove(this.elements[0]);
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
```

### Running demo app

`ng serve demo-app`

Drag & drop made with [angular/cdk](https://material.angular.io/cdk/drag-drop/overview). Not a part of library.

### Generate docs

Documentation is auto-generated every commit.

You can also generate docs manually by:
`npm run compodoc`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
