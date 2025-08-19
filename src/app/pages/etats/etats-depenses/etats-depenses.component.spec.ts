import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatsDepensesComponent } from './etats-depenses.component';

describe('EtatsDepensesComponent', () => {
  let component: EtatsDepensesComponent;
  let fixture: ComponentFixture<EtatsDepensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtatsDepensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatsDepensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
