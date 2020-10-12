import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularCollisionComponent } from './angular-collision.component';

describe('AngularCollisionComponent', () => {
  let component: AngularCollisionComponent;
  let fixture: ComponentFixture<AngularCollisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AngularCollisionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularCollisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
