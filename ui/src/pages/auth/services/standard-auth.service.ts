import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateStandardUserDto, LoginStandardUserDto, ResetStandardUserDto, ResponseMessageDto, UserLoginJwtDto } from '../../../types/userDto.types';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { dispatch } from '@ngxs/store';
import { LoginUser } from '../../../store/auth/auth.actions';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StandardAuthService {
  private readonly baseUrl = environment.apiUrl + '/auth';
  private loginUser = dispatch(LoginUser);
  constructor(
      private http: HttpClient,
      private messageService: MessageService,
      private router: Router
  ) { }

  public registerStandardUser(createStandardUserDto: CreateStandardUserDto): void {
    // with credentials: true allows the browser to STORE and SEND cookies.
    this.http.post<UserLoginJwtDto>(`${this.baseUrl}/register-standard`,createStandardUserDto, { withCredentials: true })
    .subscribe({
      next: (response: UserLoginJwtDto | ResponseMessageDto) => {
        console.log(response);
        if ('isRedirect' in response && 'provider' in response) {
          console.log('redirect in register response: Auth failed. Account with email exists but under oauth login');
          const responseMessage: ResponseMessageDto = response as ResponseMessageDto;
          this.messageService.add({ severity: 'warn', summary: 'YOLO', detail: 'USER EXISTS', life: 6000 });
          this.router.navigate([responseMessage.redirectPath]
            , {
            queryParams: {
              email: responseMessage.email as string,
              provider: responseMessage.provider as string,
            },
          })
        } else if ('isRedirect' in response) {
          console.log('redirect in register response: Auth failed. Account with email does not exist');
          const responseMessage: ResponseMessageDto = response as ResponseMessageDto;
          this.messageService.add({ severity: 'warn', summary: 'YOLO', detail: 'USER DOES NOT EXIST', life: 6000 });
          this.router.navigate([responseMessage.redirectPath]
            , {
            queryParams: {
              email: responseMessage.email as string
            },
          })
        } else if ('user' in response) {
          console.log('email in register response');
          this.messageService.add({ severity: 'success', summary: 'LOGIN SUCCESS', detail: 'USER RECEIVED AND SENT TO STATE', life: 6000 });
          const user = response as UserLoginJwtDto;
          this.loginUser(user);
        };
      },
      error: (error: unknown) => this.handleError(error)
    })
    // .pipe(
    //   catchError((error: HttpErrorResponse) => this.handleError(error))
    // );
  };

  public loginStandardUser(loginStandardUserDto: LoginStandardUserDto): void {
    this.http.post<UserLoginJwtDto>(`${this.baseUrl}/login-standard`,loginStandardUserDto, { withCredentials: true })
    .subscribe({
      next: (response: UserLoginJwtDto | ResponseMessageDto) => {
        console.log(response);
        if ('isRedirect' in response && 'email' in response) {
          console.log('redirect in register response: Auth failed. Account with email exists but under oauth login');
          const responseMessage: ResponseMessageDto = response as ResponseMessageDto;
          this.messageService.add({ severity: 'warn', summary: 'YOLO', detail: 'USER EXISTS', life: 6000 });
          this.router.navigate([responseMessage.redirectPath])
          //   , {
          //   queryParams: {
          //     email: encodeURIComponent(responseMessage.email as string),
          //     provider: encodeURIComponent(responseMessage.provider as string),
          //   },
          // })
        } else if ('isRedirect' in response) {
          console.log('redirect in register response: Auth failed. Account with email does not exist');
          const responseMessage: ResponseMessageDto = response as ResponseMessageDto;
          this.messageService.add({ severity: 'warn', summary: 'YOLO', detail: 'USER DOES NOT EXIST', life: 6000 });
          this.router.navigate([responseMessage.redirectPath])
          //   , {
          //   queryParams: {
          //     email: encodeURIComponent(responseMessage.email as string),
          //     provider: encodeURIComponent(responseMessage.provider as string),
          //   },
          // })
        } else if ('user' in response) {
          console.log('email in register response');
          this.messageService.add({ severity: 'success', summary: 'LOGIN SUCCESS', detail: 'USER RECEIVED AND SENT TO STATE', life: 6000 });
          const user = response as UserLoginJwtDto;
          this.loginUser(user);
        };
      },
      error: (error: unknown) => this.handleError(error)
    })
    // .pipe(
    //   catchError((error: HttpErrorResponse) => this.handleError(error))
    // );
  };

  public resetStandardUserPassword(resetStandardUserDto: ResetStandardUserDto): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/reset-standard`,
      resetStandardUserDto
    ) as Observable<string>;
  };

  private handleError(error: HttpErrorResponse | any): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend error
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    };
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 3000 });
    // Return an observable with a user-facing error message
    return throwError(() => error.error?.message || 'Something went wrong. Please try again.');
  };

}
