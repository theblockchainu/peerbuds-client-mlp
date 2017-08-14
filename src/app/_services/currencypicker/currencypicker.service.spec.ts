import { TestBed, inject } from '@angular/core/testing';

import { CurrencypickerService } from './currencypicker.service';

describe('CurrencypickerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencypickerService]
    });
  });

  it('should be created', inject([CurrencypickerService], (service: CurrencypickerService) => {
    expect(service).toBeTruthy();
  }));
});
