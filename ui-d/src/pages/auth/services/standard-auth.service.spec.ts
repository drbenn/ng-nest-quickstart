import { TestBed } from '@angular/core/testing';

import { StandardAuthService } from './standard-auth.service';

describe('StandardAuthService', () => {
  let service: StandardAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandardAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
