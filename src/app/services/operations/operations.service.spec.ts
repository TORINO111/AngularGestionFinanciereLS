import { TestBed } from '@angular/core/testing';

import { NatureOperationService } from './operations.service';

describe('NatureOperationService', () => {
  let service: NatureOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NatureOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
