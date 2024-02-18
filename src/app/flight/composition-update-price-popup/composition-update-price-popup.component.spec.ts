import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionUpdatePricePopupComponent } from './composition-update-price-popup.component';

describe('CompositionUpdatePricePopupComponent', () => {
  let component: CompositionUpdatePricePopupComponent;
  let fixture: ComponentFixture<CompositionUpdatePricePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompositionUpdatePricePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionUpdatePricePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
