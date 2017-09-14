import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeDatesExperienceComponent } from './see-dates-experience.component';

describe('SeeDatesExperienceComponent', () => {
  let component: SeeDatesExperienceComponent;
  let fixture: ComponentFixture<SeeDatesExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeDatesExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeDatesExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
