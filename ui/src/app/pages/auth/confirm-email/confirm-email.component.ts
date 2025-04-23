import { Component, OnInit } from '@angular/core';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { ActivatedRoute } from '@angular/router';
import { StandardAuthService } from '../services/standard-auth.service';
import { AuthMessages, AuthResponseMessageDto, ConfirmStandardUserEmailDto, UserProfile } from '@common-types';
import { dispatch } from '@ngxs/store';
import { DisplayToast } from '../../../store/app/app.actions';
import { LoginUser } from '../../../store/auth/auth.actions';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'confirm-email',
  imports: [StandardPageWrapperComponent],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {
  protected errorMessage: string ='';
  protected errorMessage2: string;
  private displayToast = dispatch(DisplayToast);
  private loginUser = dispatch(LoginUser);
  
  constructor(
    private route: ActivatedRoute,
    private standardAuthService: StandardAuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const email = params.get('email');
      const confirm_id = params.get('confirm_id');

      const confirmStandardUserEmailDto: ConfirmStandardUserEmailDto = {
        email: email,
        hash: confirm_id
      }

      this.standardAuthService.confirmStandardUserEmail(confirmStandardUserEmailDto)
        .subscribe({
          next: (response: AuthResponseMessageDto) => {
            console.log('response from confirm Standard User: ', response);
            setTimeout(() => {
              if (response.message === AuthMessages.STANDARD_CONFIRM_EMAIL_CONFIRMED_SUCCESS) {
                const user: UserProfile = response.user as UserProfile;
                this.loginUser(user);
                return response;
              } else if (response.message === AuthMessages.STANDARD_CONFIRM_EMAIL_CONFIRMED_FAILED) {
                return response;
              } else {
                this.displayToast({ 
                  title: 'Error',
                  message: 'Error confirming standard email user. Please contact admin.',
                  bgColor: environment.toastDefaultDangerColors.bgColor,
                  textColor: environment.toastDefaultDangerColors.textColor
                });
                return response;
              }
            }, 3000)
          },
          error: (error: unknown) => this.standardAuthService.handleError(error)
        })
    });
  }
}
