import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { navbarRoutes } from '../../navbar-routes';

@Component({
  selector: 'mobile-nav-popover',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-nav-popover.component.html',
  styleUrl: './mobile-nav-popover.component.scss'
})
export class MobileNavPopoverComponent {
  @Input() isUserLoggedIn: boolean = false;
  protected navRoutes = navbarRoutes;
}
