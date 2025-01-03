import { Component, EventEmitter, inject, Output } from '@angular/core';
import { dispatch } from '@ngxs/store';
import { LogoutUser } from '../../../../store/auth/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'user-nav-popover',
  imports: [],
  templateUrl: './user-nav-popover.component.html',
  styleUrl: './user-nav-popover.component.scss'
})
export class UserNavPopoverComponent {
  @Output() close = new EventEmitter<void>();
  private logout = dispatch(LogoutUser);
  private router = inject(Router)

  protected signOut(): void {
    this.logout();
    this.close.emit();
    this.router.navigate(['/']);
  };

}
