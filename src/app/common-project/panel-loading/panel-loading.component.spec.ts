import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLoadingComponent } from './panel-loading.component';

describe('PanelLoadingComponent', () => {
  let component: PanelLoadingComponent;
  let fixture: ComponentFixture<PanelLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelLoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
