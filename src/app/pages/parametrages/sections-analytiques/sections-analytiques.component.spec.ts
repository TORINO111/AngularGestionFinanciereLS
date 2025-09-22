import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionsAnalytiquesComponent } from './sections-analytiques.component';

describe('SectionsAnalytiquesComponent', () => {
  let component: SectionsAnalytiquesComponent;
  let fixture: ComponentFixture<SectionsAnalytiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionsAnalytiquesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionsAnalytiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
