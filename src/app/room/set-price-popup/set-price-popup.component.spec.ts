import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPricePopupComponent } from './set-price-popup.component';

describe('SetPricePopupComponent', () => {
  let component: SetPricePopupComponent;
  let fixture: ComponentFixture<SetPricePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetPricePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPricePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
