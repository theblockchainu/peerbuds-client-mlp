import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceVideoComponent } from './experience-video.component';

describe('ExperienceVideoComponent', () => {
  let component: ExperienceVideoComponent;
  let fixture: ComponentFixture<ExperienceVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
