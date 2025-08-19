import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsSocieteComponent } from './informations-societe.component';

describe('InformationsSocieteComponent', () => {
  let component: InformationsSocieteComponent;
  let fixture: ComponentFixture<InformationsSocieteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationsSocieteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationsSocieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
