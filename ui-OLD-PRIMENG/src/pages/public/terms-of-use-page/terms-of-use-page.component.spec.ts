import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfUsePageComponent } from './terms-of-use-page.component';

describe('TermsOfUsePageComponent', () => {
  let component: TermsOfUsePageComponent;
  let fixture: ComponentFixture<TermsOfUsePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsOfUsePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsOfUsePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
