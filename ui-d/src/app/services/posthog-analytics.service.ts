import { Injectable } from '@angular/core';
import posthog from 'posthog-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PosthogAnalyticsService {
  constructor() {
    posthog.init(environment.posthogApiKey, {
      api_host: environment.posthogApiHost,
    });
  }

  public trackEvent(event: string, properties?: Record<string, any>) {
    posthog.capture(event, properties);
  }

  public identifyUser(userId: string, userInfo?: Record<string, any>) {
    posthog.identify(userId, userInfo);
  }

  public trackPageView() {
    posthog.capture('$pageview', { path: window.location.pathname });
  }

  public trackFirstVisit() {
    const isFirstVisit = !localStorage.getItem('hasVisitedBefore');

    if (isFirstVisit) {
      posthog.capture('first_time_visitor');
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }
}
