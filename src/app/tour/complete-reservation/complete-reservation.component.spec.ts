import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteReservationComponent } from './complete-reservation.component';

describe('CompleteReservationComponent', () => {
  let component: CompleteReservationComponent;
  let fixture: ComponentFixture<CompleteReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteReservationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
