import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/auth/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot            // Contains the URL the user tried to access (state.url)
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {


  // --- Dependency Injection using inject() ---
  const authService = inject(AuthService); // Inject AuthService
  const router = inject(Router);         // Inject Router

  // --- Authentication Logic (remains the same) ---

  // Example 1: If your AuthService.isAuthenticated() returns a boolean

  // TODO!!!!
  // const isAuthenticated = authService.isAuthenticated();
  const isAuthenticated = true;





  if (isAuthenticated) {
    return true; // User is logged in, allow navigation
  } else {
    // User is not logged in, redirect to login page
    console.warn(`Functional AuthGuard: Blocked access to ${state.url} - User not authenticated. Redirecting...`);
    // Create a UrlTree to redirect
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }


  /*
  // Example 2: If your AuthService exposes an observable like isLoggedIn$
  return authService.isLoggedIn$.pipe( // Assuming isLoggedIn$ emits true/false
    take(1), // Take the current value and complete
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // User is logged in, allow navigation
      } else {
        // User is not logged in, redirect to login page
        console.warn(`Functional AuthGuard: Blocked access to ${state.url} - User not authenticated (checked via observable). Redirecting...`);
        // Create a UrlTree to redirect
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }
    })
  );
  */
};
