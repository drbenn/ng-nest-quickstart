import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dispatch } from '@ngxs/store';
import { Router } from 'express';
import { Observable, throwError } from 'rxjs';
// import { DisplayToast } from '../../../app/store/app.actions';
import { environment } from '../../../environments/environment.development';
import { PosthogAnalyticsService } from '../../../app/services/posthog-analytics.service';
import { CreateStandardUserDto, UserLoginJwtDto, AuthResponseMessageDto, LoginStandardUserDto, AuthMessages, RequestResetStandardUserDto } from '../../../types/userDto.types';

@Injectable({
  providedIn: 'root'
})
export class StandardAuthService {
  private readonly baseUrl = environment.apiUrl + '/auth';
  // private displayToast = dispatch(DisplayToast);
  
  private loginUser = dispatch(LoginUser);
  constructor(
      private http: HttpClient,
      private router: Router,
      private posthogAnalyticsService: PosthogAnalyticsService
  ) { }

  public registerStandardUser(createStandardUserDto: CreateStandardUserDto): void {
    // with credentials: true allows the browser to STORE and SEND cookies.
    this.http.post<UserLoginJwtDto>(`${this.baseUrl}/register-standard`,createStandardUserDto, { withCredentials: true })
    .subscribe({
      next: (response: AuthResponseMessageDto | any) => {
        console.log('registration response: ', response);

        // Registration successful and login/redirect newly registered user.
        if ('user' in response) {
          const user: UserLoginJwtDto = response.user;
          // this.displayToast({ severity: 'success', summary: 'Success', detail: response.message, life: 6000 });
          this.loginUser(user);
        // Registration failed, email is already registered with site beit standard or oauth.
        } else {
          this.navigateToAuthExistingUser(response.email, response.provider);
        };
      },
      error: (error: unknown) => this.handleError(error)
    })
  };

  public loginStandardUser(loginStandardUserDto: LoginStandardUserDto): void {
    this.http.post<UserLoginJwtDto>(`${this.baseUrl}/login-standard`,loginStandardUserDto, { withCredentials: true })
    .subscribe({
      next: (response: AuthResponseMessageDto | any) => {
        if (response.message === AuthMessages.STANDARD_LOGIN_SUCCESS) {
          const user: UserLoginJwtDto = response.user;
          user.email ? this.posthogAnalyticsService.identifyUser(user.email, { email: user.email }) : '';
          // this.displayToast({ severity: 'success', summary: 'Success', detail: response.message, life: 6000 });
          this.loginUser(user);
        }
        else if (response.message === AuthMessages.STANDARD_LOGIN_FAILED_NOT_REGISTERED) {
          this.navigateToAuthFailedLogin(response.email);
        }
        else if (response.message === AuthMessages.STANDARD_LOGIN_FAILED_EXISTING) {
          if (response.provider) {
            this.navigateToAuthExistingUser(response.email, response.provider);
          } else {
            this.navigateToAuthFailedLogin(response.email);
          };
        }
        else if (response.message === AuthMessages.STANDARD_LOGIN_FAILED_MISMATCH) {
          this.navigateToAuthFailedLogin(response.email);
        }
        else if (response.message === AuthMessages.STANDARD_LOGIN_ERROR) {
          console.error(response.message);
        };
      },
      error: (error: unknown) => this.handleError(error)
    });
  };

  private navigateToAuthExistingUser(email: string, provider: string): void {
    this.router.navigate(['auth/existing-user'], {
      queryParams: {
        email: email,
        provider: provider,
  },})};

  private navigateToAuthFailedLogin(email: string): void {
    this.router.navigate(['auth/failed-login'], {
      queryParams: {
        email: email
  },})};

  public requestResetStandardUserPassword(requestResetStandardUserDto: RequestResetStandardUserDto): Observable<AuthResponseMessageDto> {
    return this.http.post(`${this.baseUrl}/reset-standard-password-request`,requestResetStandardUserDto);
  };

  public resetStandardUserPassword(resetStandardUserDto: RequestResetStandardUserDto): void {
    this.http.post<AuthResponseMessageDto>(`${this.baseUrl}/reset-standard-password`, resetStandardUserDto)
      .subscribe({
        next: (response: AuthResponseMessageDto) => {
          if (response.message === AuthMessages.STANDARD_RESET_SUCCESS) {
            const user: UserLoginJwtDto = response.user as UserLoginJwtDto;
            this.loginUser(user);
          };
        },
        error: (error: unknown) => this.handleError(error)
      })
  };

  private handleError(error: HttpErrorResponse | any): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend error
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    };
    this.displayToast({ severity: 'error', summary: 'Error', detail: error.error, life: 3000 });
    // Return an observable with a user-facing error message
    return throwError(() => error.error?.message || 'Something went wrong. Please try again.');
  };
