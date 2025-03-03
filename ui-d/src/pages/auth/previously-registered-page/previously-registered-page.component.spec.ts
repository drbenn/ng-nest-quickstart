import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviouslyRegisteredPageComponent } from './previously-registered-page.component';

describe('PreviouslyRegisteredPageComponent', () => {
  let component: PreviouslyRegisteredPageComponent;
  let fixture: ComponentFixture<PreviouslyRegisteredPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviouslyRegisteredPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviouslyRegisteredPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
