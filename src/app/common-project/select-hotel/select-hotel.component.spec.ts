import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHotelComponent } from './select-hotel.component';

describe('SelectHotelComponent', () => {
  let component: SelectHotelComponent;
  let fixture: ComponentFixture<SelectHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectHotelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
