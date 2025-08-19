import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcrituresComptablesComponent } from './ecritures-comptables.component';

describe('EcrituresComptablesComponent', () => {
  let component: EcrituresComptablesComponent;
  let fixture: ComponentFixture<EcrituresComptablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcrituresComptablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcrituresComptablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
