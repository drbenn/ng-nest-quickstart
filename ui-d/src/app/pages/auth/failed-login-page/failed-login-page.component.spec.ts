import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedLoginPageComponent } from './failed-login-page.component';

describe('FailedLoginPageComponent', () => {
  let component: FailedLoginPageComponent;
  let fixture: ComponentFixture<FailedLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailedLoginPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
