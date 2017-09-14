import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopCloneDialogComponent } from './workshop-clone-dialog.component';

describe('WorkshopCloneDialogComponent', () => {
  let component: WorkshopCloneDialogComponent;
  let fixture: ComponentFixture<WorkshopCloneDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopCloneDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCloneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
