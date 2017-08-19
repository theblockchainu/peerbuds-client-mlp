import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopVideoComponent } from './workshop-video.component';

describe('WorkshopVideoComponent', () => {
  let component: WorkshopVideoComponent;
  let fixture: ComponentFixture<WorkshopVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
