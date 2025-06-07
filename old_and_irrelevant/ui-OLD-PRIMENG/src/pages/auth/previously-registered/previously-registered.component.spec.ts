import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviouslyRegisteredComponent } from './previously-registered.component';

describe('PreviouslyRegisteredComponent', () => {
  let component: PreviouslyRegisteredComponent;
  let fixture: ComponentFixture<PreviouslyRegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviouslyRegisteredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviouslyRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
