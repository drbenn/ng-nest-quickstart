import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl + '/auth';

  constructor(
      private http: HttpClient
  ) { }

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
