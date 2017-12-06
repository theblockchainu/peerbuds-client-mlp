import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceSubmitDialogComponent } from './experience-submit-dialog.component';

describe('ExperienceSubmitDialogComponent', () => {
  let component: ExperienceSubmitDialogComponent;
  let fixture: ComponentFixture<ExperienceSubmitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceSubmitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceSubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
