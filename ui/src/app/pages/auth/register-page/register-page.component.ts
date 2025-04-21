import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { StandardAuthService } from '../services/standard-auth.service';
import { OauthAuthService } from '../services/oauth-auth.service';
import { CreateStandardUserDto } from '@common-types';

@Component({
  selector: 'register-page',
  imports: [StandardPageWrapperComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {

  constructor(
    private standardAuthService: StandardAuthService,
    private oauthAuthService: OauthAuthService
  ) {}

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(26)]),
    retypePassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(26)]),
    isPasswordInView: new FormControl(false)
  });

  protected onSubmitRegisterUser(): void {
    console.log(this.form.value);
    const createStandardUserDto: CreateStandardUserDto = {
      email: <string>this.form.value.email,
      password: <string>this.form.value.password
    };
    this.standardAuthService.registerStandardUser(createStandardUserDto)
  };

  protected oAuthSignIn(provider: 'google' | 'facebook' | 'github'): void {
    this.oauthAuthService.oAuthSignIn(provider);
  };

  protected handlePasswordInView(event: any): void {
    event.checked ? this.form.get('isPasswordInView')?.setValue(true) : this.form.get('isPasswordInView')?.setValue(false);
  };

  protected isFormValid(): boolean {
    return this.form.valid && this.form.get('password')?.value === this.form.get('retypePassword')?.value;
  };
}
