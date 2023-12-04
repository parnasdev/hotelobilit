import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveFlightListComponent } from './reserve-flight-list.component';

describe('ReserveFlightListComponent', () => {
  let component: ReserveFlightListComponent;
  let fixture: ComponentFixture<ReserveFlightListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReserveFlightListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReserveFlightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
