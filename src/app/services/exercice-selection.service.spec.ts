import { TestBed } from '@angular/core/testing';

import { ExerciceSelectionService } from './exercice-selection.service';

describe('ExerciceSelectionService', () => {
  let service: ExerciceSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciceSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
