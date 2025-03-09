import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSwatchSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'footbar',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  providers: [provideIcons({ heroSwatchSolid })],
})
export class FooterComponent {
  protected logoIcon = heroSwatchSolid;
}
