import { Component } from '@angular/core';
import { select, dispatch } from '@ngxs/store';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { Add } from '../../../store/app/app.actions';
import { getCount } from '../../../store/app/app.state';

@Component({
  selector: 'app-landing-page',
  imports: [StandardPageWrapperComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  count = select(getCount);
  add = dispatch(Add);

  onClick(value: number) {
    this.add(value);
  }
}
