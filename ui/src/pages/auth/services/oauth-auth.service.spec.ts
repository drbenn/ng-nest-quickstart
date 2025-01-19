import { TestBed } from '@angular/core/testing';

import { OauthAuthService } from './oauth-auth.service';

describe('OauthAuthService', () => {
  let service: OauthAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OauthAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
