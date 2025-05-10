import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthState, AuthStateModel } from '../../store/auth/auth.state';
import { dispatch, Store } from '@ngxs/store';
import { navbarRoutes } from './navbar-routes';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSwatchSolid, heroBars3Solid, heroShoppingCartSolid } from '@ng-icons/heroicons/solid';
import { LogoutUser } from '../../store/auth/auth.actions';
import { CommonModule, DatePipe } from '@angular/common';
import { UpdateTheme } from '../../store/app/app.actions';
import { MobileNavPopoverComponent } from './components/mobile-nav-popover/mobile-nav-popover.component';
import { UserNavPopoverComponent } from './components/user-nav-popover/user-nav-popover.component';
import { DaisyDropdownPopoverComponent } from './components/daisy-dropdown-popover/daisy-dropdown-popover.component';

@Component({
  selector: 'navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIcon, MobileNavPopoverComponent, UserNavPopoverComponent, DaisyDropdownPopoverComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  providers: [provideIcons({ heroSwatchSolid, heroBars3Solid }), DatePipe],
})
export class NavbarComponent {
  private destroy$ = new Subject<void>();
  protected isDarkMode: boolean = false;
  protected siteName: string = 'sitename';
  private authState$: Observable<Partial<AuthStateModel>> = inject(Store).select(AuthState.getNavUserData);
  protected authUser: Partial<AuthStateModel> | null = null;
  protected navRoutes = navbarRoutes;

  protected logoIcon = heroSwatchSolid;
  protected mobileBarsIcon = heroBars3Solid;
  protected shoppingCartIcon = heroShoppingCartSolid;
  
  constructor (private store: Store) {}


  ngOnInit(): void {
    this.listenForUser();    
  }

  ngOnDestroy() {
    // Emit a value to signal completion
    this.destroy$.next();
    this.destroy$.complete();
  };

  private listenForUser(): void {
    this.authState$.pipe(takeUntil(this.destroy$)).subscribe((userData: Partial<AuthStateModel>) => {
      userData.id ? this.authUser = userData : this.authUser = null;
    });
  };

  private updateTheme = dispatch(UpdateTheme);
  activeTheme: string = 'light';         // default light theme
  protected selectTheme(): void {
    if (this.activeTheme === 'light') {
      this.activeTheme = 'dark';           // dark theme
      this.isDarkMode = true;
    } else {
      this.activeTheme = 'light';        // light theme
      this.isDarkMode = false;
    };
    this.updateTheme(this.isDarkMode ? 'dark' : 'light');
  };

  // LOGGED IN USER MENU
  private logout = dispatch(LogoutUser);
  
  protected signOut(): void {
    this.logout();
    // this.close.emit();
  };
}
