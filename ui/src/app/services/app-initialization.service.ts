import { Injectable } from '@angular/core';
import { AuthService } from '../pages/auth/services/auth.service';
import { PlatformLocation } from '@angular/common';
import { catchError, lastValueFrom, map, Observable, of, tap } from 'rxjs';
import { dispatch } from '@ngxs/store';
import { CheckAuthenticatedUser } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AppInitializationService {
  private checkAuthenticatedUser = dispatch(CheckAuthenticatedUser);

  constructor(
    private authService: AuthService,
    private platformLocation: PlatformLocation
  ) { }

  initializeApp(): Promise<void> | Observable<void> {
    // const initialPathWithParams = this.platformLocation.pathname + this.platformLocation.search;
    const pathName: string = this.platformLocation.pathname;
    this.restoreUserByPath(pathName);

    // return of(undefined);
    return Promise.resolve();
  }

  /**
   * This is necessary for the scenario when user wants to reset password, but still has cookies. Without this
   * the user would receive the reset password link, go to the link, but if http-only jwt cookies are still viable
   * they would be rerouted to home as they session would be restored. This can bypass the restore session action
   * on specified routes.
   */
  private restoreUserByPath(pathName: string): void {
    const pathsNotToAttemptRestoreUser: string[] = ['/reset-password', '/reset-password/', 'reset-password'];
    if (pathsNotToAttemptRestoreUser.includes(pathName)) {
      // console.error('We will not attempt to restore user on pathname::: ', pathName);
      return;
    } else {
      // console.warn('we will attempt to restore user on this path!!!!!');
      this.checkAuthenticatedUser();
      return;
    }
  }

}
