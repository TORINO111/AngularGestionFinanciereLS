import { TestBed } from '@angular/core/testing';

import { ControlesFormulairesService } from './controles-formulaires.service';

describe('ControlesFormulairesService', () => {
  let service: ControlesFormulairesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlesFormulairesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
