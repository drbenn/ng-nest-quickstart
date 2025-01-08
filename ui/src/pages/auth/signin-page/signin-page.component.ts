import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { ButtonModule } from 'primeng/button';
import { dispatch } from '@ngxs/store';
import { LoginUser, LogoutUser } from '../../../store/auth/auth.actions';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'signin-page',
  imports: [
    StandardPageWrapperComponent, ButtonModule, DividerModule, InputTextModule,
    FloatLabelModule, CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule,
    RouterLink, RouterLinkActive],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.scss'
})
export class SigninPageComponent {
  private login = dispatch(LoginUser);

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
    isPasswordInView: new FormControl(false)
  });

  protected onSubmitBasicLogin(): void {
    console.log(this.form.value);
  };

  protected handlePasswordInView(event: CheckboxChangeEvent): void {
    event.checked ? this.form.get('isPasswordInView')?.setValue(true) : this.form.get('isPasswordInView')?.setValue(false);
  };

  protected junkSignIn(): void {
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

  protected googleSignIn(): void {
    console.log('google sign in todo');
  };

}

