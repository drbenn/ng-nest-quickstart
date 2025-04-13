import { Component } from '@angular/core';

@Component({
  selector: 'oauth-callback',
  imports: [],
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.scss'
})
export class OauthCallbackComponent {
  /**
   * once redirected to oauth-callback page from successful oath login user data will be retrieved from database.
   * this.checkAuthenticatedUser(); in app.component should take over once the response is received and set userdata
   * will set user data in state and then redirect to the logged in user homepage.
   */
}
