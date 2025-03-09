import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from "../../../components/standard-page-wrapper/standard-page-wrapper.component";
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'page-not-found-page',
  imports: [StandardPageWrapperComponent, RouterLink, RouterLinkActive],
  templateUrl: './page-not-found-page.component.html',
  styleUrl: './page-not-found-page.component.scss'
})
export class PageNotFoundPageComponent {

}
