import { ResolveFn } from '@angular/router';

export const initialAuthCheckResolver: ResolveFn<boolean> = (route, state) => {
  console.log('initialAuthCheckResolver Hit: route: ', route.routeConfig?.path);
  
  return true;
};


// import { Injectable } from '@angular/core';
// import {
//   Router, Resolve,
//   RouterStateSnapshot,
//   ActivatedRouteSnapshot
// } from '@angular/router';
// import { Observable, of } from 'rxjs'; // Use 'of' for synchronous returns or after async ops
// import { map, catchError, take } from 'rxjs/operators'; // Operators for async handling

// import { AuthService } from '../_services/auth.service'; // <--- ADJUST PATH if needed

// @Injectable({
//   providedIn: 'root'
// })
// // Resolve<boolean> indicates it will eventually return a boolean when done.
// // Use Resolve<void> if checkAuthenticated returns void/doesn't need mapping.
// export class InitialAuthCheckResolver implements Resolve<boolean> {

//   constructor(
//     private authService: AuthService,
//     private router: Router // Inject Router if needed for complex logic (not strictly needed here)
//   ) {}

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     const targetUrl = state.url;
//     console.log(`InitialAuthCheckResolver: Running for target URL: ${targetUrl}`);

//     // --- Condition: Skip check for reset-password route ---
//     if (targetUrl.includes('/reset-password')) {
//       console.log('InitialAuthCheckResolver: Target is reset-password, skipping auto-login check.');
//       // Resolve immediately with true, allowing navigation to proceed without the check.
//       return of(true);
//     }

//     // --- Perform the check for other routes ---
//     console.log('InitialAuthCheckResolver: Performing auto-login check...');
//     // Assuming authService.checkAuthenticated() handles the logic
//     // and returns an Observable (like from an HttpClient call or just updates status).
//     // It should ideally complete (e.g., using take(1) internally if needed).
//     return this.authService.checkAuthenticated().pipe(
//         map(() => {
//             // The check completed (successfully or not, doesn't matter here)
//             console.log('InitialAuthCheckResolver: Auto-login check finished.');
//             return true; // Resolve with true to allow route activation to continue
//         }),
//         catchError(() => {
//              // Handle potential errors during the check if necessary
//              console.error('InitialAuthCheckResolver: Error during auto-login check.');
//              return of(true); // Still resolve with true to allow navigation, even if check failed
//         }),
//        // take(1) // Add take(1) *here* if checkAuthenticated() itself doesn't guarantee completion
//     );
//   }
// }