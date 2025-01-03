import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { PopoverModule } from 'primeng/popover';
import { MobileNavPopoverComponent } from './components/mobile-nav-popover/mobile-nav-popover.component';
import { UserNavPopoverComponent } from "./components/user-nav-popover/user-nav-popover.component";
import { environment } from '../../environments/environment';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive, AvatarModule, AvatarGroupModule, PopoverModule, MobileNavPopoverComponent, UserNavPopoverComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  constructor(private primeng: PrimeNG) {}

  protected isDarkMode: boolean = false;
  protected siteName: string = 'sitename';

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

  ngOnInit(): void {
    this.primeng.ripple.set(true);   
    if (environment.darkMode) {
      this.toggleDarkMode();
      this.isDarkMode = true;
    } else {
      this.isDarkMode = false;
    }
  }

  protected toggleDarkMode(): void {
    const element = document.querySelector('html');
    element?.classList.toggle('dark');
    this.isDarkMode = !this.isDarkMode;
  }
}
