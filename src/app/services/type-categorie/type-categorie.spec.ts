import { TestBed } from '@angular/core/testing';

import { TypeCategorie } from './type-categorie.service';

describe('TypeCategorie', () => {
  let service: TypeCategorie;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeCategorie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
