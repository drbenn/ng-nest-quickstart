import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateStandardUserDto, LoginStandardUserDto, ResetStandardUserDto, UserLoginJwtDto } from '../../../types/userDto.types';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StandardAuthService {
  private readonly baseUrl = environment.apiUrl + '/auth';

  constructor(
      private http: HttpClient
  ) { }

  public registerStandardUser(createStandardUserDto: CreateStandardUserDto): Observable<UserLoginJwtDto> {
    // with credentials: true allows the browser to STORE and SEND cookies.
    return this.http.post<UserLoginJwtDto>(`${this.baseUrl}/register-standard`,createStandardUserDto, { withCredentials: true })
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  };

  public loginStandardUser(loginStandardUserDto: LoginStandardUserDto): Observable<UserLoginJwtDto> {
    return this.http.post<UserLoginJwtDto>(`${this.baseUrl}/login-standard`,loginStandardUserDto, { withCredentials: true })
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  };

  public resetStandardUserPassword(resetStandardUserDto: ResetStandardUserDto): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/reset-standard`,
      resetStandardUserDto
    ) as Observable<string>;
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
