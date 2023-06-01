import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPhoneComponent } from './confirm-phone.component';

describe('ConfirmPhoneComponent', () => {
  let component: ConfirmPhoneComponent;
  let fixture: ComponentFixture<ConfirmPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmPhoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
