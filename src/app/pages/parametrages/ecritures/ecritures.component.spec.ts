import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcrituresComponent } from './ecritures.component';

describe('EcrituresComponent', () => {
  let component: EcrituresComponent;
  let fixture: ComponentFixture<EcrituresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcrituresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcrituresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
