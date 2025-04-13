import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { initialAuthCheckResolver } from './initial-auth-check.resolver';

describe('initialAuthCheckResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => initialAuthCheckResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
