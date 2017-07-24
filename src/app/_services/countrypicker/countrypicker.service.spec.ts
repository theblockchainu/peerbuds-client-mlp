import { TestBed, inject } from '@angular/core/testing';

import { CountrypickerService } from './countrypicker.service';

describe('CountrypickerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountrypickerService]
    });
  });

  it('should be created', inject([CountrypickerService], (service: CountrypickerService) => {
    expect(service).toBeTruthy();
  }));
});
