import { TestBed } from '@angular/core/testing';

import { PlansAnalytiquesService } from './plans-analytiques.service';

describe('PlansAnalytiquesService', () => {
  let service: PlansAnalytiquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlansAnalytiquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
