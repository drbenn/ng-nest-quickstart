import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { AuthMessages, AuthResponseMessageDto, RequestResetStandardUserDto } from '../../../types/userDto.types';
import { StandardAuthService } from '../services/standard-auth.service';
import { dispatch } from '@ngxs/store';
import { DisplayToast } from '../../../store/app/app.actions';

@Component({
  selector: 'app-request-password-reset-page',
  imports: [
    StandardPageWrapperComponent, ButtonModule, InputTextModule, DividerModule,
    FloatLabelModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './request-password-reset-page.component.html',
  styleUrl: './request-password-reset-page.component.scss'
})
export class RequestPasswordResetPageComponent {
  private displayToast = dispatch(DisplayToast);
  protected passwordResetEmailResponse: null | 'success' | 'fail' = null;

  constructor(
    private standardAuthService: StandardAuthService
  ) {}

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  protected onSubmitResetPassword(): void {
    console.log(this.form.value);
    const resetStandardUserDto: RequestResetStandardUserDto = {
      email: <string>this.form.value.email
    };
    this.standardAuthService.requestResetStandardUserPassword(resetStandardUserDto)
      .subscribe(({
        next: (response: AuthResponseMessageDto) => {
          if (response.message === AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_SUCCESS) {
            this.passwordResetEmailResponse = 'success';
          } else {
            this.passwordResetEmailResponse = 'fail';
            this.displayToast({ severity: 'danger', summary: 'Error', detail: response.message, life: 6000 });
          }
        },
        error: (error: unknown) => {
          console.error(error);
          this.passwordResetEmailResponse = 'fail';
          this.displayToast({ severity: 'danger', summary: 'Error', detail: 'Error requesting password change', life: 6000 });
        }
      }));
  };
}
