import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandardPageWrapperComponent } from '../../../components/standard-page-wrapper/standard-page-wrapper.component';

@Component({
  selector: 'app-existing-user',
  imports: [CommonModule, StandardPageWrapperComponent],
  templateUrl: './existing-user.component.html',
  styleUrl: './existing-user.component.scss'
})
export class ExistingUserComponent implements OnInit {
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
