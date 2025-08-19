import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComptableComponent } from './plan-comptable.component';

describe('PlanComptableComponent', () => {
  let component: PlanComptableComponent;
  let fixture: ComponentFixture<PlanComptableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanComptableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanComptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
