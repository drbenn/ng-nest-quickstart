import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../store/auth/auth.state';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl + '/auth';

  constructor(
      private http: HttpClient
  ) { }

  /**
   * Front end user authentication is simple relying on the fact that auth state user id has been set.
   * The reason there is no jwt cookie check is becuase the server provides http-only cookies so that
   * the front end cannot access the cookie to prevent XSS(cross site scripting) attacks. The http-only
   * jwt cookie is used by the server side guards which prevents any GET, POST, PATCH, PUT, DELETE, etc...
   * requests without the client-side http-only jwt cookie being authenticated by the back-end. So although
   * a hacker may be able to access ui routes by editing state somehow, they would not be able to view or
   * modify the actual data on the routes because they would not have an adequate jwt token to be authenticated
   * on the server.
   */
  public isAuthenticatedUser(): boolean {
    const authStateUserId = inject(Store).selectSnapshot(AuthState.getUserId);
    if (!authStateUserId) {
      return false;
    } else {
      return true;
    }
  }

  public getAuthenticatedUser(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/restore-user`, null, {
      withCredentials: true,
    });
  };

  public logoutAuthenticatedUser(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logout`, null, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  };

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend error
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    };

    // Return an observable with a user-facing error message
    return throwError(() => error.error?.message || 'Something went wrong. Please try again.');
  };
}
