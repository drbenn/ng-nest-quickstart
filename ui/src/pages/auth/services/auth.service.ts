import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateStandardUserDto, LoginStandardUserDto, ResetStandardUserDto, UserLoginJwtDto } from '../../../types/userDto.types';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl + '/auth';

  constructor(
      private http: HttpClient
  ) { }

  public getAuthenticatedUser(): Observable<UserLoginJwtDto> {
    console.log('in get authenticated user in auth user');
    
    return this.http.get<UserLoginJwtDto>(`${this.baseUrl}/restore-user`, {
      withCredentials: true,
    });
  };

  public logoutAuthenticatedUser(): Observable<any> {
    console.log('in get authenticated user in auth user');
    
    return this.http.post<any>(`${this.baseUrl}/logout`, {
      withCredentials: true,
    });
  };
}
