import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthState, AuthStateModel } from '../../store/auth/auth.state';
import { Store } from '@ngxs/store';
import { environment } from '../../environments/environment';
import { navbarRoutes } from './navbar-routes';

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private destroy$ = new Subject<void>();
  protected isDarkMode: boolean = false;
  protected siteName: string = 'sitename';
  private authState$: Observable<Partial<AuthStateModel>> = inject(Store).select(AuthState.getNavUserData);
  protected authUser: Partial<AuthStateModel> | null = null;
  protected navRoutes = navbarRoutes;


  ngOnInit(): void {
    // this.setInitDarkMode();
    this.listenForUser();
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

  // protected toggleDarkMode(): void {
  //   const element = document.querySelector('html');
  //   element?.classList.toggle('dark');
  //   this.isDarkMode = !this.isDarkMode;
  // };
}
