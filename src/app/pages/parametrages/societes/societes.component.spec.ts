import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietesComponent } from './societes.component';

describe('SocietesComponent', () => {
  let component: SocietesComponent;
  let fixture: ComponentFixture<SocietesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocietesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
