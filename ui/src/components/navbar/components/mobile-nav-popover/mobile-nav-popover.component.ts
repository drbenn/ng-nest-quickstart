import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'mobile-nav-popover',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-nav-popover.component.html',
  styleUrl: './mobile-nav-popover.component.scss'
})
export class MobileNavPopoverComponent {
  protected navRoutes: any[] = [
    {
      name: 'Landing',
      route: '/'
    },
    {
      name: 'Contact',
      route: '/contact'
    },
  ];

}
