import { TestBed } from '@angular/core/testing';

import { SocieteSelectionService } from './societe-selection.service';

describe('SocieteSelectionService', () => {
  let service: SocieteSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocieteSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
