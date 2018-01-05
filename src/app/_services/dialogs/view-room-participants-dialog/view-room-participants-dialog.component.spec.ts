import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoomParticipantsDialogComponent } from './view-room-participants.component';

describe('ViewRoomParticipantsDialogComponent', () => {
  let component: ViewRoomParticipantsDialogComponent;
  let fixture: ComponentFixture<ViewRoomParticipantsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRoomParticipantsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoomParticipantsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
