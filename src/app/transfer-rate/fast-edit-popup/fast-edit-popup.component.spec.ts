import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastEditPopupComponent } from './fast-edit-popup.component';

describe('FastEditPopupComponent', () => {
  let component: FastEditPopupComponent;
  let fixture: ComponentFixture<FastEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastEditPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FastEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
