import { TestBed } from '@angular/core/testing';

import { PlanComptableService } from './plan-comptable.service';

describe('PlanComptableService', () => {
  let service: PlanComptableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanComptableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
