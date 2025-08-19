import { TestBed } from '@angular/core/testing';

import { SalarieService } from './salarie.service';

describe('SalarieService', () => {
  let service: SalarieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalarieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
