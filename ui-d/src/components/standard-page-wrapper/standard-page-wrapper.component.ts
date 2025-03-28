import { Component, Input } from '@angular/core';

@Component({
  selector: 'standard-page-wrapper',
  imports: [],
  templateUrl: './standard-page-wrapper.component.html',
  styleUrl: './standard-page-wrapper.component.scss'
})
export class StandardPageWrapperComponent {
  @Input() title: string | undefined = undefined;
}
