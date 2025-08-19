import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAnalytiqueComponent } from './plan-analytique.component';

describe('PlanAnalytiqueComponent', () => {
  let component: PlanAnalytiqueComponent;
  let fixture: ComponentFixture<PlanAnalytiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanAnalytiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAnalytiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
