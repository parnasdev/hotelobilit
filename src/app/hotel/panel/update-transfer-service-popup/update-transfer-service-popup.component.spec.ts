import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransferServicePopupComponent } from './update-transfer-service-popup.component';

describe('UpdateTransferServicePopupComponent', () => {
  let component: UpdateTransferServicePopupComponent;
  let fixture: ComponentFixture<UpdateTransferServicePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTransferServicePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTransferServicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
