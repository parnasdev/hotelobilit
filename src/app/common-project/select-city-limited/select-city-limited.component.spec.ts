import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCityLimitedComponent } from './select-city-limited.component';

describe('SelectCityLimitedComponent', () => {
  let component: SelectCityLimitedComponent;
  let fixture: ComponentFixture<SelectCityLimitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCityLimitedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCityLimitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
