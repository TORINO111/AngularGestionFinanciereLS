import { TestBed } from '@angular/core/testing';

import { ExerciceComptableService } from './exercice-comptable.service';

describe('ExerciceComptableService', () => {
  let service: ExerciceComptableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciceComptableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
