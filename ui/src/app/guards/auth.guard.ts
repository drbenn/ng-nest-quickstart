import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/auth/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot      // Contains the URL the user tried to access (state.url)
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated: boolean = authService.isAuthenticatedUser();

  if (isAuthenticated) {
    // User is logged in, allow navigation
    return true;
  } else {
    // User is not logged in, redirect to login page
    console.warn(`Functional AuthGuard: Blocked access to ${state.url} - User not authenticated. Redirecting...`);
    // Create a UrlTree to redirect
    return router.createUrlTree(['/log-in'], { queryParams: { returnUrl: state.url } });
  }
};
