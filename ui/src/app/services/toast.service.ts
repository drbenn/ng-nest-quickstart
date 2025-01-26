import { Injectable } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastMessageSource = new Subject<ToastMessageOptions>();
  toastMessage$ = this.toastMessageSource.asObservable();

  showToast(message: ToastMessageOptions) {
    this.toastMessageSource.next(message);
  };
}
