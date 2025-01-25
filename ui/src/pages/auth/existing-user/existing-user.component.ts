import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';

@Component({
  selector: 'app-existing-user',
  imports: [CommonModule, StandardPageWrapperComponent, RouterLink, RouterLinkActive],
  templateUrl: './existing-user.component.html',
  styleUrl: './existing-user.component.scss'
})
export class ExistingUserComponent implements OnInit {
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
