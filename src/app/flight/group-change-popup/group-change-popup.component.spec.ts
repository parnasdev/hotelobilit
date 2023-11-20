import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChangePopupComponent } from './group-change-popup.component';

describe('GroupChangePopupComponent', () => {
  let component: GroupChangePopupComponent;
  let fixture: ComponentFixture<GroupChangePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupChangePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupChangePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
