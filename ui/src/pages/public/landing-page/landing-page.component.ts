import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { dispatch, select } from '@ngxs/store';
import { Add } from '../../../store/app/app.actions';
import { getCount } from '../../../store/app/app.state';

@Component({
  selector: 'landing-page',
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
