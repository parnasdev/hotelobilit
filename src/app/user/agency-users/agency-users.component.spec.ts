import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyUsersComponent } from './agency-users.component';

describe('AgencyUsersComponent', () => {
  let component: AgencyUsersComponent;
  let fixture: ComponentFixture<AgencyUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
