import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferServiceComponent } from './transfer-service.component';

describe('TransferServiceComponent', () => {
  let component: TransferServiceComponent;
  let fixture: ComponentFixture<TransferServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
