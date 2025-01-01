import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';


interface City {
  name: string;
  code: string;
}


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, SelectModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  cities: City[] | undefined;

  selectedCity: City | undefined;

  title = 'ui';
  ngOnInit() {
    this.cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
  }
toggleDarkMode() {
  const element = document.querySelector('html');
  element?.classList.toggle('my-app-dark');
}
}
