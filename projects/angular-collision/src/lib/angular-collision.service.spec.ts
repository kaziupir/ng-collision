import { TestBed } from '@angular/core/testing';

import { AngularCollisionService } from './angular-collision.service';

describe('AngularCollisionService', () => {
  let service: AngularCollisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularCollisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
