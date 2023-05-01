import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseRoomAndFlightComponent } from './choose-room-and-flight.component';

describe('ChooseRoomAndFlightComponent', () => {
  let component: ChooseRoomAndFlightComponent;
  let fixture: ComponentFixture<ChooseRoomAndFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseRoomAndFlightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseRoomAndFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
