import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeJournal } from './type-journal';

describe('TypeJournal', () => {
  let component: TypeJournal;
  let fixture: ComponentFixture<TypeJournal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeJournal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeJournal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
