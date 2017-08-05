import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExperienceComponent } from './list-experience.component';

describe('ListWorkshopComponent', () => {
  let component: ListExperienceComponent;
  let fixture: ComponentFixture<ListExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
