import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFilterHorizontalComponent } from './dynamic-filter-horizontal.component';

describe('DynamicFilterHorizontalComponent', () => {
  let component: DynamicFilterHorizontalComponent;
  let fixture: ComponentFixture<DynamicFilterHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFilterHorizontalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFilterHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
