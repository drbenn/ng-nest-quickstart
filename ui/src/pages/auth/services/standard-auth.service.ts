import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateStandardUserDto, LoginStandardUserDto, ResetStandardUserDto, UserDto } from '../../../types/userDto.types';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StandardAuthService {

  private readonly baseUrl = environment.apiUrl + '/auth';

  constructor(
      private http: HttpClient
  ) { }

  public registerStandardUser(createStandardUserDto: CreateStandardUserDto): Observable<UserDto> {
    return this.http.post(
      `${this.baseUrl}/register-standard`,
      createStandardUserDto
    ) as Observable<UserDto>;
  };

  public loginStandardUser(loginStandardUserDto: LoginStandardUserDto): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/login-standard`,
      loginStandardUserDto
    ) as Observable<string>;
  };

  public resetStandardUserPassword(resetStandardUserDto: ResetStandardUserDto): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/reset-standard`,
      resetStandardUserDto
    ) as Observable<string>;
  };

}
