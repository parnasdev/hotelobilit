import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDatePickerSelectComponent } from './new-date-picker-select.component';

describe('NewDatePickerSelectComponent', () => {
  let component: NewDatePickerSelectComponent;
  let fixture: ComponentFixture<NewDatePickerSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDatePickerSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDatePickerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
