import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsComponentBi } from './operations.component';

describe('OperationsComponentBi', () => {
  let component: OperationsComponentBi;
  let fixture: ComponentFixture<OperationsComponentBi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationsComponentBi ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsComponentBi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
