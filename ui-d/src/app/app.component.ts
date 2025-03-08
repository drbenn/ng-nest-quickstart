import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { dispatch, Store } from '@ngxs/store';
import { CheckAuthenticatedUser } from '../store/auth/auth.actions';
import { PosthogAnalyticsService } from './services/posthog-analytics.service';
import { Observable } from 'rxjs';
import { DaisyToastOptions } from '../types/app.types';
import { environment } from '../environments/environment.development';
import { DisplayToast } from '../store/app/app.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private checkAuthenticatedUser = dispatch(CheckAuthenticatedUser);
  private toast$!: Observable<DaisyToastOptions | null>;
  protected toasts: DaisyToastOptions[] = [];

  constructor (
    private store: Store,
    private posthogAnalyticsService: PosthogAnalyticsService
  ) {}

  ngOnInit(): void {
    this.checkAuthenticatedUser();
    this.toast$ = this.store.select((state) => state.appState.toast);
    this.listenForToasts();
    this.posthogAnalyticsService.trackFirstVisit(); // Track page views on load
    this.posthogAnalyticsService.trackPageView(); // Track page views on load
  }
  
  changeTheme(selectedTheme: string): void {
    console.log('change theme: ', selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }

  private displayToast = dispatch(DisplayToast);

  pushToast() {
    this.displayToast({
      title: 'BIG DEAL',
      message: 'YOU DONT LIKEME ??? BITE ME!!!!' + new Date(),
      // bgColor: 'hotpink',
      bgColor: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
      textColor: 'lime',
      displayTime: 3000,
    })
  }


  private listenForToasts(): void {
    this.toast$.subscribe((toast: DaisyToastOptions | null) => {      
      if (toast) {
        this.toasts.unshift(toast);
        setTimeout(() => {
          this.toasts.shift();
        }, toast.displayTime ? toast.displayTime : environment.toastDefaultDisplayTime)
      }
    });
  };
}
