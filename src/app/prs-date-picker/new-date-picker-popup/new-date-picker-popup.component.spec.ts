import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDatePickerPopupComponent } from './new-date-picker-popup.component';

describe('NewDatePickerPopupComponent', () => {
  let component: NewDatePickerPopupComponent;
  let fixture: ComponentFixture<NewDatePickerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDatePickerPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDatePickerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
