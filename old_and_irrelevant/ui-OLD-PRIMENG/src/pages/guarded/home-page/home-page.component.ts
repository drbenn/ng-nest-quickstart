import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';

@Component({
  selector: 'home-page',
  imports: [CardModule, StandardPageWrapperComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
