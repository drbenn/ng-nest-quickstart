import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingUserComponent } from './existing-user.component';

describe('ExistingUserComponent', () => {
  let component: ExistingUserComponent;
  let fixture: ComponentFixture<ExistingUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
