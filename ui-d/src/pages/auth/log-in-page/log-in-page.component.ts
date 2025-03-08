import { Component } from '@angular/core';
import { StandardAuthService } from '../services/standard-auth.service';
import { OauthAuthService } from '../services/oauth-auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginStandardUserDto } from '../../../types/userDto.types';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';

@Component({
  selector: 'log-in-page',
  imports: [StandardPageWrapperComponent, CommonModule, FormsModule, ReactiveFormsModule,  RouterLink, RouterLinkActive],
  templateUrl: './log-in-page.component.html',
  styleUrl: './log-in-page.component.scss'
})
export class LogInPageComponent {
  protected facebookSvg: string = '../../../assets/icons/facebook.svg';

  constructor(
    private readonly standardAuthService: StandardAuthService,
    private readonly oauthAuthService: OauthAuthService
  ) {}

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(26)]),
    isPasswordInView: new FormControl(false)
  });

  protected onSubmitBasicLogin(): void {
    console.log(this.form.value);
    const loginStandardUserDto: LoginStandardUserDto = {
      email: <string>this.form.value.email,
      password: <string>this.form.value.password
    };
    this.standardAuthService.loginStandardUser(loginStandardUserDto);
  };

  protected handlePasswordInView(event: any): void {
    event.checked ? this.form.get('isPasswordInView')?.setValue(true) : this.form.get('isPasswordInView')?.setValue(false);
  };

  protected oAuthSignIn(provider: 'google' | 'facebook' | 'github'): void {
    this.oauthAuthService.oAuthSignIn(provider);
  };

}
