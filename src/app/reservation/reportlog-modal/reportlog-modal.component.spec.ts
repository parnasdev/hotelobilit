import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportlogModalComponent } from './reportlog-modal.component';

describe('ReportlogModalComponent', () => {
  let component: ReportlogModalComponent;
  let fixture: ComponentFixture<ReportlogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportlogModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportlogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
