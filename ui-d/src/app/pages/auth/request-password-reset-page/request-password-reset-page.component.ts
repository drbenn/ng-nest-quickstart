import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { dispatch } from '@ngxs/store';
import { DisplayToast } from '../../../store/app/app.actions';
import { StandardAuthService } from '../services/standard-auth.service';
import { environment } from '../../../../environments/environment.development';
import { RequestResetStandardUserPasswordDto, AuthResponseMessageDto, AuthMessages } from '../../../types/userDto.types';

@Component({
  selector: 'request-passsword-reset-page',
  imports: [StandardPageWrapperComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './request-password-reset-page.component.html',
  styleUrl: './request-password-reset-page.component.scss'
})
export class RequestPassswordResetPageComponent {
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
    const resetStandardUserDto: RequestResetStandardUserPasswordDto = {
      email: <string>this.form.value.email
    };
    this.standardAuthService.requestResetStandardUserPassword(resetStandardUserDto)
      .subscribe(({
        next: (response: AuthResponseMessageDto) => {
          if (response.message === AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_SUCCESS) {
            this.passwordResetEmailResponse = 'success';
          } else {
            this.passwordResetEmailResponse = 'fail';
            this.displayToast({ 
              title: 'Error',
              message: response.message as unknown as string,
              bgColor: environment.toastDefaultDangerColors.bgColor,
              textColor: environment.toastDefaultDangerColors.textColor
            });
          }
        },
        error: (error: unknown) => {
          console.error(error);
          this.passwordResetEmailResponse = 'fail';
          this.displayToast({ 
            title: 'Error',
            message: 'Error requesting password change',
            bgColor: environment.toastDefaultDangerColors.bgColor,
            textColor: environment.toastDefaultDangerColors.textColor
          });
        }
      }));
  };
}
