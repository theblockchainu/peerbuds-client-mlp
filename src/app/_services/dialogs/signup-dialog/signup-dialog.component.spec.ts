import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponentDialog } from './signup-dialog.component';

describe('SignupComponentDialog', () => {
  let component: SignupComponentDialog;
  let fixture: ComponentFixture<SignupComponentDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponentDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponentDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});