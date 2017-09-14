import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSessionJoinComponent } from './book-session-join.component';

describe('BookSessionJoinComponent', () => {
  let component: BookSessionJoinComponent;
  let fixture: ComponentFixture<BookSessionJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookSessionJoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSessionJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
