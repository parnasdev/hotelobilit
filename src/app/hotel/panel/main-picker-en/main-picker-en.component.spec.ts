import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPickerEnComponent } from './main-picker-en.component';

describe('MainPickerEnComponent', () => {
  let component: MainPickerEnComponent;
  let fixture: ComponentFixture<MainPickerEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPickerEnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPickerEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
