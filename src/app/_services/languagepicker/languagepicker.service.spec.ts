import { TestBed, inject } from '@angular/core/testing';

import { LanguagepickerService } from './languagepicker.service';

describe('LanguagepickerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguagepickerService]
    });
  });

  it('should be created', inject([LanguagepickerService], (service: LanguagepickerService) => {
    expect(service).toBeTruthy();
  }));
});
