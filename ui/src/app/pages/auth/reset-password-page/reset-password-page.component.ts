import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandardAuthService } from '../services/standard-auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { ResetStandardUserPasswordDto } from '../../../types/userDto.types';

@Component({
  selector: 'reset-password-page',
  imports: [StandardPageWrapperComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent {
  protected email: string | null = null;
  protected reset_id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private standardAuthService: StandardAuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email');
      this.reset_id = params.get('reset_id');
    });
    this.form.get('email')?.setValue(this.email)
  }

  protected form = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(26)]),
    retypePassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(26)]),
    isPasswordInView: new FormControl(false)
  });

  protected onSubmitNewUserPassword(): void {
    console.log(this.form.value);
    const resetStandardPasswordDto: ResetStandardUserPasswordDto = {
      email: <string>this.email,
      new_password: <string>this.form.value.password,
      reset_id: <string>this.reset_id,
    };
    this.standardAuthService.resetStandardUserPassword(resetStandardPasswordDto);
  };

  protected handlePasswordInView(event: any): void {
    event.checked ? this.form.get('isPasswordInView')?.setValue(true) : this.form.get('isPasswordInView')?.setValue(false);
  };

  protected isFormValid(): boolean {
    return this.form.valid && this.form.get('password')?.value === this.form.get('retypePassword')?.value;
  };
}
