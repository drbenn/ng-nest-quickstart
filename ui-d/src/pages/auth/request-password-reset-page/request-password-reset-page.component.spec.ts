import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPassswordResetPageComponent } from './request-password-reset-page.component';

describe('RequestPassswordResetPageComponent', () => {
  let component: RequestPassswordResetPageComponent;
  let fixture: ComponentFixture<RequestPassswordResetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPassswordResetPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPassswordResetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
