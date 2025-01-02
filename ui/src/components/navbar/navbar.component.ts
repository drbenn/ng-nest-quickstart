import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { PopoverModule } from 'primeng/popover';
import { MobileNavPopoverComponent } from '../mobile-nav-popover/mobile-nav-popover.component';
import { UserNavPopoverComponent } from "../user-nav-popover/user-nav-popover.component";

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive, AvatarModule, AvatarGroupModule, PopoverModule, MobileNavPopoverComponent, UserNavPopoverComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  protected isDarkMode: boolean = true;

  protected toggleDarkMode(): void {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
    this.isDarkMode = !this.isDarkMode;
  }
}
