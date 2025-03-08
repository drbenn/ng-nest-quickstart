import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthState, AuthStateModel } from '../../store/auth/auth.state';
import { dispatch, Store } from '@ngxs/store';
import { environment } from '../../environments/environment';
import { navbarRoutes } from './navbar-routes';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSwatchSolid, heroBars3Solid } from '@ng-icons/heroicons/solid';
import { LogoutUser } from '../../store/auth/auth.actions';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIcon],
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


  ngOnInit(): void {
    // this.setInitDarkMode();
    this.listenForUser();
    console.log(this.authUser);
    
  }

  ngOnDestroy() {
    // Emit a value to signal completion
    this.destroy$.next();
    this.destroy$.complete();
  };

  // private setInitDarkMode(): void {
  //   if (environment.darkMode) {
  //     // this.toggleDarkMode();
  //     this.isDarkMode = true;
  //   } else {
  //     this.isDarkMode = false;
  //   }
  // };

  private listenForUser(): void {
    this.authState$.pipe(takeUntil(this.destroy$)).subscribe((userData: Partial<AuthStateModel>) => {
      console.log(userData);
      
      userData.id ? this.authUser = userData : this.authUser = null;
    });
  };

  protected toggleDarkMode(): void {
    // const element = document.querySelector('html');
    // element?.classList.toggle('dark');
    // this.isDarkMode = !this.isDarkMode;
    document.documentElement.setAttribute('data-theme', 'dark');
  };




  // LOGGED IN USER MENU
  private logout = dispatch(LogoutUser);
  protected signOut(): void {
    this.logout();
    // this.close.emit();
  };
}
