import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';

@Component({
  selector: 'failed-login-page',
  imports: [CommonModule, StandardPageWrapperComponent, RouterLink, RouterLinkActive],
  templateUrl: './failed-login-page.component.html',
  styleUrl: './failed-login-page.component.scss'
})
export class FailedLoginPageComponent {
  protected email: string | null = null;
  protected provider: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email');
    });
  }
}
