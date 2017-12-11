import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendiesPopupComponent } from './attendies-dialog.component';

describe('ContentOnlineComponent', () => {
  let component: AttendiesPopupComponent;
  let fixture: ComponentFixture<AttendiesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendiesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendiesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
