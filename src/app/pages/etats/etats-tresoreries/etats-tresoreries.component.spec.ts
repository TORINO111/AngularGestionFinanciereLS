import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatsTresoreriesComponent } from './etats-tresoreries.component';

describe('EtatsTresoreriesComponent', () => {
  let component: EtatsTresoreriesComponent;
  let fixture: ComponentFixture<EtatsTresoreriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtatsTresoreriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatsTresoreriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
