import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrsDatePickerComponent } from './prs-date-picker.component';

describe('PrsDatePickerComponent', () => {
  let component: PrsDatePickerComponent;
  let fixture: ComponentFixture<PrsDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrsDatePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrsDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
