import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureOperationsComponent } from './nature-operations.component';

describe('NatureOperationsComponent', () => {
  let component: NatureOperationsComponent;
  let fixture: ComponentFixture<NatureOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NatureOperationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
