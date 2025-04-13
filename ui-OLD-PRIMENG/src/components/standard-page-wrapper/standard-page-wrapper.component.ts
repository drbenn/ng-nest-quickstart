import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'standard-page-wrapper',
  imports: [CommonModule],
  templateUrl: './standard-page-wrapper.component.html',
  styleUrl: './standard-page-wrapper.component.scss'
})
export class StandardPageWrapperComponent implements OnInit {
  protected easeInDurationComplete: boolean = false;

  ngOnInit():void {
    setTimeout(() => {
      this.easeInDurationComplete = true;
    }, 150);
  }
}
