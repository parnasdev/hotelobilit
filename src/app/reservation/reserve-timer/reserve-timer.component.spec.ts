import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveTimerComponent } from './reserve-timer.component';

describe('ReserveTimerComponent', () => {
  let component: ReserveTimerComponent;
  let fixture: ComponentFixture<ReserveTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReserveTimerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReserveTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
