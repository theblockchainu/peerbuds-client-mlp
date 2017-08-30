import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopSubmitDialogComponent } from './workshop-submit-dialog.component';

describe('WorkshopSubmitDialogComponent', () => {
  let component: WorkshopSubmitDialogComponent;
  let fixture: ComponentFixture<WorkshopSubmitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopSubmitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopSubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
