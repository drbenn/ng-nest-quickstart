import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from "../../../components/standard-page-wrapper/standard-page-wrapper.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { dispatch } from '@ngxs/store';
import { LoginUser } from '../../../store/auth/auth.actions';
import { ResetStandardUserDto } from '../../../types/userDto.types';
import { StandardAuthService } from '../services/standard-auth.service';

@Component({
  selector: 'reset-password-page',
  imports: [
    StandardPageWrapperComponent, ButtonModule, InputTextModule, DividerModule,
    FloatLabelModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent {
  private login = dispatch(LoginUser);

  constructor(
    private standardAuthService: StandardAuthService
  ) {}

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  protected onSubmitResetPassword(): void {
    console.log(this.form.value);
    const resetStandardUserDto: ResetStandardUserDto = {
      email: <string>this.form.value.email
    };
    this.standardAuthService.resetStandardUserPassword(resetStandardUserDto);
  };

}
