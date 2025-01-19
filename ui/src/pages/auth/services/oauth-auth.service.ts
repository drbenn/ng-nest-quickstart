import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OauthAuthService {

  private readonly baseUrl = environment.apiUrl + '/auth';

  constructor(
      private http: HttpClient
  ) { }

  public oAuthSignIn(provider: 'google' | 'facebook' | 'github'): void {
    window.location.href = `${this.baseUrl}/${provider}`;
  };

}
