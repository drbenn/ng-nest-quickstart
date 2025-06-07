import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { dispatch, Store } from '@ngxs/store';
import { CheckAuthenticatedUser } from '../store/auth/auth.actions';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { DisplayToast } from '../store/app/app.actions';
import { Observable } from 'rxjs';
import { PosthogAnalyticsService } from './services/posthog-analytics.service';


interface City {
  name: string;
  code: string;
}


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, SelectModule, CommonModule, FormsModule, NavbarComponent, FooterComponent, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  private checkAuthenticatedUser = dispatch(CheckAuthenticatedUser);
  private toast$: Observable<ToastMessageOptions | null>;

  constructor (
    private messageService: MessageService,
    private store: Store,
    private posthogAnalyticsService: PosthogAnalyticsService,
    private route: ActivatedRoute
  ) {}

  cities: City[] | undefined;

  selectedCity: City | undefined;

  title = 'ui';
  ngOnInit() {
    console.log('fuck you');
    
    this.route.queryParamMap.subscribe((params) => {
      console.log('app route listiner');
      console.log(params);
      
      
    });
    this.checkAuthenticatedUser();
    this.toast$ = this.store.select((state) => state.appState.toast);
    this.listenForToasts();
    this.cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    this.posthogAnalyticsService.trackFirstVisit(); // Track page views on load
    this.posthogAnalyticsService.trackPageView(); // Track page views on load
  }

  private listenForToasts(): void {
    this.toast$.subscribe((toast: ToastMessageOptions | null) => toast ? this.messageService.add(toast) : null);
  };

}
