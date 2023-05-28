import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPricingModalEnComponent } from './confirm-pricing-modal-en.component';

describe('ConfirmPricingModalEnComponent', () => {
  let component: ConfirmPricingModalEnComponent;
  let fixture: ComponentFixture<ConfirmPricingModalEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmPricingModalEnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmPricingModalEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
