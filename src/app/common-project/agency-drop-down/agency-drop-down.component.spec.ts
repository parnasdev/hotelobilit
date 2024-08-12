import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyDropDownComponent } from './agency-drop-down.component';

describe('AgencyDropDownComponent', () => {
  let component: AgencyDropDownComponent;
  let fixture: ComponentFixture<AgencyDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyDropDownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
