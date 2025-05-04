import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-daisy-dropdown-popover',
  imports: [],
  templateUrl: './daisy-dropdown-popover.component.html',
  styleUrl: './daisy-dropdown-popover.component.scss'
})
export class DaisyDropdownPopoverComponent implements OnInit {
  @Input() summaryClass!: string;
  @Input() position!: string;
  protected popoverClass: string = 'dropdown dropdown-left';  // rewritten in ngOnInit to include position of menu passed from parent

  // locate dropdown button and listen to DOM to close menu on click outside of menu(standar behavior is for menu to close on click of button menu item, but not close on clicking outside of the menu randomly)
  @ViewChild('detailsDropdown') detailsDropdownRef!: ElementRef<HTMLDetailsElement>;

  // Listen for click events anywhere in the document
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.detailsDropdownRef?.nativeElement.hasAttribute('open')) {
      const clickedInside = this.detailsDropdownRef.nativeElement.contains(event.target as Node);
      if (!clickedInside) {
        this.detailsDropdownRef.nativeElement.removeAttribute('open');
      }
    }
  }
  
  ngOnInit(): void {
    this.popoverClass = `dropdown cursor-default ${this.position}`;
  }

}
