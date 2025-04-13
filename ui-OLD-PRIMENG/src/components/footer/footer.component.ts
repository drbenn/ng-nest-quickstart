import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'footer',
  imports: [RouterLink, RouterLinkActive, DividerModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  protected siteName: string = 'sitename';

}
