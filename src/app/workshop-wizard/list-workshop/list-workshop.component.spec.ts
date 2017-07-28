import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkshopComponent } from './list-workshop.component';

describe('ListWorkshopComponent', () => {
  let component: ListWorkshopComponent;
  let fixture: ComponentFixture<ListWorkshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWorkshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
