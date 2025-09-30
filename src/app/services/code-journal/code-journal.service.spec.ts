import { TestBed } from '@angular/core/testing';

import { CodeJournalService } from './code-journal.service';

describe('CodeJournalService', () => {
  let service: CodeJournalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeJournalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
