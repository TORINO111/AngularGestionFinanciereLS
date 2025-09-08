import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptesComptablesComponent } from './comptes-comptables.component';

describe('ComptesComptables', () => {
  let component: ComptesComptablesComponent;
  let fixture: ComponentFixture<ComptesComptablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComptesComptablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComptesComptablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
