import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'privacy-policy-page',
  imports: [StandardPageWrapperComponent],
  templateUrl: './privacy-policy-page.component.html',
  styleUrl: './privacy-policy-page.component.scss'
})
export class PrivacyPolicyPageComponent {
  protected lastUpdatedDate: string = environment.privacyPolicyLastUpdatedDate;
}
