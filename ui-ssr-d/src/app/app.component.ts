import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ui-ssr-d';


  changeTheme(selectedTheme: string): void {
    console.log('change theme: ', selectedTheme);
    
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }
}
