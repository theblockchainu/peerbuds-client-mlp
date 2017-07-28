import { TestBed, inject } from '@angular/core/testing';

import { CollectionService } from './collection.service';

describe('CollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkshopService]
    });
  });

  it('should be created', inject([CollectionService], (service: CollectionService) => {
    expect(service).toBeTruthy();
  }));
});
