import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceViewComponent } from './experience-view.component';

describe('ExperienceViewComponent', () => {
  let component: ExperienceViewComponent;
  let fixture: ComponentFixture<ExperienceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
