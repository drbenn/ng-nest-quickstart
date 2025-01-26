import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { dispatch, Store } from '@ngxs/store';
import { CheckAuthenticatedUser } from '../store/auth/auth.actions';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ToastService } from './services/toast.service';
import { DisplayToast } from '../store/app/app.actions';
import { Observable } from 'rxjs';
import { AppState } from '../store/app/app.state';


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

  constructor (
    private messageService: MessageService,
    private toastService: ToastService,
    private store: Store
  ) {}
  private checkAuthenticatedUser = dispatch(CheckAuthenticatedUser);
  private displayToast = dispatch(DisplayToast);
  private toast$: Observable<ToastMessageOptions | null>;

  cities: City[] | undefined;

  selectedCity: City | undefined;

  title = 'ui';
  ngOnInit() {
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
  }

  private listenForToasts(): void {
    this.toast$.subscribe((toast: ToastMessageOptions | null) => toast ? this.messageService.add(toast) : null);
  };

}
