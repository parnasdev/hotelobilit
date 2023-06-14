import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerBirthDateComponent } from './base-birth-date.component';

describe('DatepickerBirthDateComponent', () => {
  let component: DatepickerBirthDateComponent;
  let fixture: ComponentFixture<DatepickerBirthDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickerBirthDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerBirthDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
