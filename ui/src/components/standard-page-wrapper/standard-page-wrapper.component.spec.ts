import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardPageWrapperComponent } from './standard-page-wrapper.component';

describe('StandardPageWrapperComponent', () => {
  let component: StandardPageWrapperComponent;
  let fixture: ComponentFixture<StandardPageWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardPageWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardPageWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
