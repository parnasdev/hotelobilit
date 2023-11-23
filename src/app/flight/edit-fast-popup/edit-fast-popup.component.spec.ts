import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFastPopupComponent } from './edit-fast-popup.component';

describe('EditFastPopupComponent', () => {
  let component: EditFastPopupComponent;
  let fixture: ComponentFixture<EditFastPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFastPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFastPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
