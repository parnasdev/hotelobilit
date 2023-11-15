import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChangesComponent } from './group-changes.component';

describe('GroupChangesComponent', () => {
  let component: GroupChangesComponent;
  let fixture: ComponentFixture<GroupChangesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupChangesComponent]
    });
    fixture = TestBed.createComponent(GroupChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
