import { TestBed } from '@angular/core/testing';

import { TresorerieService } from './tresorerie.service';

describe('TresorerieService', () => {
  let service: TresorerieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TresorerieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
