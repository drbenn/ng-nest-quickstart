import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSuccessPendingComponent } from './registration-success-pending.component';

describe('RegistrationSuccessPendingComponent', () => {
  let component: RegistrationSuccessPendingComponent;
  let fixture: ComponentFixture<RegistrationSuccessPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationSuccessPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationSuccessPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
