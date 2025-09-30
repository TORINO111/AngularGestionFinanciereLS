import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeJournalComponent } from './code-journal.component';

describe('CodeJournalComponent', () => {
  let component: CodeJournalComponent;
  let fixture: ComponentFixture<CodeJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeJournalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
