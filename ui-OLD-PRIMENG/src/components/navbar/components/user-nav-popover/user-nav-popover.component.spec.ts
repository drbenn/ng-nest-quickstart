import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavPopoverComponent } from './user-nav-popover.component';

describe('UserNavPopoverComponent', () => {
  let component: UserNavPopoverComponent;
  let fixture: ComponentFixture<UserNavPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNavPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNavPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
