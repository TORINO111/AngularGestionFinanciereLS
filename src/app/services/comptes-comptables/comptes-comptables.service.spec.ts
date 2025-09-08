import { TestBed } from '@angular/core/testing';

import { CompteComptableService } from './comptes-comptables.service';

describe('ComptesComptablesService', () => {
  let service: CompteComptableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompteComptableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
