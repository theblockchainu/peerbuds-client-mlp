import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveVideoDialogComponent } from './live-video-dialog.component';

describe('LiveVideoDialogComponent', () => {
  let component: LiveVideoDialogComponent;
  let fixture: ComponentFixture<LiveVideoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveVideoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
