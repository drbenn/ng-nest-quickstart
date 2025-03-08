import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-daisy-dropdown-popover',
  imports: [],
  templateUrl: './daisy-dropdown-popover.component.html',
  styleUrl: './daisy-dropdown-popover.component.scss'
})
export class DaisyDropdownPopoverComponent implements OnInit {
  @Input() summaryClass!: string;
  @Input() position!: string;
  protected popoverClass: string = 'dropdown dropdown-left';

  ngOnInit(): void {
    this.popoverClass = `dropdown cursor-default ${this.popoverClass}`;
  }

}
