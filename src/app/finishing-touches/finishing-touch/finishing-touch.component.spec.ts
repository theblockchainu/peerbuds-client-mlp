import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishingTouchComponent } from './finishing-touch.component';

describe('FinishingTouchComponent', () => {
  let component: FinishingTouchComponent;
  let fixture: ComponentFixture<FinishingTouchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishingTouchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishingTouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
