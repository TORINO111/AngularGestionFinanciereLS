import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalairesComponent } from './salaires.component';

describe('SalairesComponent', () => {
  let component: SalairesComponent;
  let fixture: ComponentFixture<SalairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalairesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
