import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCityTwoComponent } from './select-city-two.component';

describe('SelectCityTwoComponent', () => {
  let component: SelectCityTwoComponent;
  let fixture: ComponentFixture<SelectCityTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCityTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCityTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
