import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dispatch } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PosthogAnalyticsService } from '../../../app/services/posthog-analytics.service';
import { CreateStandardUserDto, UserLoginJwtDto, AuthResponseMessageDto, LoginStandardUserDto, AuthMessages, RequestResetStandardUserPasswordDto, ResetStandardUserPasswordDto } from '../../../types/userDto.types';
import { LoginUser } from '../../../store/auth/auth.actions';
import { Router } from '@angular/router';
import { DisplayToast } from '../../../store/app/app.actions';

@Injectable({
  providedIn: 'root'
})
export class StandardAuthService {
  private readonly baseUrl = environment.apiUrl + '/auth';
  private displayToast = dispatch(DisplayToast);
  
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
          this.displayToast({ 
            title: 'Success',
            message: response.message as unknown as string,
            bgColor: environment.toastDefaultSuccessColors.bgColor,
            textColor: environment.toastDefaultSuccessColors.textColor
          });
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
          this.displayToast({ 
            title: 'Success',
            message: response.message as unknown as string,
            bgColor: environment.toastDefaultSuccessColors.bgColor,
            textColor: environment.toastDefaultSuccessColors.textColor
          });
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
          this.displayToast({ 
            title: 'Error',
            message: 'Error logging in with email and password. Please check that you have entered your username and password correctly.',
            bgColor: environment.toastDefaultDangerColors.bgColor,
            textColor: environment.toastDefaultDangerColors.textColor
          });
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

  public requestResetStandardUserPassword(requestResetStandardUserDto: RequestResetStandardUserPasswordDto): Observable<AuthResponseMessageDto> {
    return this.http.post(`${this.baseUrl}/reset-standard-password-request`,requestResetStandardUserDto);
  };

  public resetStandardUserPassword(resetStandardPasswordDto: ResetStandardUserPasswordDto): void {
    this.http.post<AuthResponseMessageDto>(`${this.baseUrl}/reset-standard-password`, resetStandardPasswordDto)
      .subscribe({
        next: (response: AuthResponseMessageDto) => {
          console.log('response from reset Standard User password: ', response);
          
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
    this.displayToast({ 
      title: 'Error',
      message: error.error as unknown as string,
      bgColor: environment.toastDefaultDangerColors.bgColor,
      textColor: environment.toastDefaultDangerColors.textColor
    });
    // Return an observable with a user-facing error message
    return throwError(() => error.error?.message || 'Something went wrong. Please try again.');
  }

}
