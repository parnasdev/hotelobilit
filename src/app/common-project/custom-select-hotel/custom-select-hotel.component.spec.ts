import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectHotelComponent } from './custom-select-hotel.component';

describe('CustomSelectHotelComponent', () => {
  let component: CustomSelectHotelComponent;
  let fixture: ComponentFixture<CustomSelectHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomSelectHotelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSelectHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
