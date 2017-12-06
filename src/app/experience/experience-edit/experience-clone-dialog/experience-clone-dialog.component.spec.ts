import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceCloneDialogComponent } from './experience-clone-dialog.component';

describe('ExperienceCloneDialogComponent', () => {
  let component: ExperienceCloneDialogComponent;
  let fixture: ComponentFixture<ExperienceCloneDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceCloneDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceCloneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
