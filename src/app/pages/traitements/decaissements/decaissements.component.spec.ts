import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecaissementsComponent } from './decaissements.component';

describe('DecaissementsComponent', () => {
  let component: DecaissementsComponent;
  let fixture: ComponentFixture<DecaissementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecaissementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecaissementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
