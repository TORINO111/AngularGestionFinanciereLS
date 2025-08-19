import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatsRecettesComponent } from './etats-recettes.component';

describe('EtatsRecettesComponent', () => {
  let component: EtatsRecettesComponent;
  let fixture: ComponentFixture<EtatsRecettesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtatsRecettesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatsRecettesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
