import { Component, OnInit } from '@angular/core';
import { StandardPageWrapperComponent } from "../../../components/standard-page-wrapper/standard-page-wrapper.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ResetStandardPasswordDto } from '../../../types/userDto.types';
import { StandardAuthService } from '../services/standard-auth.service';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'reset-password-page',
  imports: [
    StandardPageWrapperComponent, ButtonModule, InputTextModule, DividerModule,
    FloatLabelModule, CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent implements OnInit {

  constructor(
    private standardAuthService: StandardAuthService,
    private route: ActivatedRoute
  ) {}

  protected form = new FormGroup({
    email: new FormControl({value: '', disabled: true }, [Validators.required, Validators.email]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(26)]),
    retypeNewPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(26)]),
    resetId: new FormControl('', [Validators.required, Validators.minLength(0), Validators.maxLength(100)]),
    isPasswordInView: new FormControl(false)
  });
  
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.form.get('email')?.setValue(params.get('email'));
      this.form.get('resetId')?.setValue(params.get('reset_id'));
    });
  };

  protected onSubmitResetPassword(): void {
    const resetStandardPasswordDto: ResetStandardPasswordDto = {
      email: <string>this.form.value.email,
      newPassword: <string>this.form.value.newPassword,
      resetId: <string>this.form.value.resetId
    };
    this.standardAuthService.resetStandardUserPassword(resetStandardPasswordDto)
  };

  protected handlePasswordInView(event: CheckboxChangeEvent): void {
    event.checked ? this.form.get('isPasswordInView')?.setValue(true) : this.form.get('isPasswordInView')?.setValue(false);
  };

  protected isFormValid(): boolean {
    return this.form.valid && this.form.get('newPassword')?.value === this.form.get('retypeNewPassword')?.value;
  };

}
