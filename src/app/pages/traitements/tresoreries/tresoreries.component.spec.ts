import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TresoreriesComponent } from './tresoreries.component';

describe('TresoreriesComponent', () => {
  let component: TresoreriesComponent;
  let fixture: ComponentFixture<TresoreriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TresoreriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TresoreriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
