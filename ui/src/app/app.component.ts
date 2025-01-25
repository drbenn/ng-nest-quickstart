import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { dispatch } from '@ngxs/store';
import { CheckAuthenticatedUser } from '../store/auth/auth.actions';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


interface City {
  name: string;
  code: string;
}


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, SelectModule, CommonModule, FormsModule, NavbarComponent, FooterComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent implements OnInit {
private checkAuthenticatedUser = dispatch(CheckAuthenticatedUser);
  
constructor (private messageService: MessageService) {}

  cities: City[] | undefined;

  selectedCity: City | undefined;

  title = 'ui';
  ngOnInit() {
    this.checkAuthenticatedUser();
    this.cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    this.messageService.add({ severity: 'success', summary: 'BOOYAH', detail: 'STARTING APP', life: 6000 });
  }

}
