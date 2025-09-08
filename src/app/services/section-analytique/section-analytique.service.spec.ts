import { TestBed } from '@angular/core/testing';

import { SectionAnalytiqueService } from './section-analytique.service';

describe('SectionsAnalytiques', () => {
  let service: SectionAnalytiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionAnalytiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
