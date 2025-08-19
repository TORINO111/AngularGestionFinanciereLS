import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionExerciceComponent } from './gestion-exercice.component';

describe('GestionExerciceComponent', () => {
  let component: GestionExerciceComponent;
  let fixture: ComponentFixture<GestionExerciceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionExerciceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionExerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
