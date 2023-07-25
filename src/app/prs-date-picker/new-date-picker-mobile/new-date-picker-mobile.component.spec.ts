import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDatePickerMobileComponent } from './new-date-picker-mobile.component';

describe('NewDatePickerMobileComponent', () => {
  let component: NewDatePickerMobileComponent;
  let fixture: ComponentFixture<NewDatePickerMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDatePickerMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDatePickerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
