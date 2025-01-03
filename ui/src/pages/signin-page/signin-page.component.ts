import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from '../../components/standard-page-wrapper/standard-page-wrapper.component';
import { ButtonModule } from 'primeng/button';
import { dispatch } from '@ngxs/store';
import { LoginUser, LogoutUser } from '../../store/auth/auth.actions';

@Component({
  selector: 'signin-page',
  imports: [StandardPageWrapperComponent, ButtonModule],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.scss'
})
export class SigninPageComponent {
  private login = dispatch(LoginUser);

  protected signIn(): void {
    this.login({
      id: '1',
      firstName: 'Dan',
      lastName: 'Bennett',
      fullName: 'Dan Bennett',
      email: 'bennett.daniel@gmail.com',
      roles: ['admin', 'tremendous'],
      dateJoined: new Date()
    })
  };

}

