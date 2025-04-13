import { TestBed } from '@angular/core/testing';

import { PosthogAnalyticsService } from './posthog-analytics.service';

describe('PosthogAnalyticsService', () => {
  let service: PosthogAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosthogAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
