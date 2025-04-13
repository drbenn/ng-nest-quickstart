import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';

@Component({
  selector: 'existing-user-page',
  imports: [CommonModule, StandardPageWrapperComponent, RouterLink, RouterLinkActive],
  templateUrl: './existing-user-page.component.html',
  styleUrl: './existing-user-page.component.scss'
})
export class ExistingUserPageComponent implements OnInit {
  protected email: string | null = null;
  protected provider: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email');
      this.provider = params.get('provider');
    });
  }

}
