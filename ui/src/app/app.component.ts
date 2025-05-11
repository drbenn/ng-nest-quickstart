import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { dispatch, select, Store } from '@ngxs/store';
import { PosthogAnalyticsService } from './services/posthog-analytics.service';
import { Observable } from 'rxjs';
import { DaisyToastOptions } from './types/app.types';
import { environment } from '../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DisplayToast } from './store/app/app.actions';
import { ChatBoxComponent } from './features/chat/chat-box/chat-box.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChatBubbleLeftRightSolid } from '@ng-icons/heroicons/solid';
import { AuthState } from './store/auth/auth.state';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, ChatBoxComponent, NgIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [provideIcons({heroChatBubbleLeftRightSolid })],
})
export class AppComponent implements OnInit {
  theme$: Observable<string> = inject(Store).select((state) => state.appState.theme);
  private toast$!: Observable<DaisyToastOptions | null>;
  protected toasts: DaisyToastOptions[] = [];
  protected userId = select(AuthState.getUserId);

  constructor (
    private store: Store,
    private posthogAnalyticsService: PosthogAnalyticsService
  ) {}

  ngOnInit(): void {
    this.toast$ = this.store.select((state) => state.appState.toast);
    this.listenForTheme();
    this.listenForToasts();
    this.posthogAnalyticsService.trackFirstVisit(); // Track page views on load
    this.posthogAnalyticsService.trackPageView(); // Track page views on load
  }

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

  private listenForTheme(): void {
    this.theme$.subscribe((theme: string) => {
      // set theme 
      const lightTheme: string = environment.lightDaisyTheme;
      const darkTheme: string = environment.darkDaisyTheme;
      theme === 'light' ? this.changeTheme(lightTheme) : this.changeTheme(darkTheme);
    });
  };

  private changeTheme(selectedTheme: string): void {
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }

  private displayToast = dispatch(DisplayToast);
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

  protected isChatOpen: boolean = false;
  protected chatIcon = heroChatBubbleLeftRightSolid;
  protected openChatBox(): void {
    this.isChatOpen = true;
  }

  protected closeChatBox(): void {
    this.isChatOpen = false;
  }
}
