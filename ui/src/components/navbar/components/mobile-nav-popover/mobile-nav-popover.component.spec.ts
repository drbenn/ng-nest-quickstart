import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNavPopoverComponent } from './mobile-nav-popover.component';

describe('MobileNavPopoverComponent', () => {
  let component: MobileNavPopoverComponent;
  let fixture: ComponentFixture<MobileNavPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNavPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileNavPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
