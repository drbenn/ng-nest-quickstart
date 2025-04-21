import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';

@Component({
  selector: 'app-registration-success-pending',
  imports: [StandardPageWrapperComponent],
  templateUrl: './registration-success-pending.component.html',
  styleUrl: './registration-success-pending.component.scss'
})
export class RegistrationSuccessPendingComponent {
  protected email: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email');
    });
  }
}
