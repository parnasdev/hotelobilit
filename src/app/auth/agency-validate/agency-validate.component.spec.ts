import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyValidateComponent } from './agency-validate.component';

describe('AgencyValidateComponent', () => {
  let component: AgencyValidateComponent;
  let fixture: ComponentFixture<AgencyValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyValidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
