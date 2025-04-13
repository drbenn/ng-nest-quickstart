import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaisyDropdownPopoverComponent } from './daisy-dropdown-popover.component';

describe('DaisyDropdownPopoverComponent', () => {
  let component: DaisyDropdownPopoverComponent;
  let fixture: ComponentFixture<DaisyDropdownPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaisyDropdownPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaisyDropdownPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
