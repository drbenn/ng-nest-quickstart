import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { ButtonModule } from 'primeng/button';
import { dispatch, Store } from '@ngxs/store';
import { LoginUser, LogoutUser } from '../../../store/auth/auth.actions';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StandardAuthService } from '../services/standard-auth.service';
import { LoginStandardUserDto, UserLoginJwtDto } from '../../../types/userDto.types';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'signin-page',
  standalone: true,
  imports: [
    StandardPageWrapperComponent, ButtonModule, DividerModule, InputTextModule,
    FloatLabelModule, CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule,
    RouterLink, RouterLinkActive, ToastModule],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.scss',
  providers: [MessageService]
})
export class SigninPageComponent {
  private loginUser = dispatch(LoginUser);

  constructor(
    private readonly standardAuthService: StandardAuthService,
    private readonly messageService: MessageService
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
    this.standardAuthService.loginStandardUser(loginStandardUserDto).subscribe({
      next:(user: UserLoginJwtDto) => {
        this.loginUser(user);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      }
    });
  };

  protected handlePasswordInView(event: CheckboxChangeEvent): void {
    event.checked ? this.form.get('isPasswordInView')?.setValue(true) : this.form.get('isPasswordInView')?.setValue(false);
  };

  protected googleSignIn(): void {
    console.log('google sign in todo');
  };

}

