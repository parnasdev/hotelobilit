import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightReservationListComponent } from './flight-reservation-list.component';

describe('FlightReservationListComponent', () => {
  let component: FlightReservationListComponent;
  let fixture: ComponentFixture<FlightReservationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightReservationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
