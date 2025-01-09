import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { DividerModule } from 'primeng/divider';
import { dispatch } from '@ngxs/store';
import { LoginUser } from '../../../store/auth/auth.actions';
import { CreateStandardUserDto } from '../../../types/userDto.types';
import { StandardAuthService } from '../services/standard-auth.service';

@Component({
  selector: 'register-page',
  imports: [
    StandardPageWrapperComponent, ButtonModule, InputTextModule, DividerModule,
    FloatLabelModule, CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  private login = dispatch(LoginUser);

  constructor(
    private standardAuthService: StandardAuthService
  ) {}

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
    retypePassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
    isPasswordInView: new FormControl(false)
  });

  protected onSubmitRegisterUser(): void {
    console.log(this.form.value);
    const createStandardUserDto: CreateStandardUserDto = {
      email: <string>this.form.value.email,
      password: <string>this.form.value.password
    };
    this.standardAuthService.registerStandardUser(createStandardUserDto)
    .subscribe({
    next: (user) => {
      console.log('User registered successfully:', user);
      // Handle success (e.g., navigate to another page or show a success message)
    },
    error: (errorMessage) => {
      console.error('Registration failed:', errorMessage);
      // Display the error message to the user (e.g., via a toast or error UI)
    },
  });
  };

  protected handlePasswordInView(event: CheckboxChangeEvent): void {
    event.checked ? this.form.get('isPasswordInView')?.setValue(true) : this.form.get('isPasswordInView')?.setValue(false);
  };

  protected isFormValid(): boolean {
    return this.form.valid && this.form.get('password')?.value === this.form.get('retypePassword')?.value;
  };
}
