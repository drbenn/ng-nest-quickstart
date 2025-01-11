import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { dispatch } from '@ngxs/store';
import { LogoutUser } from '../../../../store/auth/auth.actions';
import { Router } from '@angular/router';
import { AuthStateModel } from '../../../../store/auth/auth.state';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'user-nav-popover',
  imports: [CommonModule],
  templateUrl: './user-nav-popover.component.html',
  styleUrl: './user-nav-popover.component.scss',
  providers: [DatePipe],
})
export class UserNavPopoverComponent implements OnInit {
  @Input() user: Partial<AuthStateModel> | null = null;
  @Output() close = new EventEmitter<void>();
  private logout = dispatch(LogoutUser);
  private router = inject(Router)

  protected signOut(): void {
    this.logout();
    this.close.emit();
  };

  ngOnInit(): void {
    console.log(this.user);
    
  }

}
