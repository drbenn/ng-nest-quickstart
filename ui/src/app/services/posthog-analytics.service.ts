import { Injectable } from '@angular/core';
import posthog from 'posthog-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PosthogAnalyticsService {
  constructor() {
    if (environment.posthogApiKey !== 'YOUR_POSTHOG_API_KEY') {
      posthog.init(environment.posthogApiKey, {
        api_host: environment.posthogApiHost,
      });
    }
  }

  public trackEvent(event: string, properties?: Record<string, any>) {
    if (environment.posthogApiKey !== 'YOUR_POSTHOG_API_KEY') { 
      posthog.capture(event, properties);
    }
  }

  public identifyUser(userId: string, userInfo?: Record<string, any>) {
    if (environment.posthogApiKey !== 'YOUR_POSTHOG_API_KEY') { 
      posthog.identify(userId, userInfo);
    }
  }

  public trackPageView() {
    if (environment.posthogApiKey !== 'YOUR_POSTHOG_API_KEY') { 
      posthog.capture('$pageview', { path: window.location.pathname });
    }
  }

  public trackFirstVisit() {
    if (environment.posthogApiKey !== 'YOUR_POSTHOG_API_KEY') { 
      const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
  
      if (isFirstVisit) {
        posthog.capture('first_time_visitor');
        localStorage.setItem('hasVisitedBefore', 'true');
      }
    }
  }
}
