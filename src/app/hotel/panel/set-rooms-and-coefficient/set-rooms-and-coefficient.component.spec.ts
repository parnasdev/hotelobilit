import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRoomsAndCoefficientComponent } from './set-rooms-and-coefficient.component';

describe('SetRoomsAndCoefficientComponent', () => {
  let component: SetRoomsAndCoefficientComponent;
  let fixture: ComponentFixture<SetRoomsAndCoefficientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetRoomsAndCoefficientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetRoomsAndCoefficientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
