import { TestBed } from '@angular/core/testing';

import { TypeJournal } from './type-journal';

describe('TypeJournal', () => {
  let service: TypeJournal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeJournal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
