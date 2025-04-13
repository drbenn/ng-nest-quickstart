import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OauthAuthService {

  private readonly baseUrl = environment.apiUrl + '/auth';

  constructor(
      private http: HttpClient
  ) { }

  // oauth requires redirect away from site, api muyst return redirect no user data directlu in response, 
  // thus redirecting to oath/callback in ui will then fetch user data and then redirect accordingly
  public oAuthSignIn(provider: 'google' | 'facebook' | 'github'): void {
    window.location.href = `${this.baseUrl}/${provider}`;
  };
}
