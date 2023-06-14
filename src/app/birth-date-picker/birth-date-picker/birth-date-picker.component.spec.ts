import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthDatePickerComponent } from './birth-date-picker.component';

describe('BirthDatePickerComponent', () => {
  let component: BirthDatePickerComponent;
  let fixture: ComponentFixture<BirthDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BirthDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
