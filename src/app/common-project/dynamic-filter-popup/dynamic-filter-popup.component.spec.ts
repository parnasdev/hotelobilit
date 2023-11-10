import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFilterPopupComponent } from './dynamic-filter-popup.component';

describe('DynamicFilterPopupComponent', () => {
  let component: DynamicFilterPopupComponent;
  let fixture: ComponentFixture<DynamicFilterPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFilterPopupComponent]
    });
    fixture = TestBed.createComponent(DynamicFilterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
