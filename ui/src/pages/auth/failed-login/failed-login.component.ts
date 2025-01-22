import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-failed-login',
  imports: [CommonModule, StandardPageWrapperComponent, RouterLink, RouterLinkActive],
  templateUrl: './failed-login.component.html',
  styleUrl: './failed-login.component.scss'
})
export class FailedLoginComponent {
  email: string | null = null;
  provider: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email');
      this.provider = params.get('provider');
    });
  }
}
